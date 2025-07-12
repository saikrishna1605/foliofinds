"use server";

import clientPromise from "@/lib/mongodb";
import type { Book, Cart, Order } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { type WithId, type Document } from "mongodb";

const { NEXT_PUBLIC_PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET, PAYPAL_API_BASE } = process.env;

const serializeCart = (cart: WithId<Document> | null): Cart | null => {
    if (!cart) return null;
    
    return {
        id: cart._id.toString(),
        userId: cart.userId,
        items: cart.items.map((item: Book) => ({
            ...item,
            createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : undefined,
        })),
        createdAt: new Date(cart.createdAt).toISOString(),
        updatedAt: new Date(cart.updatedAt).toISOString(),
    };
};

async function getDb() {
    const client = await clientPromise;
    return client.db("Folio");
}

async function getPayPalAccessToken() {
    if (!NEXT_PUBLIC_PAYPAL_CLIENT_ID || !PAYPAL_APP_SECRET) {
        throw new Error("Missing PayPal credentials in .env file");
    }
    const auth = Buffer.from(`${NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString("base64");
    const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${auth}`,
        },
        body: "grant_type=client_credentials",
    });
    const data = await response.json();
    return data.access_token;
}

export async function getCart(userId: string): Promise<Cart | null> {
    const db = await getDb();
    const cart = await db.collection('carts').findOne({ userId });
    return serializeCart(cart as WithId<Document> | null);
}

export async function addToCart(userId: string, item: Book): Promise<Cart | null> {
    const db = await getDb();
    
    if (!item.id) throw new Error("Item must have an ID to be added to cart.");
    
    const existingCart = await db.collection('carts').findOne({ userId, "items.id": item.id });
    if (existingCart) {
        return serializeCart(existingCart as WithId<Document>);
    }

    const result = await db.collection<Cart>('carts').findOneAndUpdate(
        { userId },
        { 
            $push: { items: item },
            $setOnInsert: { userId, createdAt: new Date() },
            $set: { updatedAt: new Date() }
        },
        { upsert: true, returnDocument: 'after' }
    );
    
    revalidatePath('/cart');
    return serializeCart(result as WithId<Document> | null);
}

export async function removeFromCart(userId: string, itemId: string): Promise<Cart | null> {
    const db = await getDb();
    const result = await db.collection<Cart>('carts').findOneAndUpdate(
        { userId },
        { $pull: { items: { id: itemId } } },
        { returnDocument: 'after' }
    );
    
    revalidatePath('/cart');
    return serializeCart(result as WithId<Document> | null);
}

export async function createPaypalOrder(totalAmount: number) {
    try {
        const accessToken = await getPayPalAccessToken();
        const url = `${PAYPAL_API_BASE}/v2/checkout/orders`;

        // Note: PayPal might not support INR for all sandbox accounts. 
        // Using USD for broader compatibility in testing.
        // You can change "USD" to "INR" if your sandbox account is configured for it.
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: "USD",
                            // A simple conversion for testing. Update this for production.
                            value: (totalAmount / 83).toFixed(2), 
                        },
                    },
                ],
            }),
        });

        const data = await response.json();
        if (response.ok) {
            return { orderId: data.id };
        } else {
            console.error("PayPal order creation failed:", data);
            return { error: data.message || "Failed to create PayPal order." };
        }
    } catch (error) {
        console.error("Error creating PayPal order:", error);
        return { error: "An internal error occurred. Please try again." };
    }
}

export async function capturePaypalOrder(orderId: string) {
    try {
        const accessToken = await getPayPalAccessToken();
        const url = `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`;
    
        const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        });
    
        const data = await response.json();
        if (response.ok) {
            return { success: true, order: data };
        } else {
            console.error("PayPal capture failed:", data);
            return { success: false, error: data.message || "Failed to capture payment." };
        }
    } catch (error) {
        console.error("Error capturing PayPal order:", error);
        return { success: false, error: "An internal error occurred. Please try again." };
    }
}


export async function saveOrder(userId: string, cart: Cart, paypalOrderId: string) {
    const db = await getDb();
    
    const newOrder: Omit<Order, 'id'> = {
        userId,
        items: cart.items,
        totalAmount: cart.items.reduce((total, item) => total + item.price, 0),
        paymentId: paypalOrderId,
        status: 'paid',
        createdAt: new Date(),
    };

    try {
        const result = await db.collection('orders').insertOne(newOrder);

        // Clear the cart
        await db.collection('carts').deleteOne({ userId });

        revalidatePath('/cart');
        revalidatePath('/dashboard');
        
        return { success: true, orderId: result.insertedId.toString() };

    } catch (error) {
        console.error("Failed to save order:", error);
        return { success: false, message: "Database Error: Could not save your order." };
    }
}

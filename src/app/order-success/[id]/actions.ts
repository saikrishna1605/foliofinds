"use server";

import clientPromise from "@/lib/mongodb";
import type { Order } from "@/lib/types";
import { ObjectId, WithId, Document } from "mongodb";

export async function getOrderDetails(orderId: string): Promise<Order | null> {
    if (!ObjectId.isValid(orderId)) {
        return null;
    }

    try {
        const client = await clientPromise;
        const db = client.db("Folio");

        const order = await db.collection('orders').findOne({ _id: new ObjectId(orderId) });

        if (!order) {
            return null;
        }

        const orderWithIdString = order as WithId<Document>;

        return {
            id: orderWithIdString._id.toString(),
            userId: orderWithIdString.userId,
            items: orderWithIdString.items,
            totalAmount: orderWithIdString.totalAmount,
            paymentId: orderWithIdString.paymentId,
            status: orderWithIdString.status,
            createdAt: orderWithIdString.createdAt,
        };

    } catch (error) {
        console.error("Failed to fetch order:", error);
        return null;
    }
}

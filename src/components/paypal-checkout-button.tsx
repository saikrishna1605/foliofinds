"use client";

import { useAuth } from "@/components/auth-provider";
import { useCart } from "@/components/cart-provider";
import { useToast } from "@/hooks/use-toast";
import {
    PayPalButtons,
    usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createPaypalOrder, capturePaypalOrder, saveOrder } from "@/app/cart/actions";
import { Loader2 } from "lucide-react";

export function PaypalCheckoutButton() {
    const { user } = useAuth();
    const { cart, cartTotal, clearCart } = useCart();
    const { toast } = useToast();
    const router = useRouter();
    const [{ isPending }] = usePayPalScriptReducer();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCreateOrder = async (): Promise<string> => {
        if (!cart || cartTotal <= 0) {
            toast({ variant: "destructive", title: "Your cart is empty." });
            return '';
        }

        const res = await createPaypalOrder(cartTotal);

        if (res.orderId) {
            return res.orderId;
        } else {
            toast({ variant: "destructive", title: "Error", description: res.error });
            return '';
        }
    };

    const handleOnApprove = async (data: { orderID: string }) => {
        if (!user || !cart) return;
        setIsProcessing(true);

        try {
            const captureResponse = await capturePaypalOrder(data.orderID);

            if (captureResponse.success) {
                const saveResponse = await saveOrder(user.uid, cart, data.orderID);
                if (saveResponse.success && saveResponse.orderId) {
                    toast({ title: 'Payment Successful!', description: 'Your order has been placed.' });
                    clearCart();
                    router.push(`/order-success/${saveResponse.orderId}`);
                } else {
                    toast({ variant: 'destructive', title: 'Order Failed', description: saveResponse.message });
                    setIsProcessing(false);
                }
            } else {
                toast({ variant: 'destructive', title: 'Payment Failed', description: captureResponse.error });
                setIsProcessing(false);
            }
        } catch (error) {
            console.error("Order processing error:", error);
            toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred while processing your order." });
            setIsProcessing(false);
        }
    };

    if (isPending || isProcessing) {
        return (
            <div className="w-full flex justify-center items-center h-12 bg-muted rounded-md">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <PayPalButtons
            style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
            createOrder={handleCreateOrder}
            onApprove={handleOnApprove}
            onError={(err) => {
                console.error("PayPal Error:", err);
                toast({ variant: "destructive", title: "PayPal Error", description: "An unexpected error occurred with PayPal." });
                setIsProcessing(false);
            }}
            disabled={isProcessing || !cartTotal}
        />
    );
}

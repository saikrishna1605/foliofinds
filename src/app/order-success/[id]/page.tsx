import { CheckCircle } from "lucide-react";
import { getOrderDetails } from "./actions";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export default async function OrderSuccessPage({ params }: { params: { id: string } }) {
    const order = await getOrderDetails(params.id);

    if (!order) {
        notFound();
    }

    return (
        <div className="container py-12">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-green-100 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                            <CheckCircle className="h-10 w-10 text-green-600" />
                        </div>
                        <CardTitle className="text-3xl font-headline">Thank You For Your Order!</CardTitle>
                        <p className="text-muted-foreground">Your payment was successful and your order is confirmed.</p>
                        <p className="text-sm text-muted-foreground pt-2">Order ID: {order.id}</p>
                    </CardHeader>
                    <CardContent>
                        <Separator className="my-4" />
                        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                        <ul className="space-y-3 mb-4">
                           {order.items.map(item => (
                               <li key={item.id} className="flex justify-between items-center">
                                   <div className="flex items-center gap-4">
                                        <Image src={item.imageUrl} alt={item.title} width={40} height={60} className="rounded object-cover" />
                                        <div>
                                            <p className="font-medium">{item.title}</p>
                                            <p className="text-sm text-muted-foreground">by {item.author}</p>
                                        </div>
                                   </div>
                                   <p className="font-semibold">Rs. {item.price.toFixed(2)}</p>
                               </li>
                           ))}
                        </ul>
                        <Separator className="my-4" />
                        <div className="flex justify-between font-bold text-xl">
                            <p>Total</p>
                            <p>Rs. {order.totalAmount.toFixed(2)}</p>
                        </div>
                        <Button asChild size="lg" className="w-full mt-8">
                            <Link href="/">Continue Shopping</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

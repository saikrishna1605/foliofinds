"use client";

import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth-provider";
import Image from "next/image";
import { Loader2, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { PaypalCheckoutButton } from "@/components/paypal-checkout-button";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function CartPage() {
    const { cart, cartCount, cartTotal, removeFromCart, isLoading } = useCart();
    const { user } = useAuth();
    
    const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

    if (isLoading) {
        return <div className="container py-12 flex justify-center items-center"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>
    }

    return (
        <PayPalScriptProvider options={{ clientId: paypalClientId || "", currency: "USD", intent: "capture" }}>
            <div className="container py-12">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold font-headline">Shopping Cart</h1>
                    <p className="text-muted-foreground mt-1">You have {cartCount} item{cartCount !== 1 ? 's' : ''} in your cart.</p>
                </header>

                {cartCount > 0 && paypalClientId ? (
                    <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
                        <div className="lg:col-span-2">
                           <Card>
                                <CardContent className="p-0">
                                    <ul className="divide-y">
                                        {cart?.items.map((item, index) => (
                                            <li key={item.id} className="flex items-start gap-6 p-6">
                                                <div className="relative w-24 h-36 flex-shrink-0">
                                                    <Image src={item.imageUrl} alt={item.title} layout="fill" className="rounded object-cover" data-ai-hint="book cover"/>
                                                </div>
                                                <div className="flex-grow">
                                                    <Link href={`/books/${item.id}`} className="hover:underline">
                                                        <h2 className="font-headline text-lg mb-1">{item.title}</h2>
                                                    </Link>
                                                    <p className="text-sm text-muted-foreground mb-2">by {item.author}</p>
                                                    <Badge variant="outline">{item.condition}</Badge>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className="font-bold text-lg mb-2">Rs. {item.price.toFixed(2)}</p>
                                                    <Button variant="outline" size="icon" onClick={() => item.id && removeFromCart(item.id)} className="h-8 w-8">
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                        <span className="sr-only">Remove item</span>
                                                    </Button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                           </Card>
                        </div>
                        <div className="lg:col-span-1">
                            <Card className="sticky top-24">
                                <CardHeader>
                                    <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Subtotal</span>
                                        <span>Rs. {cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Shipping & Handling</span>
                                        <span>Free</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-bold text-xl">
                                        <span>Order Total</span>
                                        <span>Rs. {cartTotal.toFixed(2)}</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4">
                                    { user ? (
                                        <div className="w-full">
                                            <PaypalCheckoutButton />
                                        </div>
                                    ) : (
                                        <Button className="w-full" asChild size="lg">
                                            <Link href="/login">Login to Checkout</Link>
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 px-6 border-2 border-dashed rounded-lg flex flex-col items-center">
                        <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4"/>
                        <h2 className="text-2xl font-semibold mb-2">{cartCount === 0 ? "Your cart is empty" : "Payment Gateway Not Configured"}</h2>
                        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                            {cartCount === 0 ? "Looks like you haven't added any books yet. Time to find your next great read!" : "The PayPal Client ID is missing. Please add it to your environment variables to enable checkout."}
                        </p>
                        <Button asChild size="lg">
                            <Link href="/">Start Browsing</Link>
                        </Button>
                    </div>
                )}
            </div>
        </PayPalScriptProvider>
    )
}

"use client";

import { Card, CardContent } from '@/components/ui/card';

export default function ChatsPage() {

    return (
        <div className="container py-12">
            <header className="mb-8">
                <h1 className="text-4xl font-bold font-headline">Messages</h1>
                <p className="text-muted-foreground">The direct messaging feature is no longer available.</p>
            </header>
            <Card>
                <CardContent className="p-0">
                    <div className="text-center p-12">
                        <h3 className="text-xl font-semibold">Feature Disabled</h3>
                        <p className="text-muted-foreground mt-2">Use the AI chatbot or Live Support for assistance.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

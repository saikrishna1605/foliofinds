"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bot, X, Send, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { folioBot } from '@/ai/flows';
import { ScrollArea } from './ui/scroll-area';
import { useAuth } from './auth-provider';

type Message = {
    sender: 'user' | 'bot';
    text: string;
};

export function Chatbot() {
    const { user, isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'bot', text: 'Hello! I am FolioBot. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (input.trim() === '') return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const botInput = {
                message: input,
                user: isAuthenticated && user ? { name: user.name, email: user.email } : undefined,
            };
            const result = await folioBot(botInput);
            const botMessage: Message = { sender: 'bot', text: result.response };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage: Message = { sender: 'bot', text: 'Sorry, I am having trouble connecting. Please try again later.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    }

    return (
        <>
            <div className="fixed bottom-6 right-6 z-[60]">
                <Button onClick={() => setIsOpen(!isOpen)} size="icon" className="rounded-full w-14 h-14 shadow-lg">
                    {isOpen ? <X /> : <Bot />}
                </Button>
            </div>
            {isOpen && (
                <Card className="fixed bottom-24 right-6 z-[60] w-80 h-[28rem] flex flex-col shadow-2xl animate-in fade-in-50 slide-in-from-bottom-10 duration-300">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-headline">FolioBot</CardTitle>
                    </CardHeader>
                    <ScrollArea className="flex-1">
                        <CardContent className="space-y-4 p-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`px-3 py-2 rounded-lg max-w-[80%] ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="px-3 py-2 rounded-lg bg-muted">
                                        <Loader2 className="animate-spin h-4 w-4" />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </ScrollArea>
                    <CardFooter className="p-2 border-t">
                        <div className="flex w-full items-center space-x-2">
                             <Input
                                placeholder="Ask a question..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isLoading}
                             />
                             <Button onClick={handleSend} size="icon" disabled={isLoading}>
                                 <Send className="h-4 w-4" />
                             </Button>
                        </div>
                    </CardFooter>
                </Card>
            )}
        </>
    );
}

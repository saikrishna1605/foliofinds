"use client";

import { useState } from 'react';
import { BookCard } from "@/components/book-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Book } from "@/lib/types";
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/components/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { createListing } from './actions';
import { redirect } from 'next/navigation';

export default function SellPage() {
    const { user, isAuthenticated, loading } = useAuth();
    const { toast } = useToast();
    
    const [book, setBook] = useState<Omit<Book, 'id' | 'seller'>>({
        title: "Your Book Title",
        author: "Author Name",
        condition: "Good",
        price: 999,
        imageUrl: "https://placehold.co/300x400.png",
        description: "A brief, compelling description of your book."
    });

    if (loading) return null; // Or a loading spinner

    if (!isAuthenticated || !user) {
        redirect('/login');
    }

    const livePreviewBook: Book = {
        ...book,
        seller: { id: user.uid, name: user.name, avatarUrl: user.image || "https://placehold.co/40x40.png" },
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setBook(prev => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));
    };
    
    const handleConditionChange = (value: Book['condition']) => {
        setBook(prev => ({ ...prev, condition: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setBook(prev => ({ ...prev, imageUrl: result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (book.imageUrl === "https://placehold.co/300x400.png") {
            toast({ variant: 'destructive', title: 'Please upload a book cover image.' });
            return;
        }

        const result = await createListing(livePreviewBook);

        if (result?.message) {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
        } else {
            toast({ title: 'Success!', description: 'Your book has been listed for sale.'});
        }
    };

    return (
        <div className="container py-12">
            <header className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Sell Your Book</h1>
                <p className="text-lg text-muted-foreground mt-2">Fill out the form below to list your book for sale.</p>
            </header>
            <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-12 items-start">
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline">Book Details</CardTitle>
                                <CardDescription>Provide information about the book you want to sell.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" name="title" value={book.title} onChange={handleInputChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="author">Author</Label>
                                    <Input id="author" name="author" value={book.author} onChange={handleInputChange} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price (Rs.)</Label>
                                        <Input id="price" name="price" type="number" value={book.price} onChange={handleInputChange} required/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="condition">Condition</Label>
                                        <Select onValueChange={handleConditionChange} value={book.condition} required>
                                            <SelectTrigger id="condition">
                                                <SelectValue placeholder="Select condition" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="New">New</SelectItem>
                                                <SelectItem value="Like New">Like New</SelectItem>
                                                <SelectItem value="Good">Good</SelectItem>
                                                <SelectItem value="Fair">Fair</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" name="description" value={book.description} onChange={handleInputChange} required/>
                                </div>
                                <div className="space-y-2">
                                    <Label>Book Cover Image</Label>
                                    <div className="flex items-center justify-center w-full">
                                        <label htmlFor="dropzone-file" className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                                            {book.imageUrl && book.imageUrl !== 'https://placehold.co/300x400.png' ? (
                                                 <Image src={book.imageUrl} alt="Book cover preview" layout="fill" objectFit="contain" className="rounded-lg p-2" />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                </div>
                                            )}
                                            <input id="dropzone-file" type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                        </label>
                                    </div> 
                                </div>
                                <Button size="lg" className="w-full" type="submit">Post Your Listing</Button>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold font-headline text-center">Live Preview</h2>
                        <div className="sticky top-24">
                            <BookCard book={livePreviewBook} />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

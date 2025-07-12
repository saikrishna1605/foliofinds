"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Book } from "@/lib/types";
import { Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/components/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { redirect, useParams } from 'next/navigation';
import { updateListing } from './actions';
import { getBookById } from '@/app/books/[id]/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { BookCard } from '@/components/book-card';

function EditListingFormSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-20 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-32 w-full" />
                </div>
                <Skeleton className="h-12 w-full" />
            </CardContent>
        </Card>
    );
}

export default function EditListingPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const params = useParams();
    const listingId = params.id as string;

    const [listing, setListing] = useState<Omit<Book, 'id' | 'seller' | 'createdAt'> | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!listingId) return;

        getBookById(listingId).then(data => {
            if (data) {
                const { id, seller, createdAt, ...listingData } = data;
                setListing(listingData);
                setImagePreview(data.imageUrl);
            }
            setPageLoading(false);
        });
    }, [listingId]);

    if (authLoading) return null;

    if (!isAuthenticated || !user) {
        redirect('/login');
    }

    if (pageLoading) {
        return (
            <div className="container py-12">
                 <div className="grid md:grid-cols-2 gap-12 items-start">
                    <div>
                        <EditListingFormSkeleton />
                    </div>
                     <div className="space-y-4">
                        <h2 className="text-2xl font-bold font-headline text-center">Live Preview</h2>
                         <div className="sticky top-24">
                            <Skeleton className="w-full aspect-[3/4] rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (!listing) {
        return (
            <div className="container py-12 text-center">
                <h1 className="text-2xl font-bold">Listing not found</h1>
                <p>The listing you are trying to edit does not exist or you do not have permission to edit it.</p>
            </div>
        )
    }

    const livePreviewBook: Book = {
        id: listingId,
        ...listing,
        seller: { id: user.uid, name: user.name, avatarUrl: user.image || "https://placehold.co/40x40.png" },
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setListing(prev => prev ? { ...prev, [name]: name === 'price' ? Number(value) : value } : null);
    };

    const handleConditionChange = (value: Book['condition']) => {
        setListing(prev => prev ? { ...prev, condition: value } : null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
                setListing(l => l ? {...l, imageUrl: result} : null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!listing) return;
        
        setIsSubmitting(true);
        const result = await updateListing(listingId, listing, user.uid);

        if (result?.message) {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
            setIsSubmitting(false);
        } else {
            toast({ title: 'Success!', description: 'Your listing has been updated.' });
            // Redirect is handled in server action
        }
    };

    return (
        <div className="container py-12">
            <header className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Edit Your Listing</h1>
                <p className="text-lg text-muted-foreground mt-2">Update the details for your book.</p>
            </header>
            <form onSubmit={handleSubmit}>
                 <div className="grid md:grid-cols-2 gap-12 items-start">
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline">Book Details</CardTitle>
                                <CardDescription>Update information about the book you want to sell.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" name="title" value={listing.title} onChange={handleInputChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="author">Author</Label>
                                    <Input id="author" name="author" value={listing.author} onChange={handleInputChange} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price (Rs.)</Label>
                                        <Input id="price" name="price" type="number" value={listing.price} onChange={handleInputChange} required/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="condition">Condition</Label>
                                        <Select onValueChange={handleConditionChange} value={listing.condition} required>
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
                                    <Textarea id="description" name="description" value={listing.description} onChange={handleInputChange} required/>
                                </div>
                                <div className="space-y-2">
                                    <Label>Book Cover Image</Label>
                                    <div className="flex items-center justify-center w-full">
                                        <label htmlFor="dropzone-file" className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                                            {imagePreview ? (
                                                 <Image src={imagePreview} alt="Book cover preview" layout="fill" objectFit="contain" className="rounded-lg p-2" />
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
                                <Button size="lg" className="w-full" type="submit" disabled={isSubmitting}>
                                     {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                     {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                     <div className="space-y-4">
                        <h2 className="text-2xl font-bold font-headline text-center">Live Preview</h2>
                        <div className="sticky top-24">
                           {listing && <BookCard book={livePreviewBook} />}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

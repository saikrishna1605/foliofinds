"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/components/auth-provider";
import { redirect } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { createPost } from "./actions";
import type { Post } from "@/lib/types";

export default function CreateBlogPage() {
    const { user, isAuthenticated, loading } = useAuth();
    const { toast } = useToast();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    if (loading) return null; // Or a loading spinner

    if (!isAuthenticated || !user) {
        redirect('/login');
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const author = {
            id: user.uid,
            name: user.name,
            avatarUrl: user.image || 'https://placehold.co/40x40.png'
        };

        const result = await createPost({ title, content, imageUrl: imagePreview }, author);

        if (result?.message) {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
        } else {
            toast({ title: 'Success!', description: 'Your blog post has been published.' });
            // Redirect is handled in the action
        }
    }

    return (
        <div className="container py-12">
            <Card className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle className="font-headline text-3xl">Create a New Blog Post</CardTitle>
                        <CardDescription>Share your thoughts and stories with the community.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Post Title</Label>
                            <Input id="title" placeholder="Your amazing blog post title" className="text-lg h-12" value={title} onChange={e => setTitle(e.target.value)} required />
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Featured Image (Optional)</Label>
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="dropzone-file" className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                                    {imagePreview ? (
                                        <Image src={imagePreview} alt="Featured image preview" layout="fill" objectFit="cover" className="rounded-lg" />
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

                        <div className="space-y-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea id="content" placeholder="Write your heart out..." rows={15} value={content} onChange={e => setContent(e.target.value)} required />
                        </div>
                        
                        <Button size="lg" className="w-full" type="submit">Publish Post</Button>
                    </CardContent>
                </form>
            </Card>
        </div>
    )
}

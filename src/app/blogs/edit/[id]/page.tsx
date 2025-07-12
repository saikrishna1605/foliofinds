"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Loader2 } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/components/auth-provider";
import { redirect, useParams } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { getPostById } from "../../actions";
import { updatePost } from "./actions";
import type { Post } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

function EditPostFormSkeleton() {
    return (
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <Skeleton className="h-9 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-12 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-48 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-40 w-full" />
                </div>
                <Skeleton className="h-12 w-full" />
            </CardContent>
        </Card>
    );
}


export default function EditBlogPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const params = useParams();
    const postId = params.id as string;

    const [post, setPost] = useState<Omit<Post, 'id' | 'createdAt' | 'author'> | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!postId) return;

        getPostById(postId).then(data => {
            if (data) {
                setPost({
                    title: data.title,
                    content: data.content,
                    imageUrl: data.imageUrl,
                });
                setImagePreview(data.imageUrl || null);
            }
            setPageLoading(false);
        });
    }, [postId]);

    if (authLoading) return null;

    if (!isAuthenticated || !user) {
        redirect('/login');
    }
    
    if (pageLoading) {
        return (
            <div className="container py-12">
                <EditPostFormSkeleton />
            </div>
        );
    }
    
    if (!post) {
        return (
            <div className="container py-12 text-center">
                <h1 className="text-2xl font-bold">Post not found</h1>
                <p>The post you are trying to edit does not exist or you do not have permission to edit it.</p>
            </div>
        )
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
                setPost(p => p ? {...p, imageUrl: result} : null);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!post) return;
        
        setIsSubmitting(true);

        const result = await updatePost(postId, post, user.uid);

        if (result?.message) {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
            setIsSubmitting(false);
        } else {
            toast({ title: 'Success!', description: 'Your blog post has been updated.' });
            // Redirect is handled in the server action
        }
    }

    return (
        <div className="container py-12">
            <Card className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle className="font-headline text-3xl">Edit Blog Post</CardTitle>
                        <CardDescription>Make changes to your post and save them.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Post Title</Label>
                            <Input id="title" placeholder="Your amazing blog post title" className="text-lg h-12" value={post.title} onChange={e => setPost(p => p ? { ...p, title: e.target.value } : null)} required />
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
                            <Textarea id="content" placeholder="Write your heart out..." rows={15} value={post.content} onChange={e => setPost(p => p ? { ...p, content: e.target.value } : null)} required />
                        </div>
                        
                        <Button size="lg" className="w-full" type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </CardContent>
                </form>
            </Card>
        </div>
    )
}

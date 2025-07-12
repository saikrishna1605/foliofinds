"use client";

import { useEffect, useState, useTransition } from "react";
import Link from 'next/link';
import { useAuth } from "@/components/auth-provider";
import type { Post } from "@/lib/types";
import { getUserPosts, deletePost } from './actions';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

export function PostsTab() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<Post | null>(null);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    useEffect(() => {
        if (user) {
            setIsLoading(true);
            getUserPosts(user.uid).then(data => {
                setPosts(data);
                setIsLoading(false);
            });
        }
    }, [user]);

    const handleDeleteClick = (post: Post) => {
        setPostToDelete(post);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!postToDelete || !user) return;
    
        startTransition(async () => {
          const result = await deletePost(postToDelete.id!, user.uid);
          if (result?.error) {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
          } else {
            setPosts(currentPosts => currentPosts.filter(p => p.id !== postToDelete.id));
            toast({ title: 'Success', description: 'Post deleted successfully.' });
          }
          setIsDeleteDialogOpen(false);
          setPostToDelete(null);
        });
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        )
    }

    return (
        <>
            {posts.length > 0 ? (
                <ul className="space-y-4">
                    {posts.map(post => (
                        <li key={post.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                            <span>{post.title}</span>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/blogs/edit/${post.id}`}>Edit</Link>
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(post)} disabled={isPending}>
                                    Delete
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : <p>You have not published any blog posts yet.</p>}

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your post.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmDelete} disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isPending ? "Deleting..." : "Continue"}
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    ) 
}

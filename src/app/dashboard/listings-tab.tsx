"use client";

import { useEffect, useState, useTransition } from "react";
import Link from 'next/link';
import { useAuth } from "@/components/auth-provider";
import type { Book } from "@/lib/types";
import { getUserListings, deleteListing } from './actions';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

export function ListingsTab() {
    const { user } = useAuth();
    const [listings, setListings] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [listingToDelete, setListingToDelete] = useState<Book | null>(null);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    useEffect(() => {
        if (user) {
            setIsLoading(true);
            getUserListings(user.uid).then(data => {
                setListings(data);
                setIsLoading(false);
            });
        }
    }, [user]);

    const handleDeleteClick = (listing: Book) => {
        setListingToDelete(listing);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!listingToDelete || !user) return;
    
        startTransition(async () => {
          const result = await deleteListing(listingToDelete.id!, user.uid);
          if (result?.error) {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
          } else {
            setListings(currentListings => currentListings.filter(l => l.id !== listingToDelete.id));
            toast({ title: 'Success', description: 'Listing deleted successfully.' });
          }
          setIsDeleteDialogOpen(false);
          setListingToDelete(null);
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
            {listings.length > 0 ? (
                <ul className="space-y-4">
                    {listings.map(listing => (
                        <li key={listing.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                            <span>{listing.title}</span>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">Rs. {listing.price}</span>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/sell/edit/${listing.id}`}>Edit</Link>
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(listing)} disabled={isPending}>
                                    Delete
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : <p>You have not listed any books for sale yet.</p>}

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your book listing.
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
    );
}

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import clientPromise from '@/lib/mongodb';
import type { Book } from '@/lib/types';
import { ObjectId } from 'mongodb';

export async function updateListing(listingId: string, listingData: Omit<Book, 'id' | 'seller' | 'createdAt'>, userId: string) {
    try {
        const client = await clientPromise;
        const db = client.db("Folio");
        
        if (!ObjectId.isValid(listingId)) {
            return { message: 'Invalid Listing ID.' };
        }

        const listingToUpdate = await db.collection('books').findOne({ _id: new ObjectId(listingId) });

        if (!listingToUpdate) {
            return { message: 'Listing not found.' };
        }

        if (listingToUpdate.seller.id !== userId) {
            return { message: 'You are not authorized to edit this listing.' };
        }

        await db.collection('books').updateOne(
            { _id: new ObjectId(listingId) },
            { $set: listingData }
        );

        revalidatePath('/dashboard');
        revalidatePath('/');
        revalidatePath(`/books/${listingId}`);

    } catch (error) {
        console.error('Failed to update listing:', error);
        return {
            message: 'Database Error: Failed to Update Listing.',
        };
    }
    redirect('/dashboard');
}

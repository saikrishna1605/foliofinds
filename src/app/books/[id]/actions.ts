'use server';

import clientPromise from '@/lib/mongodb';
import type { Book } from '@/lib/types';
import { ObjectId } from 'mongodb';

export async function getBookById(id: string): Promise<Book | null> {
    try {
        const client = await clientPromise;
        const db = client.db("Folio");

        if (!ObjectId.isValid(id)) {
            return null;
        }

        const book = await db.collection('books').findOne({ _id: new ObjectId(id) });

        if (!book) {
            return null;
        }

        return {
            id: book._id.toString(),
            title: book.title,
            author: book.author,
            condition: book.condition,
            price: book.price,
            imageUrl: book.imageUrl,
            seller: book.seller,
            description: book.description,
            createdAt: book.createdAt,
        };
    } catch (error) {
        console.error('Failed to fetch book:', error);
        // In a real app, you might want to log this error to a service
        return null;
    }
}

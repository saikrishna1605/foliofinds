'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import clientPromise from '@/lib/mongodb';
import type { Book } from '@/lib/types';

export async function createListing(bookData: Omit<Book, 'id'>) {
  try {
    const client = await clientPromise;
      const db = client.db("Folio");
    
    const newBook = {
        ...bookData,
        createdAt: new Date(),
    };

    await db.collection('books').insertOne(newBook);

    revalidatePath('/');
    revalidatePath('/dashboard');
  } catch (error) {
    console.error('Failed to create listing:', error);
    return {
      message: 'Database Error: Failed to Create Listing.',
    };
  }
  redirect('/');
}

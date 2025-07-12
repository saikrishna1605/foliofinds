'use server';

import clientPromise from '@/lib/mongodb';
import type { Book } from '@/lib/types';
import { WithId, Document } from 'mongodb';

export async function searchBooks(query: string): Promise<Book[]> {
  if (!query) {
    return [];
  }

  try {
    const client = await clientPromise;
    const db = client.db("Folio");
    
    // Using a case-insensitive regex search on title, author, and description
    const books = await db
      .collection("books")
      .find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { author: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      })
      .sort({ createdAt: -1 })
      .limit(20) // Limit results to prevent large payloads
      .toArray();
  
    return books.map((book: WithId<Document>) => ({
      id: book._id.toString(),
      title: book.title,
      author: book.author,
      condition: book.condition,
      price: book.price,
      imageUrl: book.imageUrl,
      seller: book.seller,
      description: book.description,
      createdAt: book.createdAt,
    }));
  } catch (e) {
    console.error('Search error:', e);
    return [];
  }
}

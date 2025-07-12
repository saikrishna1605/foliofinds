'use server';

import clientPromise from '@/lib/mongodb';
import type { Book, Post } from '@/lib/types';
import { WithId, Document, ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';

export async function getUserListings(userId: string): Promise<Book[]> {
  try {
    const client = await clientPromise;
    const db = client.db("Folio");
    
    const books = await db
      .collection("books")
      .find({ 'seller.id': userId })
      .sort({ createdAt: -1 })
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
  } catch (error) {
    console.error("Error fetching user listings:", error);
    return [];
  }
}

export async function getUserPosts(userId: string): Promise<Post[]> {
  try {
    const client = await clientPromise;
    const db = client.db("Folio");

    const posts = await db
      .collection("posts")
      .find({ 'author.id': userId })
      .sort({ createdAt: -1 })
      .toArray();
    
    return posts.map((post: WithId<Document>) => ({
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl,
      author: post.author,
      createdAt: post.createdAt,
    }));
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return [];
  }
}

export async function deletePost(postId: string, userId: string): Promise<{ error?: string }> {
  if (!postId || !userId) {
    return { error: 'Invalid input provided.' };
  }
  try {
    const client = await clientPromise;
    const db = client.db("Folio");
    
    if (!ObjectId.isValid(postId)) {
        return { error: 'Invalid Post ID.' };
    }

    const postToDelete = await db.collection("posts").findOne({ _id: new ObjectId(postId) });

    if (!postToDelete) {
      return { error: "Post not found." };
    }

    if (postToDelete.author.id !== userId) {
      return { error: "You are not authorized to delete this post." };
    }

    await db.collection("posts").deleteOne({ _id: new ObjectId(postId) });

    revalidatePath('/dashboard');
    revalidatePath('/blogs');
    revalidatePath(`/blogs/${postId}`);

    return {};
  } catch (error) {
    console.error("Error deleting post:", error);
    return { error: "Database Error: Failed to delete post." };
  }
}

export async function deleteListing(listingId: string, userId: string): Promise<{ error?: string }> {
  if (!listingId || !userId) {
    return { error: 'Invalid input provided.' };
  }
  try {
    const client = await clientPromise;
    const db = client.db("Folio");
    
    if (!ObjectId.isValid(listingId)) {
      return { error: "Invalid Listing ID." };
    }
    
    const listingToDelete = await db.collection("books").findOne({ _id: new ObjectId(listingId) });

    if (!listingToDelete) {
      return { error: "Listing not found." };
    }

    if (listingToDelete.seller.id !== userId) {
      return { error: "You are not authorized to delete this listing." };
    }

    await db.collection("books").deleteOne({ _id: new ObjectId(listingId) });

    revalidatePath('/dashboard');
    revalidatePath('/'); // Revalidate home page where listings are shown

    return {};
  } catch (error) {
    console.error("Error deleting listing:", error);
    return { error: "Database Error: Failed to delete listing." };
  }
}

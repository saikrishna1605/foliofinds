'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import clientPromise from '@/lib/mongodb';
import type { Post } from '@/lib/types';

export async function createPost(postData: Omit<Post, 'id' | 'createdAt' | 'author'>, author: Post['author']) {
  try {
    const client = await clientPromise;
    const db = client.db("Folio");
    
    const newPost: Omit<Post, 'id'> = {
        ...postData,
        author,
        createdAt: new Date(),
    };

    await db.collection('posts').insertOne(newPost);

    revalidatePath('/blogs');
  } catch (error) {
    console.error('Failed to create post:', error);
    return {
      message: 'Database Error: Failed to Create Post.',
    };
  }
  redirect('/blogs');
}

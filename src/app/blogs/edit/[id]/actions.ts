'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import clientPromise from '@/lib/mongodb';
import type { Post } from '@/lib/types';
import { ObjectId, WithId, Document } from 'mongodb';

export async function updatePost(postId: string, postData: Omit<Post, 'id' | 'createdAt' | 'author'>, userId: string) {
    try {
        const client = await clientPromise;
        const db = client.db("Folio");
        
        if (!ObjectId.isValid(postId)) {
            return { message: 'Invalid Post ID.' };
        }

        const postToUpdate = await db.collection('posts').findOne({ _id: new ObjectId(postId) });

        if (!postToUpdate) {
            return { message: 'Post not found.' };
        }

        if (postToUpdate.author.id !== userId) {
            return { message: 'You are not authorized to edit this post.' };
        }

        await db.collection('posts').updateOne(
            { _id: new ObjectId(postId) },
            { $set: postData }
        );

        revalidatePath('/blogs');
        revalidatePath(`/blogs/${postId}`);
        revalidatePath('/dashboard');
    } catch (error) {
        console.error('Failed to update post:', error);
        return {
            message: 'Database Error: Failed to Update Post.',
        };
    }
    redirect('/dashboard');
}

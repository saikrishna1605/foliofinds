'use server';

import clientPromise from '@/lib/mongodb';
import type { Post } from '@/lib/types';
import { ObjectId } from 'mongodb';

export async function getPostById(id: string): Promise<Post | null> {
    try {
        const client = await clientPromise;
        const db = client.db("Folio");

        if (!ObjectId.isValid(id)) {
            return null;
        }

        const post = await db.collection('posts').findOne({ _id: new ObjectId(id) });

        if (!post) {
            return null;
        }

        return {
            id: post._id.toString(),
            title: post.title,
            content: post.content,
            imageUrl: post.imageUrl,
            author: post.author,
            createdAt: post.createdAt,
        };
    } catch (error) {
        console.error('Failed to fetch post:', error);
        return null;
    }
}

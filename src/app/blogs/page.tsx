import { BlogPostCard } from '@/components/blog-post-card';
import { Button } from '@/components/ui/button';
import type { Post } from '@/lib/types';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import clientPromise from "@/lib/mongodb";
import { WithId, Document } from "mongodb";

async function getPosts(): Promise<Post[]> {
    const client = await clientPromise;
    const db = client.db("Folio");
    
    const posts = await db
      .collection("posts")
      .find({})
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
  }

export default async function BlogsPage() {
    const posts = await getPosts();
    return (
        <div className="container py-12">
            <header className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Our Blog</h1>
                    <p className="text-lg text-muted-foreground mt-2">Insights, stories, and tips from our community.</p>
                </div>
                <Button asChild>
                    <Link href="/blogs/create">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Post
                    </Link>
                </Button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map(post => (
                    <BlogPostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}

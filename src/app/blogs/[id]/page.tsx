
import { getPostById } from '../actions';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';

export default async function BlogPostPage({ params }: { params: { id: string } }) {
    const post = await getPostById(params.id);

    if (!post) {
        notFound();
    }

    return (
        <div className="container py-12">
            <main className="grid md:grid-cols-3 gap-8 lg:gap-12">
                <div className="md:col-span-2">
                    <article className="space-y-8">
                        <header className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary leading-tight">{post.title}</h1>
                            <div className="flex items-center gap-4 text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
                                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-foreground">{post.author.name}</p>
                                        <p className="text-sm">
                                            Posted on {format(new Date(post.createdAt), "PPP")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </header>
                        
                        <Separator />
                        
                        <div className="text-lg text-foreground/90 leading-relaxed whitespace-pre-wrap">
                            {post.content}
                        </div>
                    </article>
                </div>
                <div className="md:col-span-1">
                    {post.imageUrl && (
                         <div className="sticky top-24">
                            <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden shadow-lg">
                                <Image
                                    src={post.imageUrl}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    data-ai-hint="blog lifestyle"
                                    priority
                                />
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

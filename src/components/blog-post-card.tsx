import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Post } from "@/lib/types";
import { format } from "date-fns";

interface BlogPostCardProps {
  post: Post;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
      <Link href={`/blogs/${post.id}`} className="flex-grow flex flex-col">
        <CardHeader className="p-0">
          {post.imageUrl && (
            <div className="aspect-video w-full overflow-hidden">
              <Image
                src={post.imageUrl}
                alt={post.title}
                width={400}
                height={225}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                data-ai-hint="blog lifestyle"
              />
            </div>
          )}
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-xl font-headline leading-tight mb-2">{post.title}</CardTitle>
          <p className="text-sm text-muted-foreground line-clamp-3">{post.content}</p>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <p className="text-sm font-medium">{post.author.name}</p>
                <p className="text-xs text-muted-foreground">{format(post.createdAt, "PPP")}</p>
            </div>
        </div>
      </CardFooter>
    </Card>
  );
}

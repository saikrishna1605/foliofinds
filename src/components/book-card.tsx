import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Book } from "@/lib/types";

interface BookCardProps {
  book: Book;
}

const CardLinkWrapper = ({ book, children }: { book: Book, children: React.ReactNode }) => {
  if (book.id) {
    return (
      <Link href={`/books/${book.id}`} className="flex-grow flex flex-col">
        {children}
      </Link>
    );
  }
  return <div className="flex-grow flex flex-col">{children}</div>;
};

export function BookCard({ book }: BookCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
      <CardLinkWrapper book={book}>
        <CardHeader className="p-0">
          <div className="aspect-[3/4] w-full overflow-hidden">
            <Image
              src={book.imageUrl}
              alt={book.title}
              width={300}
              height={400}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="book cover"
            />
          </div>
        </CardHeader>
        <CardContent className="p-2 flex-grow">
          <Badge variant="outline" className="mb-1 text-xs">{book.condition}</Badge>
          <CardTitle className="text-sm font-headline leading-tight mb-0.5">{book.title}</CardTitle>
          <p className="text-xs text-muted-foreground">by {book.author}</p>
        </CardContent>
      </CardLinkWrapper>
      <CardFooter className="p-2 pt-0 flex justify-between items-center">
        <div>
          <p className="text-base font-bold font-headline text-primary">Rs. {book.price}</p>
          <div className="flex items-center gap-2 mt-1">
            <Avatar className="h-5 w-5">
              <AvatarImage src={book.seller.avatarUrl} alt={book.seller.name} />
              <AvatarFallback>{book.seller.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{book.seller.name}</span>
          </div>
        </div>
        <Link href={`/books/${book.id}`}>
          <Button size="sm" className="h-8 rounded-md px-2.5">View</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}


"use client";

import { getBookById } from './actions';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { BookOpenText, ShoppingCart, Loader2 } from 'lucide-react';
import { useCart } from '@/components/cart-provider';
import { useEffect, useState } from 'react';
import type { Book } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

function BookDetailsSkeleton() {
    return (
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="md:col-span-1">
                <Skeleton className="aspect-[3/4] w-full rounded-lg" />
            </div>
            <div className="md:col-span-2 space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <div className="flex items-center gap-4">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-20" />
                </div>
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-12 w-48" />
            </div>
        </div>
    );
}


export default function BookDetailsPage() {
  const params = useParams();
  const { addToCart, cart } = useCart();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
        getBookById(params.id as string).then(fetchedBook => {
            if (fetchedBook) {
                setBook(fetchedBook);
            }
            setLoading(false);
        });
    }
  }, [params.id]);

  if (loading) {
    return (
        <div className="container py-12">
            <BookDetailsSkeleton />
        </div>
    );
  }

  if (!book) {
    notFound();
  }

  const isAlreadyInCart = cart?.items.some(item => item.id === book.id) ?? false;

  return (
    <div className="container py-12">
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div className="md:col-span-1">
            <div className="sticky top-24">
                <Card className="overflow-hidden">
                    <div className="aspect-[3/4] w-full relative">
                        <Image
                        src={book.imageUrl}
                        alt={book.title}
                        fill
                        className="object-cover"
                        data-ai-hint="book cover"
                        />
                    </div>
                </Card>
            </div>
        </div>
        <div className="md:col-span-2">
            <h1 className="text-4xl font-bold font-headline mb-2">{book.title}</h1>
            <p className="text-xl text-muted-foreground mb-4">by {book.author}</p>

            <div className="flex items-center gap-4 mb-6">
                <p className="text-3xl font-bold font-headline text-primary">Rs. {book.price}</p>
                <Badge variant="outline" className="text-base px-3 py-1">{book.condition}</Badge>
            </div>
            
            <Card className="mb-6 bg-muted/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                        <BookOpenText className="w-6 h-6 text-primary"/>
                        Book Description
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">{book.description}</p>
                </CardContent>
            </Card>

            <Button size="lg" className="w-full md:w-auto mb-6" onClick={() => addToCart(book)} disabled={isAlreadyInCart}>
                <ShoppingCart className="mr-2" />
                {isAlreadyInCart ? 'Already in Cart' : 'Add to Cart'}
            </Button>

            <Separator className="my-6" />

            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold mb-2">Seller Information</h2>
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={book.seller.avatarUrl} alt={book.seller.name} />
                            <AvatarFallback>{book.seller.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{book.seller.name}</p>
                            <p className="text-sm text-muted-foreground">Member since {new Date(book.seller.id).getFullYear()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

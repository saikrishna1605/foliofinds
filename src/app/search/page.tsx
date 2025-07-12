
import { BookCard } from "@/components/book-card";
import { searchBooks } from "./actions";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchX } from "lucide-react";

function SearchResultsSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="w-full aspect-[3/4] rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            ))}
        </div>
    )
}

async function SearchResults({ query }: { query: string }) {
    const books = await searchBooks(query);

    return (
        <>
            {books.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {books.map((book) => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 px-6 border-2 border-dashed rounded-lg flex flex-col items-center">
                    <SearchX className="h-16 w-16 text-muted-foreground mb-4"/>
                    <h2 className="text-2xl font-semibold">No results found for "{query}"</h2>
                    <p className="text-muted-foreground mt-2">Try checking your spelling or searching for something else.</p>
                </div>
            )}
        </>
    );
}

export default function SearchPage({
  searchParams,
}: {
  searchParams?: {
    q?: string;
  };
}) {
    const query = searchParams?.q || '';

    return (
        <div className="container py-12">
            <header className="mb-12">
                <h1 className="text-4xl font-bold font-headline">Search Results</h1>
                {query && <p className="text-lg text-muted-foreground mt-2">Showing results for: <span className="font-semibold text-primary">{query}</span></p>}
            </header>
            <Suspense fallback={<SearchResultsSkeleton />}>
                <SearchResults query={query} />
            </Suspense>
        </div>
    );
}

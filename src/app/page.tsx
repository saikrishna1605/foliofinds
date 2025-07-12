import { BookCard } from "@/components/book-card";
import type { Book } from "@/lib/types";
import clientPromise from "@/lib/mongodb";
import { getDirectDb } from "@/lib/db-direct"; // Import alternative connection
import { WithId, Document } from "mongodb";
import ThreeDModelClientWrapper from "./ThreeDModelClientWrapper"; // Import the 3D model component
// Temporarily commented out due to compatibility issues with Next.js 15
// import { HomeModelViewer } from "@/components/home-model-viewer";

async function getBooks(): Promise<Book[]> {
  try {
    console.log("Attempting to get books...");
    let db;
    
    try {
      // Try primary connection method
      const client = await clientPromise;
      db = client.db("Folio");
    } catch (connErr) {
      console.error("Primary connection failed, trying direct connection:", connErr);
      // Fallback to direct connection
      db = await getDirectDb();
    }
    
    const books = await db
      .collection("books")
      .find({})
      .sort({ createdAt: -1 })
      .limit(12)
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
    }));
  } catch (e) {
    console.error(e);
    return [];
  }
}

export default async function Home() {
  const books = await getBooks();
  return (
    <>
      <section className="container py-8 md:py-12">
        <div className="mb-8 flex justify-center">
          <ThreeDModelClientWrapper />
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-4">Find Your Next Read</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover thousands of used books from sellers near you. Your next adventure is just a page turn away.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {books.length > 0 ? (
            books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground">No books have been listed yet. Be the first!</p>
          )}
        </div>
      </section>
    </>
  );
}

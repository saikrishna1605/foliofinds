
export type Seller = {
  id: string; // Corresponds to Firebase UID
  name: string;
  avatarUrl: string;
};

export type Book = {
  id?: string; // MongoDB _id as a string
  title: string;
  author: string;
  condition: "New" | "Like New" | "Good" | "Fair";
  price: number;
  imageUrl: string; // Will be a data URI
  seller: Seller;
  description: string;
  createdAt?: Date;
};

export type Post = {
    id: string; // MongoDB _id as a string
    title: string;
    content: string;
    imageUrl?: string | null; // data URI
    author: Seller;
    createdAt: Date;
}

export type CartItem = Book;

export type Cart = {
  id?: string;
  userId: string;
  items: CartItem[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export type Order = {
  id: string; // MongoDB _id as a string
  userId: string;
  items: CartItem[];
  totalAmount: number;
  paymentId: string; // The PayPal Order ID
  status: 'paid';
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  image: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  category: Category;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface CreateProductPayload {
  categoryId: string;
  description: string;
  images: string[];
  name: string;
  price: number;
}

export interface UpdateProductPayload {
  description?: string;
  name?: string;
  price?: number;
  images?: string[];
  categoryId?: string;
}

// 1. Fürdőruha termék
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    sizes: string[];
    colors: string[];
    categoryId: string;
    imageUrls: string[];
    featured: boolean;
    inStock: boolean;
    rating: number;
    createdAt: Date;
  }
  
  // 2. Felhasználó
  export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    address?: Address;
    orders: Order[];
    wishlist: string[]; // termék ID-k
    createdAt: Date;
  }
  
  // 3. Rendelés
  export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    totalAmount: number;
    shippingAddress: Address;
    status: OrderStatus;
    paymentMethod: string;
    createdAt: Date;
  }
  
  // 4. Rendelési tétel
  export interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    size: string;
    color: string;
    unitPrice: number;
    totalPrice: number;
  }
  
  // 5. Kategória
  export interface Category {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
    parentCategoryId?: string;
  }
  
  // Kiegészítő típusok
  export interface Address {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  }
  
  export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled'
  }
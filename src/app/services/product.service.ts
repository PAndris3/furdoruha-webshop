import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Product, Category } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      id: '1',
      name: 'Klasszikus bikini',
      description: 'Elegáns, klasszikus szabású bikini minden alkalomra.',
      price: 12990,
      discountPrice: 9990,
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Fekete', 'Kék', 'Piros'],
      categoryId: '1',
      imageUrls: ['assets/images/bikini1.jpg', 'assets/images/placeholder.jpg'],
      featured: true,
      inStock: true,
      rating: 4.5,
      createdAt: new Date('2023-01-15')
    },
    {
      id: '2',
      name: 'Sportos egyrészes',
      description: 'Kényelmes, sportos egyrészes fürdőruha aktív pihenéshez.',
      price: 15990,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Kék', 'Fekete'],
      categoryId: '2',
      imageUrls: ['assets/images/egyreszes1.jpg'],
      featured: false,
      inStock: true,
      rating: 4.2,
      createdAt: new Date('2023-02-10')
    },
    {
      id: '3',
      name: 'Mintás tankini',
      description: 'Divatos, mintás tankini, mely elfedi a kritikus pontokat.',
      price: 14990,
      discountPrice: 11990,
      sizes: ['M', 'L', 'XL'],
      colors: ['Mintás'],
      categoryId: '3',
      imageUrls: ['assets/images/tankini1.jpg'],
      featured: true,
      inStock: true,
      rating: 4.8,
      createdAt: new Date('2023-03-05')
    },
    {
      id: '4',
      name: 'Férfi úszónadrág',
      description: 'Kényelmes, gyorsan száradó férfi úszónadrág.',
      price: 8990,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Fekete', 'Kék', 'Zöld'],
      categoryId: '4',
      imageUrls: ['assets/images/ferfi1.jpg'],
      featured: false,
      inStock: false,
      rating: 4.0,
      createdAt: new Date('2023-04-20')
    },
    {
      id: '5',
      name: 'Strandruha',
      description: 'Könnyű, légies strandruha a tökéletes nyári megjelenéshez.',
      price: 9990,
      sizes: ['S/M', 'L/XL'],
      colors: ['Fehér', 'Krém', 'Világoskék'],
      categoryId: '5',
      imageUrls: ['assets/images/strandruha1.jpg'],
      featured: true,
      inStock: true,
      rating: 4.7,
      createdAt: new Date('2023-05-15')
    },
    {
      id: '6',
      name: 'Push-up bikini',
      description: 'Alakformáló, push-up hatású bikini felső és klasszikus alsó.',
      price: 13990,
      sizes: ['S', 'M', 'L'],
      colors: ['Piros', 'Fekete', 'Rózsaszín'],
      categoryId: '1',
      imageUrls: ['assets/images/pushup1.jpg'],
      featured: true,
      inStock: true,
      rating: 4.9,
      createdAt: new Date('2023-06-01')
    }
  ];

  private categories: Category[] = [
    {
      id: '1',
      name: 'Bikini',
      description: 'Kétrészes fürdőruhák minden alakra'
    },
    {
      id: '2',
      name: 'Egyrészes',
      description: 'Klasszikus és modern egyrészes fürdőruhák'
    },
    {
      id: '3',
      name: 'Tankini',
      description: 'A bikini és az egyrészes előnyeit ötvöző fürdőruhák'
    },
    {
      id: '4',
      name: 'Férfi',
      description: 'Férfi úszónadrágok és fürdőruhák'
    },
    {
      id: '5',
      name: 'Kiegészítők',
      description: 'Strandruhák és egyéb kiegészítők'
    }
  ];

  constructor() { }

  addProduct(product: Omit<Product, 'id'>): Observable<Product> {
    const newId = (this.products.length + 1).toString();
    const newProduct: Product = {
      id: newId,
      ...product,
      createdAt: new Date()
    };
    this.products.push(newProduct);
    return of(newProduct);
  }

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProductById(id: string): Observable<Product | undefined> {
    console.log('Fetching product with ID:', id);
    const product = this.products.find(p => p.id === id);
    console.log('Product retrieved:', product);
    return of(product);
  }

  updateProduct(id: string, data: Partial<Product>): Observable<Product> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      return throwError(() => new Error(`Product with id ${id} not found`));
    }
    this.products[index] = { ...this.products[index], ...data };
    return of(this.products[index]);
  }

  deleteProduct(id: string): Observable<boolean> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      return throwError(() => new Error(`Product with id ${id} not found`));
    }
    this.products.splice(index, 1);
    return of(true);
  }

  getProductsByCategory(categoryId: string): Observable<Product[]> {
    const filteredProducts = this.products.filter(p => p.categoryId === categoryId);
    return of(filteredProducts);
  }

  searchProducts(query: string): Observable<Product[]> {
    const lowerQuery = query.toLowerCase();
    const filteredProducts = this.products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.description.toLowerCase().includes(lowerQuery)
    );
    return of(filteredProducts);
  }

  getFeaturedProducts(limit: number = 4): Observable<Product[]> {
    return of(this.products
      .filter(p => p.featured)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit));
  }

  getDiscountedProducts(): Observable<Product[]> {
    return of(this.products
      .filter(p => p.discountPrice && p.discountPrice > 0 && p.inStock)
      .sort((a, b) => {
        const discountA = a.discountPrice || a.price;
        const discountB = b.discountPrice || b.price;
        return discountA - discountB;
      }));
  }

  getNewestProducts(limit: number = 6): Observable<Product[]> {
    return of([...this.products]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit));
  }

  getTopRatedProducts(limit: number = 5): Observable<Product[]> {
    return of(this.products
      .filter(p => p.rating >= 4)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit));
  }

  getCategories(): Observable<Category[]> {
    return of(this.categories);
  }

  getCategoryById(id: string): Observable<Category | undefined> {
    const category = this.categories.find(c => c.id === id);
    return of(category);
  }

  paginateProducts(page: number, limit: number = 10): Observable<Product[]> {
    const start = page * limit;
    const end = start + limit;
    const paginatedProducts = this.products
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(start, end);
    return of(paginatedProducts);
  }
}
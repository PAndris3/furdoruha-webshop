import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product, Category } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Mock adatok a termékekhez
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

  // Mock kategóriák
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

  // Összes termék lekérdezése
  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  // Egy termék lekérdezése ID alapján
  getProductById(id: string): Observable<Product | undefined> {
    const product = this.products.find(p => p.id === id);
    return of(product);
  }

  // Termékek lekérdezése kategória szerint
  getProductsByCategory(categoryId: string): Observable<Product[]> {
    const filteredProducts = this.products.filter(p => p.categoryId === categoryId);
    return of(filteredProducts);
  }

  // Termékek keresése név és leírás alapján
  searchProducts(query: string): Observable<Product[]> {
    const lowerQuery = query.toLowerCase();
    const filteredProducts = this.products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.description.toLowerCase().includes(lowerQuery)
    );
    return of(filteredProducts);
  }

  // Kiemelt termékek lekérdezése
  getFeaturedProducts(): Observable<Product[]> {
    const featuredProducts = this.products.filter(p => p.featured);
    return of(featuredProducts);
  }

  // Összes kategória lekérdezése
  getCategories(): Observable<Category[]> {
    return of(this.categories);
  }

  // Egy kategória lekérdezése ID alapján
  getCategoryById(id: string): Observable<Category | undefined> {
    const category = this.categories.find(c => c.id === id);
    return of(category);
  }
}
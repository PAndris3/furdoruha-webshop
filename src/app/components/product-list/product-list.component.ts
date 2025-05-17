// product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Product, Category } from '../../models/models';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatIconModule,
    ProductCardComponent,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  filterForm: FormGroup;
  categoryId: string | null = null;
  loading = false;
  
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cartService: CartService
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      minPrice: [0],
      maxPrice: [20000],
      size: [''],
      color: [''],
      sort: ['name']
    });
  }
  
  onAddToCart(product: Product) {
    console.log('Termék hozzáadva a kosárhoz:', product);
    this.snackBar.open(`${product.name} hozzáadva a kosárhoz!`, 'Rendben', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
  
  onAddToWishlist(product: Product) {
    console.log('Termék hozzáadva a kedvencekhez:', product);
    this.snackBar.open(`${product.name} hozzáadva a kedvencekhez!`, 'Rendben', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
  
  onViewDetails(product: Product) {
    console.log('Termék részletek megtekintése:', product);
    this.snackBar.open(`${product.name} részleteinek megtekintése`, 'Bezárás', {
      duration: 2000
    });
    // Itt lehetne egy modal/dialog nyitása a részletekkel
  }
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoryId = params.get('id');
      this.loadProducts();
    });
    
    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
    
    this.filterForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.loadProducts();
      });
  }
  
  loadProducts(): void {
    this.loading = true;
    console.log('Loading products...');

    if (this.categoryId) {
      this.productService.getProductsByCategory(this.categoryId).subscribe(products => {
        this.products = this.filterProducts(products);
        this.loading = false;
      });
    } else if (this.filterForm.value.search) {
      this.productService.searchProducts(this.filterForm.value.search).subscribe(products => {
        this.products = this.filterProducts(products);
        this.loading = false;
      });
    } else {
      this.productService.getProducts().subscribe(products => {
        this.products = this.filterProducts(products);
        this.loading = false;
      });
    }
  }
  
  filterProducts(products: Product[]): Product[] {
    const filters = this.filterForm.value;
    
    return products
      .filter(p => {
        if (filters.minPrice && p.price < filters.minPrice) return false;
        if (filters.maxPrice && p.price > filters.maxPrice) return false;
        
        if (filters.size && !p.sizes.includes(filters.size)) return false;
        
        if (filters.color && !p.colors.includes(filters.color)) return false;
        
        return true;
      })
      .sort((a, b) => {
        switch (filters.sort) {
          case 'price_asc':
            return a.price - b.price;
          case 'price_desc':
            return b.price - a.price;
          case 'name':
            return a.name.localeCompare(b.name);
          case 'rating':
            return b.rating - a.rating;
          default:
            return 0;
        }
      });
  }
  
  getCategoryName(id: string): string {
    const category = this.categories.find(c => c.id === id);
    return category ? category.name : '';
  }
  
  clearFilters(): void {
    this.filterForm.patchValue({
      search: '',
      minPrice: 0,
      maxPrice: 20000,
      size: '',
      color: '',
      sort: 'name'
    });
  }

  isFeatured(product: Product): boolean {
    // Logika a kiemelt termékek meghatározásához
    return product.featured || false;
  }
}
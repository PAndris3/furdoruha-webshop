import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from '../../models/models';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  loading = true;
  selectedImageIndex = 0;
  quantity = 1;
  private subscription: Subscription | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {
    console.log('ProductDetailComponent constructed');
  }
  
  
  ngOnInit(): void {
    console.log('ProductDetailComponent initialized');
    this.subscription = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(id);
      } else {
        this.loading = false;
        console.error('No product ID provided');
      }
    });
  }
  
  ngOnDestroy(): void {
    console.log('ProductDetailComponent destroyed');
    if (this.subscription) {
      this.subscription.unsubscribe();
      console.log('Route subscription unsubscribed');
    }
  }
  
  loadProduct(id: string): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        if (product) {
          this.product = product;
          console.log('Product loaded:', product.name);
        } else {
          console.error('Product not found');
          this.product = null;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.product = null;
        this.loading = false;
        this.snackBar.open('Hiba történt a termék betöltésekor', 'Bezárás', {
          duration: 3000
        });
      }
    });
  }
  
  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }
  
  increaseQuantity(): void {
    this.quantity++;
  }
  
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  
  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
      this.snackBar.open(`${this.product.name} hozzáadva a kosárhoz`, 'Rendben', {
        duration: 3000
      });
    }
  }
  
  getDiscountPercent(): number {
    if (this.product && this.product.discountPrice && this.product.price > this.product.discountPrice) {
      return Math.round((1 - this.product.discountPrice / this.product.price) * 100);
    }
    return 0;
  }
}
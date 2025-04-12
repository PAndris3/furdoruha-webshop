import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/models';
import { DiscountPipe } from '../../pipes/discount.pipe';
import { StockStatusPipe } from '../../pipes/stock-status.pipe';
import { HighlightDirective } from '../../directives/highlight.directive';


@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatTooltipModule,
    DiscountPipe,
    StockStatusPipe,
    HighlightDirective
  ],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product!: Product;
  constructor(private cartService: CartService) {}
  onAddToCart(): void {
    console.log('ProductCard: kosárba helyezés', this.product);
    this.cartService.addToCart(this.product, 1);
  }
  @Output() addToCart = new EventEmitter<Product>();
  // Kiszámolja a kedvezmény százalékát
  getDiscountPercent(): number {
    if (!this.product.discountPrice || this.product.price <= this.product.discountPrice) {
      return 0;
    }
    return Math.round((1 - this.product.discountPrice / this.product.price) * 100);
  }
  
  // Meghatározza a készlet állapotot
  getStockStatus(): string {
    if (!this.product.inStock) return 'Nincs készleten';
    return 'Készleten';
  }
  
  // Csillagok renderelése az értékeléshez
  getStarArray(): number[] {
    const rating = Math.round(this.product.rating);
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }
  
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  cartItemCount: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      console.log('HeaderComponent: cart items updated', items);
      this.cartItemCount = items.reduce((count, item) => count + item.quantity, 0);
    });
  }
}
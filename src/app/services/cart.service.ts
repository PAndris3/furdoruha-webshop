// cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/models';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  constructor() {
    // Próbáljuk meg betölteni a kosarat a localStorage-ból
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        this.cartItems = JSON.parse(savedCart);
        this.cartSubject.next([...this.cartItems]);
      } catch (e) {
        console.error('Hiba a kosár betöltésekor:', e);
      }
    }
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  addToCart(product: Product, quantity: number = 1): void {
    console.log('Termék hozzáadása a kosárhoz:', product.name, quantity);
    
    const existingItem = this.cartItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({ product, quantity });
    }
    
    this.saveCart();
  }

  updateQuantity(productId: string, quantity: number): void {
    const itemIndex = this.cartItems.findIndex(item => item.product.id === productId);
    
    if (itemIndex !== -1) {
      if (quantity <= 0) {
        this.cartItems.splice(itemIndex, 1);
      } else {
        this.cartItems[itemIndex].quantity = quantity;
      }
      
      this.saveCart();
    }
  }

  removeFromCart(productId: string): void {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.saveCart();
  }

  clearCart(): void {
    this.cartItems = [];
    localStorage.removeItem('cart');
    this.cartSubject.next([]);
  }

  getCartTotal(): number {
    return this.cartItems.reduce((total, item) => {
      const price = item.product.discountPrice || item.product.price;
      return total + (price * item.quantity);
    }, 0);
  }

  getCartItemCount(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  private saveCart(): void {
    // Frissítjük a subject-et
    this.cartSubject.next([...this.cartItems]);
    
    // Mentjük a kosarat localStorage-ba
    try {
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    } catch (e) {
      console.error('Hiba a kosár mentésekor:', e);
    }
    
    console.log('Kosár tartalma:', this.cartItems);
  }
}
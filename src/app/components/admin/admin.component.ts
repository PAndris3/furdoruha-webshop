import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Product, Category } from '../../models/models';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  productForm: FormGroup;
  isEditing = false;
  selectedProduct: Product | null = null;
  displayedColumns: string[] = ['image', 'name', 'price', 'category', 'stock', 'actions'];

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      discountPrice: [null],
      sizes: [''],
      colors: [''],
      categoryId: ['', Validators.required],
      imageUrls: [''],
      featured: [false],
      inStock: [true],
      rating: [4.0]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Ismeretlen kategória';
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    const productData = this.productForm.value;
    
    productData.sizes = productData.sizes ? productData.sizes.split(',').map((s: string) => s.trim()) : [];
    productData.colors = productData.colors ? productData.colors.split(',').map((c: string) => c.trim()) : [];
    productData.imageUrls = productData.imageUrls ? productData.imageUrls.split(',').map((i: string) => i.trim()) : [];

    if (this.isEditing && this.selectedProduct) {
      this.productService.updateProduct(this.selectedProduct.id, productData).subscribe({
        next: () => {
          this.snackBar.open('Termék sikeresen frissítve!', 'OK', { duration: 3000 });
          this.resetForm();
          this.loadProducts();
        },
        error: (err) => {
          this.snackBar.open('Hiba történt a termék frissítésekor!', 'OK', { duration: 3000 });
          console.error(err);
        }
      });
    } else {
      this.productService.addProduct(productData).subscribe({
        next: () => {
          this.snackBar.open('Termék sikeresen hozzáadva!', 'OK', { duration: 3000 });
          this.resetForm();
          this.loadProducts();
        },
        error: (err) => {
          this.snackBar.open('Hiba történt a termék hozzáadásakor!', 'OK', { duration: 3000 });
          console.error(err);
        }
      });
    }
  }

  editProduct(product: Product): void {
    this.selectedProduct = product;
    this.isEditing = true;

    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice,
      sizes: product.sizes ? product.sizes.join(', ') : '',
      colors: product.colors ? product.colors.join(', ') : '',
      categoryId: product.categoryId,
      imageUrls: product.imageUrls ? product.imageUrls.join(', ') : '',
      featured: product.featured,
      inStock: product.inStock,
      rating: product.rating
    });
  }

  deleteProduct(product: Product): void {
    if (confirm(`Biztosan törölni szeretné a(z) "${product.name}" terméket?`)) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          this.snackBar.open('Termék sikeresen törölve!', 'OK', { duration: 3000 });
          this.loadProducts();
        },
        error: (err) => {
          this.snackBar.open('Hiba történt a termék törlésekor!', 'OK', { duration: 3000 });
          console.error(err);
        }
      });
    }
  }

  resetForm(): void {
    this.productForm.reset({
      price: 0,
      featured: false,
      inStock: true,
      rating: 4.0
    });
    this.selectedProduct = null;
    this.isEditing = false;
  }
}
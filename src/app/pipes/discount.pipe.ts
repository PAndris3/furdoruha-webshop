import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'discount',
  standalone: true
})
export class DiscountPipe implements PipeTransform {
  transform(price: number, discountPrice?: number): string {
    if (!discountPrice || price <= discountPrice) {
      return '';
    }
    const discountPercent = Math.round((1 - discountPrice / price) * 100);
    return `-${discountPercent}%`;
  }
}
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stockStatus',
  standalone: true
})
export class StockStatusPipe implements PipeTransform {
  transform(inStock: boolean): string {
    return inStock ? 'Készleten' : 'Nincs készleten';
  }
}
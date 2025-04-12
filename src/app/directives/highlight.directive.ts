import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective implements OnInit {
  @Input() appHighlight = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    if (this.appHighlight) {
      this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 0 8px rgba(255, 0, 0, 0.5)');
      this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(-3px)');
      this.renderer.setStyle(this.el.nativeElement, 'transition', 'all 0.3s ease');
    }
  }
}
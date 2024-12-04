import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[infiniteScroll]',
})
export class InfiniteScrollDirective {
  @Input() isFetching: boolean | null = false; // Avoid triggering while fetching
  @Input() hasMore: boolean | null = true; // Stop triggering when no more data
  @Output() scrolled = new EventEmitter<void>(); // Notify when the bottom is reached

  @HostListener('scroll', ['$event.target'])
  onScroll(container: HTMLElement): void {
    const nearBottom =
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - 50;

    if (nearBottom && this.hasMore && !this.isFetching) {
      this.scrolled.emit();
    }
  }
}

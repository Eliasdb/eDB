import {
  Directive,
  EventEmitter,
  HostListener,
  Output,
  input,
} from '@angular/core';

@Directive({
  selector: '[infiniteScroll]',
})
export class InfiniteScrollDirective {
  readonly isFetching = input<boolean | null>(false);
  readonly hasMore = input<boolean | null>(true);
  @Output() scrolled = new EventEmitter<void>();

  @HostListener('scroll', ['$event.target'])
  onScroll(container: EventTarget | null): void {
    if (!container || !(container instanceof HTMLElement)) {
      return;
    }
    const el = container as HTMLElement;

    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;

    if (nearBottom && this.hasMore() && !this.isFetching()) {
      this.scrolled.emit();
    }
  }
}

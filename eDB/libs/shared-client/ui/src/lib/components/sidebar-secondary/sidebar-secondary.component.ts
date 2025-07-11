/* ------------------------------------------------------------------ */
/* slide-in-sidebar.component.ts – now with @Input() opened           */
/* ------------------------------------------------------------------ */
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  signal,
} from '@angular/core';

@Component({
  selector: 'ui-slide-in-sidebar',
  imports: [CommonModule],
  template: `
    <!-- backdrop (stand-alone mode only) -->
    @if (!embedded) {
      <div
        class="fixed inset-0 bg-black/40 z-[6500]"
        [class.opacity-0]="!_opened()"
        [class.pointer-events-none]="!_opened()"
        [class.transition-opacity]="ready"
        [class.duration-300]="ready"
        (click)="close()"
      ></div>
    }

    <!-- sliding frame -->
    <aside
      class="bg-white text-black shadow-xl border-l flex flex-col w-[360px] sm:w-[400px] h-full pt-20"
      [class.fixed]="!embedded"
      [class.top-0]="!embedded"
      [class.right-0]="!embedded"
      [class.z-[6600]]="!embedded"
      [class.transform]="!embedded"
      [class.translate-x-full]="!embedded && !_opened()"
      [ngClass]="{
        'transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)]':
          !embedded && ready,
      }"
      (click)="$event.stopPropagation()"
    >
      <ng-content></ng-content>
    </aside>
  `,
  styles: [
    `
      .translate-x-full {
        transform: translateX(100%);
      }
    `,
  ],
})
export class UiSlideInSidebarComponent implements AfterViewInit {
  /* ---------- public API ---------- */
  @Input() embedded = false;

  /** Two-way control – parent binds `[opened]` and/or `(closed)` */
  @Input({ alias: 'opened', transform: (v: any) => !!v })
  set opened(v: boolean) {
    this._opened.set(v);
  }
  get opened() {
    return this._opened();
  }

  /** internal reactive state */
  protected readonly _opened = signal(false);

  /** imperative helper (optional) */
  openPanel() {
    if (!this._opened()) this._opened.set(true);
  }
  close() {
    if (this._opened()) {
      this._opened.set(false);
      this.closed.emit();
    }
  }

  @Output() closed = new EventEmitter<void>();

  /* ---------- UX niceties ---------- */
  @HostListener('document:keydown.escape')
  onEsc() {
    if (!this.embedded && this._opened()) this.close();
  }

  ready = false;
  ngAfterViewInit() {
    setTimeout(() => (this.ready = true));
  }
}

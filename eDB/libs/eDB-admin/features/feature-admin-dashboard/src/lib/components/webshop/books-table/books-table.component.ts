// ─────────────────────────────────────────────────────────────
// webshop-books-table.component.ts (updated to support mobile)
// ─────────────────────────────────────────────────────────────
import { BreakpointObserver } from '@angular/cdk/layout';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  TemplateRef,
  ViewChild,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Book } from '@eDB-webshop/shared-types';
import { AdminService } from '@eDB/client-admin';
import { UiTableComponent } from '@edb/shared-ui';
import {
  TableHeaderItem,
  TableItem,
  TableModel,
} from 'carbon-components-angular';
import { WebshopBooksAccordionComponent } from '../books-accordion/books-accordion.component';

@Component({
  selector: 'webshop-books-table',
  imports: [UiTableComponent, WebshopBooksAccordionComponent],
  template: `
    <ng-template #coverTemplate let-book="data">
      <img
        [src]="book.blurDataUrl || book.photoUrl"
        [alt]="book.title"
        style="width:40px;height:60px;object-fit:cover;border-radius:4px;transition:filter .25s;"
        (load)="loadHighRes($event.target, book.photoUrl)"
      />
    </ng-template>

    @if (isSmallScreen()) {
      <section class="">
        <p class="text-gray-600 mb-4">Available books in the collection</p>
        <webshop-books-accordion
          [books]="books()"
          (viewMoreId)="onViewMore($event)"
        />
      </section>
    } @else {
      <div class="max-h-[28rem] overflow-y-auto pr-2">
        <ui-table
          [model]="tableModel()"
          [showPagination]="false"
          [showToolbar]="true"
          [searchPlaceholder]="'Search books'"
          [title]="''"
          [description]="'Available books in the collection'"
        ></ui-table>
      </div>
    }

    @if (booksQuery.isFetchingNextPage()) {
      <div class="flex justify-center my-2 text-gray-500 text-sm animate-pulse">
        Loading more…
      </div>
    }

    <div #sentinel class="h-1"></div>
  `,
})
export class WebshopBooksTableComponent implements AfterViewInit, OnDestroy {
  @ViewChild('coverTemplate', { static: true })
  private coverTemplate!: TemplateRef<Book>;

  @ViewChild('sentinel', { static: true })
  private sentinel!: ElementRef<HTMLDivElement>;

  private readonly admin = inject(AdminService);
  private readonly breakpoint = inject(BreakpointObserver);
  private intersectionObserver?: IntersectionObserver;

  protected readonly isSmallScreen = signal(false);

  readonly booksQuery = this.admin.queryBooksInfinite(15);
  readonly books = computed(() => {
    const data = this.booksQuery.data();
    return data ? data.pages.flatMap((p) => p.items) : [];
  });

  private readonly header: TableHeaderItem[] = [
    new TableHeaderItem({ data: 'Cover' }),
    new TableHeaderItem({ data: 'Title', metadata: { sortField: 'title' } }),
    new TableHeaderItem({ data: 'Author', metadata: { sortField: 'author' } }),
    new TableHeaderItem({ data: 'Genre', metadata: { sortField: 'genre' } }),
    new TableHeaderItem({
      data: 'Price (€)',
      metadata: { sortField: 'price' },
    }),
  ];

  readonly tableModel = computed<TableModel>(() => {
    const model = new TableModel();
    model.header = this.header;
    model.data = this.books().map((book) => [
      new TableItem({ data: book, template: this.coverTemplate }),
      new TableItem({ data: book.title }),
      new TableItem({ data: book.author }),
      new TableItem({ data: book.genre }),
      new TableItem({ data: `€${book.price.toFixed(2)}` }),
    ]);
    model.totalDataLength = this.books().length;
    return model;
  });

  constructor() {
    effect(() => {
      this.breakpoint
        .observe('(max-width: 768px)')
        .subscribe((result) => this.isSmallScreen.set(result.matches));
    });
  }

  onViewMore(bookId: number) {
    console.log('View more clicked:', bookId);
  }

  ngAfterViewInit() {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (
          entry.isIntersecting &&
          this.booksQuery.hasNextPage() &&
          !this.booksQuery.isFetchingNextPage()
        ) {
          this.booksQuery.fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: '300px 0px',
        threshold: 0.01,
      },
    );
    this.intersectionObserver.observe(this.sentinel.nativeElement);
  }

  ngOnDestroy() {
    this.intersectionObserver?.disconnect();
  }

  loadHighRes(img: EventTarget | null, highResSrc: string) {
    const element = img as HTMLImageElement | null;
    if (!element || element.src === highResSrc) return;

    const high = new Image();
    high.onload = () => {
      element.src = highResSrc;
      element.style.filter = 'none';
    };
    high.src = highResSrc;
  }
}

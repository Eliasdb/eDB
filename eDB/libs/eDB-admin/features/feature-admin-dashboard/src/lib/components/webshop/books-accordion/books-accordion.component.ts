import { Component, EventEmitter, Output, input } from '@angular/core';
import { Book } from '@eDB-webshop/shared-types';
import { UiButtonComponent } from '@edb/shared-ui';
import { AccordionModule } from 'carbon-components-angular/accordion';

@Component({
  selector: 'webshop-books-accordion',
  standalone: true,
  imports: [AccordionModule, UiButtonComponent],
  template: `
    <cds-accordion align="start" size="md">
      @for (book of books(); track book.id) {
        <cds-accordion-item [title]="book.title">
          <section class="space-y-2 pb-2 text-sm text-gray-800">
            <div class="grid grid-cols-2 gap-y-2">
              <div>
                <p class="font-semibold text-gray-900">Author</p>
                <p>{{ book.author }}</p>
              </div>
              <div>
                <p class="font-semibold text-gray-900">Genre</p>
                <p>{{ book.genre }}</p>
              </div>
              <div>
                <p class="font-semibold text-gray-900">Price</p>
                <p>€{{ book.price.toFixed(2) }}</p>
              </div>
            </div>
          </section>

          <section class="flex flex-wrap gap-2 pt-4">
            <ui-button
              variant="tertiary"
              size="sm"
              (buttonClick)="onViewMore(book.id)"
              >View More</ui-button
            >
            <ui-button variant="danger" size="sm">Delete Book</ui-button>
          </section>
        </cds-accordion-item>
      }
    </cds-accordion>
  `,
})
export class WebshopBooksAccordionComponent {
  readonly books = input<Book[]>();
  @Output() viewMoreId = new EventEmitter<number>();

  onViewMore(id: number) {
    this.viewMoreId.emit(id);
  }
}

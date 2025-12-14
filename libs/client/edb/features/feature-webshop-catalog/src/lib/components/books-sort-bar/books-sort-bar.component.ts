import { NgClass } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { sortArray, sortValues } from '@eDB-webshop/shared-data';
import { UiSelectComponent } from '@edb/shared-ui';
import { SORT_BY_MAP, SORT_BY_ORDER } from './books-sort-bar.config';

@Component({
  selector: 'webshop-books-sort-bar',
  host: { class: 'w-full' },
  imports: [FormsModule, NgClass, UiSelectComponent],
  template: `
    <section
      class="grid grid-cols-1 gap-y-4 xl:grid-cols-[auto_auto_1fr_auto] xl:gap-x-8 xl:items-center w-full px-0 xl:px-2"
    >
      <!-- Toggle Buttons -->
      <div class="flex gap-2">
        <button
          type="button"
          aria-label="Grid View"
          (click)="toggleShow(false)"
          [ngClass]="{
            'bg-[var(--accent-complimentary)] text-white shadow-md':
              !showList(),
            'bg-white text-gray-700 border': showList(),
          }"
          class="w-7 h-7 rounded border border-gray-300 flex items-center justify-center transition-colors"
        >
          <svg
            viewBox="0 0 16 16"
            class="w-4 h-4"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"
            ></path>
          </svg>
        </button>

        <button
          type="button"
          aria-label="List View"
          (click)="toggleShow(true)"
          [ngClass]="{
            'bg-[var(--accent-complimentary)] text-white shadow-md': showList(),
            'bg-white text-gray-700 border': !showList(),
          }"
          class="w-7 h-7 rounded border border-gray-300 flex items-center justify-center transition-colors"
        >
          <svg
            viewBox="0 0 16 16"
            class="w-4 h-4"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
            ></path>
          </svg>
        </button>
      </div>

      <!-- Book Count -->
      <p class="text-sm text-gray-600 xl:text-right">
        {{ bookCount() }} {{ bookCount() === 1 ? 'book' : 'books' }} found
      </p>

      <!-- Divider for mobile only -->
      <hr class="border-slate-200" />

      <!-- Sort Select -->
      <div class="flex items-center gap-2">
        <ui-select
          [label]="'Sort by'"
          [options]="sortOptions()"
          [model]="selectedValue()"
          (valueChange)="selectSort($event)"
          display="inline"
        />
      </div>
    </section>
  `,
})
export class BooksSortBarComponent {
  sortByMap = SORT_BY_MAP;
  sortByOrder = SORT_BY_ORDER;

  showList = input<boolean>();
  bookCount = input<number>();
  selectedSort = input<string>('author,asc');

  selectedValue = computed(() => this.selectedSort());

  readonly sortOptions = computed(() =>
    this.sortByOrder.map((key) => ({
      value: this.sortByMap[key].key,
      label: this.sortByMap[key].label,
    })),
  );

  sortArray: sortValues[] = sortArray;

  @Output() clickEvent = new EventEmitter<boolean>();
  @Output() sort = new EventEmitter<string>();

  toggleShow(state: boolean) {
    this.clickEvent.emit(state);
  }

  selectSort(value: string) {
    this.sort.emit(value);
  }
}

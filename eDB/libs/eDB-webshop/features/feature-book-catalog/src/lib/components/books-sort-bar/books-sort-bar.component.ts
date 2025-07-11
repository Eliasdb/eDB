import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { sortArray, sortValues } from '@eDB-webshop/shared-data';
import { SORT_BY_MAP, SORT_BY_ORDER } from './books-sort-bar.config';

@Component({
  imports: [FormsModule, CommonModule],
  selector: 'books-sort-bar',
  // Apply full width to the host element
  host: { class: 'w-full' },
  template: `
    <!--
      Mobile-first (default):
        • A single-column grid with a row gap of 0.75rem
        • .btn-container is 50px wide
        • Book count is left-aligned
      Desktop (xl: ≥1280px):
        • Grid switches to 4 columns: auto auto 1fr auto
        • Horizontal gap becomes 2rem (and row gap is removed)
        • Container gets a min-width of 40rem
        • .btn-container reverts to auto width
        • Book count becomes right-aligned
    -->
    <section
      class="grid grid-cols-1 items-center mb-8 gap-y-3 xl:grid-cols-[auto_auto_1fr_auto] xl:gap-x-8 xl:gap-y-0 xl:min-w-[40rem]"
    >
      <div class="w-[50px] xl:w-auto grid grid-cols-2 gap-x-2">
        <button
          type="button"
          (click)="toggleShow(false)"
          class="border border-black text-black w-[1.5rem] h-[1.5rem] rounded flex items-center justify-center cursor-pointer"
          [ngClass]="{
            'bg-[var(--accent-complimentary)] text-slate-50': !showList(),
          }"
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 16 16"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
            class="text-[0.7rem]"
          >
            <path
              d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"
            ></path>
          </svg>
        </button>
        <button
          type="button"
          (click)="toggleShow(true)"
          class="border border-black text-black w-[1.5rem] h-[1.5rem] rounded flex items-center justify-center cursor-pointer"
          [ngClass]="{
            'bg-[var(--accent-complimentary)] text-slate-50': showList(),
          }"
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 16 16"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
            class="text-[0.7rem]"
          >
            <path
              fill-rule="evenodd"
              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
            ></path>
          </svg>
        </button>
      </div>
      <section>
        <p class="w-[7rem] min-w-[9rem] text-left xl:text-right m-0">
          {{ bookCount() }} {{ bookCount() === 1 ? 'book' : 'books' }} found
        </p>
      </section>
      <hr class="border-t border-slate-300 opacity-100" />

      <div class="flex items-center">
        <label for="sort" class="min-w-[3rem] inline-block mr-2">sort by</label>
        <select
          name="sort"
          id="sort"
          class="border border-transparent py-1 px-2 bg-inherit"
          (change)="selectSort($event)"
        >
          @for (sort of sortByOrder; track sort) {
            <option
              [value]="sortByMap[sort].key"
              class="status-option"
              [selected]="selectedValue() === sortByMap[sort].key"
            >
              {{ sortByMap[sort].label }}
            </option>
          }
        </select>
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

  sortArray: sortValues[] = sortArray;

  @Output() clickEvent = new EventEmitter<boolean>();
  @Output() sort = new EventEmitter<string>();

  toggleShow(state: boolean) {
    this.clickEvent.emit(state);
  }

  selectSort(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.sort.emit(value);
  }
}

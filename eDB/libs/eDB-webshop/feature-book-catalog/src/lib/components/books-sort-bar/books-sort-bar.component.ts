import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { sortArray, sortValues } from '@eDB-webshop/shared-data';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'books-sort-bar',
  template: `
    <section class="horizontal-sort">
      <div class="btn-container">
        <button
          type="button"
          class="{{ showList === false ? 'grid-btn active' : 'grid-btn' }}"
          (click)="toggleShow(false)"
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 16 16"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"
            ></path>
          </svg>
        </button>
        <button
          (click)="toggleShow(true)"
          type="button"
          class="{{ showList === true ? 'list-btn active' : 'list-btn' }}"
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 16 16"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
            ></path>
          </svg>
        </button>
      </div>
      <p class="book-count">
        {{ bookCount }} {{ bookCount === 1 ? 'book' : 'books' }} found
      </p>
      <hr />

      <div class="sort-container">
        <label for="sort">sort by</label>

        <select
          name="sort"
          id="sort"
          class="sort-input"
          (change)="selectSort($event)"
        >
          <option
            *ngFor="let sort of sortByOrder"
            [value]="sortByMap[sort].key"
            class="status-option"
            [selected]="selectedValue === sortByMap[sort].key"
          >
            {{ sortByMap[sort].label }}
          </option>
        </select>
      </div>
    </section>
  `,
  styleUrls: ['./books-sort-bar.component.scss'],
})
export class BooksSortBarComponent {
  @Input() showList: boolean | undefined;
  @Input() bookCount?: number;
  @Input() selectedSort = 'author,asc';
  sortArray: sortValues[] = sortArray;
  selectedValue: string = '';

  sortByMap: Record<string, { label: string; key: string }> = {
    ['title-asc']: {
      label: 'title (a-z)',
      key: 'title,asc',
    },
    ['title-desc']: {
      label: 'title (z-a)',
      key: 'title,desc',
    },
    ['author-asc']: {
      label: 'author (a-z)',
      key: 'author,asc',
    },
    ['auth-desc']: {
      label: 'author (z-a)',
      key: 'author,desc',
    },
    ['published-desc']: {
      label: 'year (newest)',
      key: 'published_date,desc',
    },
    ['published-asc']: {
      label: 'year (oldest)',
      key: 'published_date,asc',
    },
  };

  sortByOrder = [
    'title-asc',
    'title-desc',
    'author-asc',
    'auth-desc',
    'published-desc',
    'published-asc',
  ];

  @Output() clickEvent = new EventEmitter<boolean>();
  @Output() sort = new EventEmitter<string>();

  toggleShow(state: boolean) {
    this.clickEvent.emit(state);
  }

  selectSort(event: Event) {
    this.selectedValue = (event.target as HTMLSelectElement).value;

    this.sort.emit(this.selectedValue);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedSort']) {
      this.selectedValue = this.selectedSort;
    }
  }
}

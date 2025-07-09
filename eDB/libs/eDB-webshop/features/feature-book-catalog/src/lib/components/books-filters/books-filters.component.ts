import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';

import { Genre, mappedGenres } from '@eDB-webshop/shared-data';
import { UiButtonComponent, UiToggleComponent } from '@edb/shared-ui';

@Component({
  selector: 'book-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiToggleComponent,
    UiButtonComponent,
    FormsModule,
  ],
  template: `
    <section class="flex flex-col gap-6 text-sm">
      <!-- ── Search ─────────────────────────────────────────── -->
      <div>
        <label class="block mb-1 font-medium text-black">Title / Author</label>
        <div
          class="relative flex items-center rounded border border-gray-300
                 focus-within:border-accent-complimentary focus-within:ring-1
                 focus-within:ring-accent-complimentary bg-white"
        >
          <img
            src="https://sapphire-zena-72.tiiny.site/search-icon.svg"
            alt="search"
            class="w-4 ml-3"
          />
          <input
            [formControl]="searchControl"
            placeholder="Search"
            class="flex-1 px-3 py-[7px] rounded bg-transparent outline-none"
          />
        </div>
      </div>

      <!-- ── Genre chips ────────────────────────────────────── -->
      <div>
        <p class="mb-2 font-medium text-sm">Genre</p>

        <div
          class="flex gap-2 overflow-x-auto scrollbar-hide
                 xl:flex-col xl:overflow-visible"
        >
          <button
            *ngFor="let genre of genres"
            (click)="selectGenre(genre)"
            [ngClass]="{
              'chip--active': activeGenre === genre,
            }"
            class="chip"
          >
            {{ genre }}
          </button>
        </div>
      </div>

      <!-- ── Status + clear ─────────────────────────────────── -->
      <div class="flex flex-col gap-3 text-black mt-4">
        <div class="flex items-center justify-between ">
          <span class="font-medium">Available</span>
          <ui-toggle
            [label]="''"
            [onText]="'Yes'"
            [offText]="'No'"
            [checked]="isChecked()"
            (checkedChange)="onToggleChange($event)"
          />
        </div>

        <div class="w-[14rem] self-end mt-4">
          <ui-button
            size="sm"
            variant="tertiary"
            [fullWidth]="true"
            (buttonClick)="clearFilters.emit(); isChecked.set(true)"
          >
            Clear filters
          </ui-button>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
      @media (min-width: 1280px) {
        :host {
          width: 14rem;
        }
      }

      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }

      .chip {
        @apply whitespace-nowrap px-3 py-[6px] rounded-md
             text-xs tracking-wide flex-shrink-0
             transition-colors duration-150 border;

        color: var(--accent-complimentary, #1f2937);
        border-color: var(--accent-complimentary, #1f2937);
        background: transparent;
      }

      .chip:hover {
        background: color-mix(
          in srgb,
          var(--accent-complimentary, #1f2937) 90%,
          transparent
        );
        color: white;
      }

      .chip--active {
        background: var(--accent-complimentary, #1f2937);
        color: var(--accent, #ffffff);
      }
    `,
  ],
})
export class BooksFiltersComponent implements OnInit {
  @Input() set value(v: string | null) {
    if (v !== this.searchControl.value) this.searchControl.setValue(v);
  }
  @Input() activeGenre: Genre | string | null = null;
  @Input() bookStatus: string | null = null;

  @Output() search = new EventEmitter<string>();
  @Output() filterGenre = new EventEmitter<string>();
  @Output() filterStatus = new EventEmitter<string>();
  @Output() clearFilters = new EventEmitter<void>();

  genres = mappedGenres;
  isChecked = signal(true);
  private fb = inject(FormBuilder);
  searchControl = this.fb.control('');

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        filter((v): v is string => v !== null),
        debounceTime(250),
        distinctUntilChanged(),
      )
      .subscribe((v) => this.search.emit(v));

    if (this.bookStatus === 'loaned') this.isChecked.set(false);
  }

  selectGenre(genre: Genre) {
    this.filterGenre.emit(genre);
  }

  onToggleChange(value: boolean) {
    this.isChecked.set(value);
    this.filterStatus.emit(value ? 'available' : 'loaned');
  }
}

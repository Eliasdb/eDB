import { NgClass } from '@angular/common';
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
import { UiToggleComponent } from '@edb/shared-ui';

@Component({
  selector: 'book-filters',
  imports: [ReactiveFormsModule, UiToggleComponent, FormsModule, NgClass],
  template: `
    <section class="flex flex-col gap-6 text-sm rounded-xl w-full xl:w-[14rem]">
      <!-- ── Search ─────────────────────────────────────────── -->
      <div>
        <label class="block mb-1 font-medium text-black">Title / Author</label>
        <div class="relative">
          <input
            [formControl]="searchControl"
            placeholder="Search"
            class="w-full text-sm pl-10 pr-4 py-2 rounded-xl border border-slate-300 bg-white/60 hover:bg-slate-100 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
          />
          <img
            src="https://sapphire-zena-72.tiiny.site/search-icon.svg"
            alt="search"
            class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          />
        </div>
      </div>

      <!-- ── Genre chips ────────────────────────────────────── -->
      <div>
        <p class="mb-2 font-medium text-sm">Genre</p>
        <div
          class="flex gap-2 overflow-x-auto scrollbar-hide lg:overflow-visible lg:flex-wrap"
        >
          @for (genre of genres; track genre) {
            <button
              (click)="selectGenre(genre)"
              [ngClass]="{
                'bg-slate-800 text-white border-transparent':
                  activeGenre === genre,
                'bg-white/60 text-slate-700 hover:bg-slate-100 border-slate-300':
                  activeGenre !== genre,
              }"
              class="w-full text-left px-4 py-0 sm:py-2 text-sm rounded-xl border transition-all duration-150"
            >
              {{ genre }}
            </button>
          }
        </div>
      </div>

      <!-- ── Status + clear ─────────────────────────────────── -->
      <div class="flex flex-col gap-3 text-black mt-4">
        <div class="flex items-center justify-between">
          <span class="font-medium">Available</span>
          <ui-toggle
            [label]="''"
            [onText]="'Yes'"
            [offText]="'No'"
            [checked]="isChecked()"
            (checkedChange)="onToggleChange($event)"
          />
        </div>

        <button
          class="w-full mt-2 text-sm px-4 py-2 rounded-xl border border-slate-300 bg-white/60 text-slate-700 hover:bg-slate-100 transition-all"
          (click)="clearFilters.emit(); isChecked.set(true)"
        >
          Clear filters
        </button>
      </div>
    </section>
  `,
  styles: [
    `
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
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

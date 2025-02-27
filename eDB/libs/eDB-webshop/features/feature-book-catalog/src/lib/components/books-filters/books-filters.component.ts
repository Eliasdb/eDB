import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Genre, mappedGenres } from '@eDB-webshop/shared-data';
import { UiButtonComponent } from '@eDB/shared-ui';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';

@Component({
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatSlideToggleModule,
    FormsModule,
    UiButtonComponent,
    CommonModule,
  ],
  selector: 'book-filters',
  // Removed styleUrls; all styling is now inlined using Tailwind classes.
  template: `
    <section class="flex flex-col gap-4 relative">
      <!-- Search Input Container -->
      <div class="max-w-full xl:max-w-[17rem]">
        <h4 class="text-[13.5px] mb-[6px]">Title/Author</h4>
        <div
          class="relative shadow-[0_2px_1px_-2px_rgba(0,0,0,0.2),0_0px_2px_0_rgba(0,0,0,0.14),0_0px_4px_0_rgba(0,0,0,0.12)] pl-8 bg-white rounded-[3px] hover:shadow-[0_0_0_0.1rem_#90EE90]"
        >
          <input
            type="text"
            placeholder="Search"
            class="p-[0.3rem] bg-white rounded border border-transparent tracking-[0.075rem] outline-none"
            [formControl]="searchControl"
          />
          <div>
            <img
              src="https://sapphire-zena-72.tiiny.site/search-icon.svg"
              alt="search-icon"
              class="w-4 absolute left-[11px] top-[11px]"
            />
          </div>
        </div>
      </div>

      <!-- Genre Filters -->
      <div
        class="flex flex-row gap-4 justify-between items-center flex-wrap xl:flex-col xl:items-start xl:justify-start xl:gap-0"
      >
        <h4 class="text-[13.5px] w-full text-left m-0 xl:mb-[6px]">Genre</h4>
        @for (genre of genres; track $index) {
          <button
            class="capitalize tracking-[0.075rem] text-white cursor-pointer text-[13px] border bg-[#393939] p-2 rounded"
            [ngClass]="
              activeGenre === genre ? 'opacity-100 border-[#24262b]' : ''
            "
            (click)="selectGenre(genre)"
          >
            {{ genre }}
          </button>
        }
      </div>

      <!-- Status Filter and Clear Button -->
      <section class="flex justify-between">
        <div>
          <h4 class="text-[13.5px] mb-[6px]">Status</h4>
          <mat-slide-toggle [(ngModel)]="isChecked" (change)="selectStatus()">
            <span class="text-black">
              {{ isChecked ? 'Available' : 'Unavailable' }}
            </span>
          </mat-slide-toggle>
        </div>
        <div class="mt-4">
          <ui-button
            size="md"
            variant="tertiary"
            (buttonClick)="clearFilters.emit(); isChecked = true"
          >
            Clear filters
          </ui-button>
        </div>
      </section>
    </section>
  `,
})
export class BooksFiltersComponent implements OnInit {
  protected isChecked = true;
  private fb = inject(FormBuilder);
  protected searchControl = this.fb.control('');
  genres: Genre[] = mappedGenres;

  @Input() set value(v: string | null) {
    if (v !== this.searchControl.value) {
      this.searchControl.setValue(v);
    }
  }

  @Input() activeGenre: Genre | string | null = null;
  @Input() bookStatus: string | null = null;
  @Output() search = new EventEmitter<string>();
  @Output() filterGenre = new EventEmitter<string>();
  @Output() filterStatus = new EventEmitter<string>();
  @Output() clearFilters = new EventEmitter<void>();

  selectGenre(genre: Genre) {
    this.filterGenre.emit(genre);
  }

  selectStatus() {
    if (this.isChecked) {
      this.filterStatus.emit('available');
    } else {
      this.filterStatus.emit('loaned');
    }
  }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        filter((s): s is string => s !== null),
        debounceTime(300),
        distinctUntilChanged(),
      )
      .subscribe((value) => {
        this.search.emit(value);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['bookStatus']) {
      if (this.bookStatus && this.bookStatus === 'loaned') {
        this.isChecked = false;
      }
    }
  }
}

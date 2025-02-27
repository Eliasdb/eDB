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
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSlideToggleModule,
    FormsModule,
    UiButtonComponent,
  ],
  selector: 'book-filters',
  template: `
    <section class="filters">
      <div class="search-input-container">
        <h4 class="input-title">Title/Author</h4>

        <div class="input-container">
          <input
            type="text"
            placeholder="Search"
            class="search-input"
            [formControl]="searchControl"
          />
          <div class="icon-container">
            <img
              src="https://sapphire-zena-72.tiiny.site/search-icon.svg"
              alt="search-icon"
              class="search-icon"
            />
          </div>
        </div>
      </div>

      <div class="categories">
        <h4 class="category-title">Genre</h4>
        <button
          *ngFor="let genre of genres"
          class="category active"
          [ngClass]="{ active: activeGenre === genre }"
          (click)="selectGenre(genre)"
        >
          {{ genre }}
        </button>
      </div>

      <section class="status-filter">
        <div class="status-filter-container">
          <h4 class="status-title">Status</h4>

          <mat-slide-toggle [(ngModel)]="isChecked" (change)="selectStatus()"
            ><span style="color: black;">{{
              isChecked ? 'Available' : 'Unavailable'
            }}</span></mat-slide-toggle
          >
        </div>
        <div class="clear-filters-btn-container">
          <ui-button
            size="md"
            variant="tertiary"
            (buttonClick)="clearFilters.emit(); isChecked = true"
            >Clear filters</ui-button
          >
        </div>
      </section>
    </section>
  `,
  styleUrls: ['./books-filters.component.scss'],
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
    }
    if (!this.isChecked) {
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

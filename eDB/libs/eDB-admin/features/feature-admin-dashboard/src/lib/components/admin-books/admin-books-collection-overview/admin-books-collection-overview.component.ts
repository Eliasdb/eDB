import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  inject,
  input,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Book } from '@eDB-webshop/shared-types';
import { AdminService } from '@eDB/client-admin';
import { BehaviorSubject, map, tap } from 'rxjs';
import { AddBookDialog } from '../../add-book-modal/add-book-modal.component';
import { EditBookDialog } from '../../edit-book-modal/edit-book-modal.component';

/**
 * @title Table with selection
 */
@Component({
  selector: 'admin-books-collection-overview',
  styleUrls: ['admin-books-collection-overview.component.scss'],
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    CommonModule,
  ],
  template: `
    <section class="collection-title">
      <h3>Books</h3>
      <div>
        <button mat-raised-button (click)="openAddBookDialog()" color="accent">
          Add book
        </button>
      </div>
    </section>
    <div class="example-container mat-elevation-z8">
      <div class="example-table-container">
        <table
          mat-table
          [dataSource]="books() || []"
          (matSortChange)="onSortChange($event)"
          class="mat-elevation-z8"
          matSort
        >
          <ng-container matColumnDef="select">
            <th mat-header-cell *matHeaderCellDef>
              <mat-checkbox
                (change)="$event ? toggleAllRows() : null"
                [checked]="selection.hasValue() && isAllSelected()"
                [indeterminate]="selection.hasValue() && !isAllSelected()"
                [aria-label]="checkboxLabel()"
                (click)="selectAll()"
                (change)="emitMainCheckedState($event)"
              >
              </mat-checkbox>
            </th>
            <td mat-cell *matCellDef="let row">
              <mat-checkbox
                (click)="$event.stopPropagation()"
                (change)="$event ? selection.toggle(row) : null"
                [checked]="selection.isSelected(row)"
                [aria-label]="checkboxLabel(row)"
                (click)="selectItem(row)"
                (change)="emitCheckedState($event)"
              >
              </mat-checkbox>
            </td>
          </ng-container>
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>#</th>
            <td mat-cell *matCellDef="let row">{{ row.id }}</td>
          </ng-container>

          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let row">{{ row.title }}</td>
          </ng-container>

          <ng-container matColumnDef="genre">
            <th mat-header-cell *matHeaderCellDef>Genre</th>
            <td mat-cell *matCellDef="let row">{{ row.genre }}</td>
          </ng-container>

          <ng-container matColumnDef="author">
            <th mat-header-cell *matHeaderCellDef>Author</th>
            <td mat-cell *matCellDef="let row">{{ row.author }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let row">{{ row.status }}</td>
          </ng-container>

          <ng-container matColumnDef="year">
            <th mat-header-cell *matHeaderCellDef>Year</th>
            <td mat-cell *matCellDef="let row">{{ row.publishedDate }}</td>
          </ng-container>

          <ng-container matColumnDef="edit">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let row">
              <mat-icon (click)="openEditBookDialog(row)">edit</mat-icon>
            </td>
          </ng-container>

          <!-- Created Column -->
          <tr
            mat-header-row
            *matHeaderRowDef="displayedColumns; sticky: true"
          ></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </div>

      <mat-paginator
        [length]="400"
        [pageSize]="10"
        aria-label="Select page of GitHub search results"
      ></mat-paginator>
    </div>
  `,
})
export class AdminBooksCollectionOverviewComponent implements OnInit {
  private adminService = inject(AdminService);
  private dialog = inject(MatDialog);
  private activatedRoute = inject(ActivatedRoute);

  readonly books = input<Book[]>();

  selection = this.adminService.selection;
  selectedBooks$ = this.adminService.selectedBooks$;
  dataSource: MatTableDataSource<Book> | undefined;

  book?: Book;

  bool$ = new BehaviorSubject(false);

  @Output() openSheet = new EventEmitter();
  @Output() itemSelected = new EventEmitter<Book>();
  @Output() allItemSelected = new EventEmitter<Book[]>();
  @Output() selectionEvent = new EventEmitter<SelectionModel<Book>>();

  @Output() checkedState = new EventEmitter<boolean>();
  @Output() mainCheckedState = new EventEmitter<boolean>();

  @Output() sortAsc = new EventEmitter<string>();
  @Output() sortDesc = new EventEmitter<string>();

  displayedColumns: string[] = [
    'select',
    'id',
    'title',
    'genre',
    'author',
    'status',
    'year',
    'edit',
  ];

  onSortChange(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      // Optionally handle unsorted state
      return;
    }
    if (sort.direction === 'asc') {
      console.log(sort.active);

      this.sortAsc.emit(`${sort.active},asc`);
    } else if (sort.direction === 'desc') {
      this.sortDesc.emit(`${sort.active},desc`);
    }
  }

  protected sortParam$ = this.activatedRoute.queryParamMap.pipe(
    // distinctUntilChanged(),
    // filter((params) => params['sort']),
    tap((params) => console.log(params.get('sort'))),
    map((params) => {
      params.get('sort');
    }),
  );

  selectItem(book: Book | undefined) {
    this.itemSelected.emit(book);
    if (book) book = this.book;
    this.openSheet.emit();
  }

  selectAll() {
    this.openSheet.emit();
    this.allItemSelected.emit(this.books());
  }

  emitCheckedState(event: any) {
    this.checkedState.emit(event.checked);
  }

  emitMainCheckedState(event: any) {
    this.mainCheckedState.emit(event.checked);
  }

  openAddBookDialog() {
    const dialogRef = this.dialog.open(AddBookDialog);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openEditBookDialog(row: Book) {
    const dialogRef = this.dialog.open(EditBookDialog, {
      data: {
        id: row.id,
        title: row.title,
        genre: row.genre,
        author: row.author,
        date: row.publishedDate,
        photoUrl: row.photoUrl,
        description: row.description,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource?.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    if (this.dataSource) this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Book): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.id
    }`;
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Book>(this.books());
  }
}

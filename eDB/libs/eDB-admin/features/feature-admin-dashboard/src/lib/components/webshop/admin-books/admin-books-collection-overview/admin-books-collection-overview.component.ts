import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  inject,
  input,
} from '@angular/core';
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
import { UiButtonComponent } from '@eDB/shared-ui';
import { BehaviorSubject, map, tap } from 'rxjs';
import { AddBookDialog } from '../../add-book-modal/add-book-modal.component';
import { EditBookDialog } from '../../edit-book-modal/edit-book-modal.component';

@Component({
  selector: 'admin-books-collection-overview',
  styleUrls: ['admin-books-collection-overview.component.scss'],
  imports: [
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    UiButtonComponent,
  ],
  template: `
    <section class="collection-title">
      <h3 class="text-2xl">Books</h3>
      <div>
        <ui-button size="sm" (click)="openAddBookDialog()"> Add book</ui-button>
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
              <button mat-icon-button (click)="openEditBookDialog(row)">
                <mat-icon>edit</mat-icon>
              </button>
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
    const dialogRef = this.dialog.open(AddBookDialog, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      panelClass: 'full-screen-dialog',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openEditBookDialog(row: Book) {
    const dialogRef = this.dialog.open(EditBookDialog, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      panelClass: 'full-screen-dialog',
      data: {
        id: row.id,
        title: row.title,
        genre: row.genre,
        author: row.author,
        date: row.publishedDate,
        photoUrl: row.photoUrl,
        description: row.description,
      },
      autoFocus: false,
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
    if (this.dataSource) {
      this.selection.select(...this.dataSource.data);
    }
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Book): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  dataSource: MatTableDataSource<Book> | undefined;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Book>(this.books());
  }
}

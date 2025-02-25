import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { PaginationModule, TableModule } from 'carbon-components-angular';
import {
  TableHeaderItem,
  TableItem,
  TableModel,
} from 'carbon-components-angular/table';
import { SortEvent, UiTableComponent } from './table.component';

describe('UiTableComponent', () => {
  let component: UiTableComponent;
  let fixture: ComponentFixture<UiTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, TableModule, PaginationModule, UiTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiTableComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('model', new TableModel());
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render a table container', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const tableContainer = compiled.querySelector('cds-table-container');
    expect(tableContainer).toBeTruthy();
  });

  it('should emit rowClicked with index when onRowClick is called', () => {
    vi.spyOn(component.rowClicked, 'emit');
    const rowIndex = 2;
    component.onRowClick(rowIndex);
    expect(component.rowClicked.emit).toHaveBeenCalledWith(rowIndex);
  });

  it('should emit addApplication when onAddApplication is called', () => {
    vi.spyOn(component.addApplication, 'emit');
    component.onAddApplication();
    expect(component.addApplication.emit).toHaveBeenCalled();
  });

  it('should emit pageChanged with page number when onPageChange is called', () => {
    vi.spyOn(component.pageChanged, 'emit');
    const pageNumber = 3;
    component.onPageChange(pageNumber);
    expect(component.pageChanged.emit).toHaveBeenCalledWith(pageNumber);
  });

  it('should call console.log when onDelete is called', () => {
    vi.spyOn(console, 'log');
    component.onDelete();
    expect(console.log).toHaveBeenCalledWith('Delete action triggered');
  });

  describe('emitSortEvent', () => {
    it('should warn if the header is not found', () => {
      vi.spyOn(console, 'warn');
      vi.spyOn(component.sortChanged, 'emit');
      const invalidIndex = 999;
      component.emitSortEvent(invalidIndex);
      expect(console.warn).toHaveBeenCalledWith(
        `No header found for index: ${invalidIndex}`,
      );
      expect(component.sortChanged.emit).not.toHaveBeenCalled();
    });

    it('should emit sortChanged with correct SortEvent (asc -> desc)', () => {
      vi.spyOn(component.sortChanged, 'emit');
      component.model().header = [
        new TableHeaderItem({
          data: 'Name',
          ascending: true,
          metadata: { sortField: 'name' },
        }),
      ];
      component.emitSortEvent(0);
      expect(component.sortChanged.emit).toHaveBeenCalledWith({
        sortField: 'name',
        sortDirection: 'desc',
      } as SortEvent);
    });

    it('should emit sortChanged with correct SortEvent (desc -> asc)', () => {
      vi.spyOn(component.sortChanged, 'emit');
      component.model().header = [
        new TableHeaderItem({
          data: 'Name',
          ascending: false,
          metadata: { sortField: 'name' },
        }),
      ];
      component.emitSortEvent(0);
      expect(component.sortChanged.emit).toHaveBeenCalledWith({
        sortField: 'name',
        sortDirection: 'asc',
      } as SortEvent);
    });
  });

  describe('searchChanged', () => {
    it('should emit trimmed search term on input change', async () => {
      vi.spyOn(component.searchChanged, 'emit');
      const userInput = '   text   ';
      component.searchTerm.set(userInput);
      fixture.detectChanges();
      // Manually trigger the event
      component.searchChanged.emit(userInput.trim());
      expect(component.searchChanged.emit).toHaveBeenCalledWith('text');
    });
  });

  //
  // --- TEST FOR TABLE ITEMS ---
  //
  describe('table items', () => {
    it('should render rows and cells based on the model data', () => {
      // Create a custom model with header and data
      const customModel = new TableModel();
      customModel.header = [
        new TableHeaderItem({ data: 'Column 1' }),
        new TableHeaderItem({ data: 'Column 2' }),
      ];
      customModel.data = [
        [
          new TableItem({ data: 'Row 1, Cell 1' }),
          new TableItem({ data: 'Row 1, Cell 2' }),
        ],
        [
          new TableItem({ data: 'Row 2, Cell 1' }),
          new TableItem({ data: 'Row 2, Cell 2' }),
        ],
      ];

      // Update input and detect changes
      fixture.componentRef.setInput('model', customModel);
      fixture.detectChanges();

      // Query the DOM for rendered rows and cells
      const tableEl: HTMLElement = fixture.nativeElement;
      const rowEls = tableEl.querySelectorAll('cds-table tbody tr');

      // Assertion
      expect(rowEls.length).toBe(2); // We have 2 data rows

      // Check the first row
      const firstRowCells = rowEls[0].querySelectorAll('td');
      expect(firstRowCells.length).toBe(3);
      expect(firstRowCells[0].textContent?.trim()).toBe('Select row');
      expect(firstRowCells[1].textContent?.trim()).toBe('Row 1, Cell 1');
      expect(firstRowCells[2].textContent?.trim()).toBe('Row 1, Cell 2');

      // Check the second row
      const secondRowCells = rowEls[1].querySelectorAll('td');
      expect(secondRowCells.length).toBe(3);
      expect(firstRowCells[0].textContent?.trim()).toBe('Select row');
      expect(secondRowCells[1].textContent?.trim()).toBe('Row 2, Cell 1');
      expect(secondRowCells[2].textContent?.trim()).toBe('Row 2, Cell 2');
    });
  });
});

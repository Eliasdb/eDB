import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UiStructuredListComponent } from '@eDB/shared-ui';

@Component({
  selector: 'platform-settings-group',
  standalone: true,
  imports: [UiStructuredListComponent],
  template: `
    <div class="setting-group" [id]="id">
      <ui-structured-list
        [header]="header"
        [headerIcon]="headerIcon"
        [rows]="rows"
        (rowUpdated)="onRowUpdated($event)"
      ></ui-structured-list>
    </div>
  `,
  styleUrl: 'settings-group.component.scss',
})
export class SettingsGroupComponent {
  @Input() id!: string;
  @Input() header!: string;
  @Input() headerIcon: string = '';
  @Input() rows: [string, string][] = [];

  @Output() rowUpdated = new EventEmitter<{ field: string; value: string }>();

  onRowUpdated(event: { field: string; value: string }): void {
    this.rowUpdated.emit(event);
  }
}

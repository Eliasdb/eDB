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
        [editingRowIndex]="editingRowIndex"
        [isEditingAny]="isEditingAny"
        [inputValues]="inputValues"
        (actionClick)="actionClick.emit($event)"
        (updateEdit)="updateEdit.emit($event)"
        (cancelEdit)="cancelEdit.emit($event)"
      ></ui-structured-list>
    </div>
  `,
  styleUrls: ['./settings-group.component.scss'],
})
export class SettingsGroupComponent {
  @Input() id!: string;
  @Input() header!: string;
  @Input() headerIcon: string = '';
  @Input() rows: [string, string][] = [];

  @Input() editingRowIndex: number | null = null;
  @Input() isEditingAny: boolean = false;
  @Input() inputValues: any = {};

  @Output() actionClick = new EventEmitter<number>();
  @Output() updateEdit = new EventEmitter<number>();
  @Output() cancelEdit = new EventEmitter<number>();
}

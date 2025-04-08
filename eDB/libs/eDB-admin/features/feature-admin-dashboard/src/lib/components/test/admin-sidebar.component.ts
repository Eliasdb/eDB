import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss'],
  standalone: true,
})
export class AdminSidebarComponent {
  @Output() itemSelected = new EventEmitter<'platform' | 'webshop'>();

  onSelect(item: 'platform' | 'webshop') {
    this.itemSelected.emit(item);
  }
}

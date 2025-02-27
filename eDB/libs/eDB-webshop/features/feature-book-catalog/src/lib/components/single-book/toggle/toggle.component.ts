import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SwitchComponent } from '../switch/switch.component';

@Component({
  selector: 'toggle',
  standalone: true,
  imports: [SwitchComponent],
  template: `<switch [on]="on" (click)="onClick()"></switch> `,
  styleUrl: './toggle.component.scss',
})
export class ToggleComponent {
  @Input() on?: boolean;
  @Output() toggled: EventEmitter<boolean> = new EventEmitter();

  onClick() {
    this.on = !this.on;
    this.toggled.emit(this.on);
  }
}

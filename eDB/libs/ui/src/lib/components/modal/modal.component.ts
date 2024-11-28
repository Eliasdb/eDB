import { AfterContentInit, Component, Input } from '@angular/core';
import { ModalModule, ModalService } from 'carbon-components-angular';
import { Subject } from 'rxjs';
import { DynamicModalComponent } from './actual-modal.component';

@Component({
  selector: 'app-data-passing-modal',
  standalone: true,
  imports: [ModalModule],
  template: `
    <button class="cds--btn cds--btn--primary" (click)="openModal()">
      Open Modal
    </button>
    <h3>Data passed from input modal:</h3>
    {{ modalInputValue }}
  `,
})
export class DataPassingModal implements AfterContentInit {
  @Input() modalText: string = 'Hello, World';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  protected modalInputValue: string = '';
  protected data: Subject<string> = new Subject<string>();

  constructor(private modalService: ModalService) {}

  openModal() {
    this.modalService.create({
      component: DynamicModalComponent,
      inputs: {
        modalText: this.modalText,
        inputValue: this.modalInputValue,
        size: this.size,
        data: this.data,
      },
    });
  }

  ngAfterContentInit() {
    this.data.subscribe((value) => (this.modalInputValue = value));
  }
}

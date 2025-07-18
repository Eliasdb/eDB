import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output } from '@angular/core';
import { UiButtonComponent } from '@edb/shared-ui';
import { AccordionModule } from 'carbon-components-angular/accordion';
import { Application } from '../../../types/application-overview.type';

@Component({
  selector: 'platform-applications-accordion',
  imports: [CommonModule, AccordionModule, UiButtonComponent],
  template: `
    <cds-accordion [align]="align()" [size]="size()">
      @for (item of items(); track $index) {
        <cds-accordion-item
          title="{{ item.name }}"
          (selected)="onSelected($event)"
        >
          <section class="flex justify-between">
            <div>
              <p class="font-bold">Description</p>
              <p>{{ item.description }}</p>
            </div>
            <div>
              <p class="font-bold">Subscribers</p>
              <p>{{ item.subscriberCount }}</p>
            </div>
          </section>
          <section class="flex gap-2">
            <ui-button variant="tertiary" size="sm" (buttonClick)="onEdit(item)"
              >Edit</ui-button
            >
            <ui-button variant="danger" size="sm" (buttonClick)="onDelete(item)"
              >Delete</ui-button
            >
          </section>
        </cds-accordion-item>
      }
    </cds-accordion>
  `,
})
export class ApplicationsCollectionAccordionComponent {
  readonly align = input<'start' | 'end'>('start');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly items = input<Application[]>([]);

  @Output() editApplication = new EventEmitter<Application>();
  @Output() deleteApplication = new EventEmitter<Application>();

  onEdit(app: Application): void {
    this.editApplication.emit(app);
  }

  onDelete(app: Application): void {
    this.deleteApplication.emit(app);
  }
  onSelected(event: any): void {
    console.log('Accordion item selected:', event);
  }
}

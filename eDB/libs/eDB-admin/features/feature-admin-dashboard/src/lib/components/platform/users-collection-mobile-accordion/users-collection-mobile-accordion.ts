import { Component, EventEmitter, input, Output } from '@angular/core';
import { UiButtonComponent } from '@eDB/shared-ui';
import { AccordionModule } from 'carbon-components-angular/accordion';
import { UserProfile } from '../../../types/user.type';

@Component({
  selector: 'platform-users-accordion',
  imports: [AccordionModule, UiButtonComponent],
  template: `
    <cds-accordion [align]="align()" [size]="size()">
      @for (user of users(); track $index) {
        <cds-accordion-item
          title="{{ user.firstName + ' ' + user.lastName }}"
          (selected)="onSelected($event)"
        >
          <section class="flex justify-between">
            <div>
              <p class="font-bold">ID</p>
              <p>{{ user.id }}</p>
            </div>
            <div>
              <p class="font-bold">Email</p>
              <p>{{ user.email }}</p>
            </div>
            <div>
              <p class="font-bold">Role</p>
              <p>{{ user.role }}</p>
            </div>
          </section>
          <section class="flex gap-2">
            <ui-button
              variant="tertiary"
              size="sm"
              (buttonClick)="onViewMore(user.id)"
              >View More</ui-button
            >
            <ui-button variant="danger" size="sm">Delete User</ui-button>
          </section>
        </cds-accordion-item>
      }
    </cds-accordion>
  `,
})
export class UsersCollectionAccordionComponent {
  readonly align = input<'start' | 'end'>('start');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly users = input<UserProfile[]>([]);
  @Output() viewMoreId = new EventEmitter<number>();

  onViewMore(id: number) {
    console.log(id, typeof id);

    this.viewMoreId.emit(id);
  }

  onSelected(event: any): void {
    console.log('Accordion item selected:', event);
  }
}

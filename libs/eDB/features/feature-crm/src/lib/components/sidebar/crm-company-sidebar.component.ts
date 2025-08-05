import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  model,
} from '@angular/core';
import {
  UiIconButtonComponent,
  UiSlideInSidebarComponent,
} from '@edb/shared-ui';

export interface CompanyCard {
  name: string;
  contactCount: number;
  address?: string;
  website?: string;
  tags?: string[];
}

@Component({
  selector: 'crm-company-sidebar',
  imports: [CommonModule, UiSlideInSidebarComponent, UiIconButtonComponent],
  template: `
    <ui-slide-in-sidebar [embedded]="embedded" #shell (closed)="closed.emit()">
      <header class="p-6 border-b relative">
        <h2 class="text-2xl font-semibold">{{ c()?.name }}</h2>
        <p class="text-sm text-gray-500">
          {{ c()?.contactCount }}
          {{ c()?.contactCount === 1 ? 'contact' : 'contacts' }}
        </p>

        @if (c()?.tags?.length) {
          <div class="flex flex-wrap gap-2 mt-4">
            @for (tag of c()?.tags; track tag) {
              <span
                class="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-600"
              >
                {{ tag }}
              </span>
            }
          </div>
        }

        <ui-icon-button
          icon="faTimes"
          kind="ghost"
          size="sm"
          class="absolute top-4 right-4"
          description="Close sidebar"
          (iconButtonClick)="shell.close()"
        />
      </header>

      <section class="p-6 space-y-6 overflow-y-auto flex-1 text-sm">
        @if (c()?.address) {
          <div>
            <h3 class="mb-1 font-medium text-gray-800">Address</h3>
            <p class="text-gray-600 whitespace-pre-line">{{ c()?.address }}</p>
          </div>
        }

        @if (c()?.website) {
          <div>
            <h3 class="mb-1 font-medium text-gray-800">Website</h3>
            <a
              class="text-blue-600 underline break-all"
              target="_blank"
              rel="noopener"
            >
              {{ c()?.website }}
            </a>
          </div>
        }
      </section>
    </ui-slide-in-sidebar>
  `,
})
export class CrmCompanySidebarComponent {
  @Input({ alias: 'embedded' }) embedded = false;

  @ViewChild('shell', { static: true, read: UiSlideInSidebarComponent })
  private shell!: UiSlideInSidebarComponent;

  readonly c = model<CompanyCard>();

  open(data: CompanyCard) {
    this.c.set(data);
    this.shell.openPanel();
  }

  close() {
    this.shell.close();
  }

  @Output() closed = new EventEmitter<void>();
}

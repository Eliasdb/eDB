// apps/mobile/src/lib/ui/ui-nz-card.component.ts
import { Component, TemplateRef, ViewChild, input } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'ui-nz-card',
  standalone: true,
  imports: [NzCardModule],
  host: { class: 'block' },
  template: `
    <nz-card
      [nzTitle]="title()"
      [nzExtra]="extraTemplate"
      [nzBordered]="bordered()"
      [nzHoverable]="hoverable()"
      [nzLoading]="loading()"
      [nzCover]="coverTemplate"
    >
      <ng-content></ng-content>
    </nz-card>

    <ng-template #extraTpl>
      @if (extra(); as extraLabel) {
        <span class="text-sm font-medium text-slate-500">
          {{ extraLabel }}
        </span>
      }
    </ng-template>

    <ng-template #coverTpl>
      @if (coverImage(); as coverSrc) {
        <img
          class="w-full rounded-t-lg object-cover"
          [src]="coverSrc"
          [alt]="coverAlt()"
        />
      }
    </ng-template>
  `,
})
export class UiNzCardComponent {
  // Inputs
  readonly title = input<string>('');
  readonly extra = input<string | null>(null);
  readonly bordered = input<boolean>(true);
  readonly hoverable = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly coverImage = input<string | null>(null);
  readonly coverAlt = input<string>('Card cover');

  // Templates
  @ViewChild('extraTpl', { static: true })
  private readonly extraTpl!: TemplateRef<void>;

  @ViewChild('coverTpl', { static: true })
  private readonly coverTpl!: TemplateRef<void>;

  // Bindings for ng-zorro (match its types exactly)
  get extraTemplate(): string | TemplateRef<void> | undefined {
    // If you want the styled template, return the template when extra has a value
    // Otherwise undefined (not null) to satisfy NzCardComponent.nzExtra typing
    return this.extra() ? this.extraTpl : undefined;
  }

  get coverTemplate(): TemplateRef<void> | undefined {
    // Provide the cover template only when there is an image
    return this.coverImage() ? this.coverTpl : undefined;
  }
}

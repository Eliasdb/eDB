import {
  Component,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
  signal,
} from '@angular/core';
import {
  ContentSwitcherModule,
  ContentSwitcherOption,
} from 'carbon-components-angular';

@Component({
  selector: 'ui-content-switcher',
  imports: [ContentSwitcherModule],
  template: `
    <cds-content-switcher (selected)="onSelectionChange($event)">
      @for (option of options; let i = $index; track i) {
        <button
          cdsContentOption
          [attr.data-index]="i"
          [class.bx--content-switcher--selected]="i === activeSection()"
        >
          {{ option }}
        </button>
      }
    </cds-content-switcher>

    @if (activeSection() === 0) {
      <ng-content select="[section1]"></ng-content>
    }
    @if (activeSection() === 1) {
      <ng-content select="[section2]"></ng-content>
    }
    @if (activeSection() === 2) {
      <ng-content select="[section3]"></ng-content>
    }
  `,
})
export class UiContentSwitcherComponent {
  @Input() options: string[] = []; // Input for dynamic button labels

  activeSection = signal<number>(0); // Writable signal for active section
  @Output() activeSectionChange: EventEmitter<number> =
    new EventEmitter<number>();

  @ViewChildren(ContentSwitcherOption)
  optionsList!: QueryList<ContentSwitcherOption>;

  /**
   * Handles selection changes from the Content Switcher.
   * @param selectedOption The selected ContentSwitcherOption.
   */
  onSelectionChange(selectedOption: ContentSwitcherOption): void {
    const selectedIndex = this.optionsList.toArray().indexOf(selectedOption);
    if (selectedIndex !== -1 && selectedIndex !== this.activeSection()) {
      this.activeSection.set(selectedIndex);
      this.activeSectionChange.emit(selectedIndex);
    }
  }
}

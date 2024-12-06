import {
  Component,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  ContentSwitcherModule,
  ContentSwitcherOption,
} from 'carbon-components-angular';

@Component({
  selector: 'ui-content-switcher',
  standalone: true,
  imports: [ContentSwitcherModule],
  template: `
    <cds-content-switcher (selected)="onSelectionChange($event)">
      @for (option of optionsArray; let i = $index; track option) {
        <button
          cdsContentOption
          [attr.data-index]="i"
          [class.bx--content-switcher--selected]="i === activeSection"
        >
          {{ option }}
        </button>
      }
    </cds-content-switcher>

    @if (activeSection === 0) {
      <ng-content select="[section1]"></ng-content>
    }
    @if (activeSection === 1) {
      <ng-content select="[section2]"></ng-content>
    }
    @if (activeSection === 2) {
      <ng-content select="[section3]"></ng-content>
    }
  `,
})
export class UiContentSwitcherComponent {
  @Input() optionsArray: string[] = []; // Input for dynamic button labels

  @Input() activeSection: number = 0; // 0-based index for active section
  @Output() activeSectionChange: EventEmitter<number> =
    new EventEmitter<number>();

  @ViewChildren(ContentSwitcherOption)
  options!: QueryList<ContentSwitcherOption>;

  /**
   * Handles selection changes from the Content Switcher.
   * @param selectedOption The selected ContentSwitcherOption.
   */
  onSelectionChange(selectedOption: ContentSwitcherOption): void {
    const selectedIndex = this.options.toArray().indexOf(selectedOption);
    if (selectedIndex !== -1 && selectedIndex !== this.activeSection) {
      this.activeSection = selectedIndex;
      this.activeSectionChange.emit(this.activeSection);
    }
  }
}

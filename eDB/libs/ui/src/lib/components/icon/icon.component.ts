import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'ui-icon',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    @if (icon) {
      <fa-icon
        [icon]="icon"
        [style.color]="color"
        [style.fontSize]="size"
        [class.fa-border]="border"
        [class.dynamic-icon]="fixedWidth"
        [class.fa-fw]="fixedWidth"
      ></fa-icon>
    }
  `,
  styleUrls: ['./icon.component.scss'],
})
export class UiIconComponent implements OnChanges {
  @Input() name!: string;
  @Input() size: string = '1em';
  @Input() color: string = '';
  @Input() border: boolean = false;
  @Input() fixedWidth: boolean = false;
  icon!: IconDefinition;

  private validIcons: Record<string, IconDefinition> = this.getValidIcons();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['name']?.currentValue) {
      this.icon = this.validIcons[this.name];
      if (!this.icon) {
        console.error(`Icon "${this.name}" not found.`);
      }
    }
  }

  private getValidIcons(): Record<string, IconDefinition> {
    return Object.entries(solidIcons)
      .filter(([_, value]) => typeof value === 'object' && 'icon' in value)
      .reduce(
        (acc, [key, value]) => {
          acc[key] = value as IconDefinition;
          return acc;
        },
        {} as Record<string, IconDefinition>,
      );
  }
}

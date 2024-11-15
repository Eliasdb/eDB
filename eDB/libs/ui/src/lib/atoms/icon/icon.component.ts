import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dynamic-icon',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  template: ` <fa-icon *ngIf="icon" [icon]="icon"></fa-icon> `,
  styleUrls: ['./icon.component.scss'],
})
export class DynamicIconComponent implements OnChanges {
  @Input() name!: string; // Icon name, e.g., 'faCoffee'
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
      .filter(([key, value]) => typeof value === 'object' && 'icon' in value)
      .reduce((acc, [key, value]) => {
        acc[key] = value as IconDefinition;
        return acc;
      }, {} as Record<string, IconDefinition>);
  }
}

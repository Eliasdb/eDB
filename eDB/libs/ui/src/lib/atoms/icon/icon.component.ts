import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  template: `
    <fa-icon
      *ngIf="icon"
      [icon]="icon"
      [ngStyle]="{ color: color, fontSize: size }"
      [ngClass]="{ 'fa-border': border, 'dynamic-icon fa-fw': fixedWidth }"
    ></fa-icon>
  `,
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnChanges {
  @Input() name!: string; // Icon name, e.g., 'faCoffee'
  @Input() size: string = '1em'; // Icon size, e.g., '2em', '24px'
  @Input() color: string = ''; // Icon color, e.g., 'red', '#FF0000'
  @Input() border: boolean = false; // Add a border around the icon
  @Input() fixedWidth: boolean = false; // Use fixed width for alignment
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
      .reduce((acc, [key, value]) => {
        acc[key] = value as IconDefinition;
        return acc;
      }, {} as Record<string, IconDefinition>);
  }
}

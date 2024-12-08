import { Component, computed, input, Signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/angular-fontawesome/types';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'ui-icon',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    @if (icon()) {
      <fa-icon
        [icon]="icon()"
        [style.color]="color()"
        [style.fontSize]="size()"
        [class.fa-border]="border()"
        [class.dynamic-icon]="fixedWidth()"
        [class.fa-fw]="fixedWidth()"
      ></fa-icon>
    }
  `,
  styleUrls: ['./icon.component.scss'],
})
export class UiIconComponent {
  readonly name = input<string | undefined>();
  readonly size = input<string>('1em');
  readonly color = input<string>('');
  readonly border = input<boolean>(false);
  readonly fixedWidth = input<boolean>(false);

  // Compute the icon based on the `name` input
  readonly icon: Signal<IconProp> = computed(() => {
    const iconName = this.name() || 'faQuestionCircle'; // Fallback to a default icon
    const validIcons = this.getValidIcons();
    const icon = validIcons[iconName];
    if (!icon) {
      console.error(`Icon "${iconName}" not found.`);
    }
    return icon || null;
  });

  // Helper method to get valid icons
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

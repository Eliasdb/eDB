// platform-header.component.ts (Platform app)
import { Component } from '@angular/core';
import { HeaderComponent } from '@e-db/ui';

@Component({
  selector: 'app-platform-header',
  standalone: true,
  imports: [HeaderComponent],
  template: ` <ui-header></ui-header> `,
})
export class PlatformHeaderComponent {
  // Platform-specific logic can be added here
}

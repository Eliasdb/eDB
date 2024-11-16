// platform-header.component.ts (Platform app)
import { Component } from '@angular/core';
import { HeaderComponent } from '@e-db/ui';

@Component({
  selector: 'app-platform-footer',
  standalone: true,
  imports: [HeaderComponent],
  template: ` <ui-footer></ui-footer> `,
})
export class PlatformHeaderComponent {
  // Platform-specific logic can be added here
}

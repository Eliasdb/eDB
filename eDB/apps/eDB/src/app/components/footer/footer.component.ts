// platform-header.component.ts (Platform app)
import { Component } from '@angular/core';
import { FooterComponent } from '@e-db/ui';

@Component({
  selector: 'app-platform-footer',
  standalone: true,
  imports: [FooterComponent],
  template: ` <ui-footer></ui-footer> `,
})
export class PlatformFooterComponent {}

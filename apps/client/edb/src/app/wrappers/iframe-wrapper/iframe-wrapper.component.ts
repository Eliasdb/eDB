// apps/client/edb/src/app/wrappers/iframe-wrapper/iframe-wrapper.component.ts
import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-iframe-wrapper',
  template: `
    <iframe
      class="clara-frame"
      [src]="src"
      allow="microphone; autoplay"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
    ></iframe>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        width: 100%;
      }

      .clara-frame {
        position: fixed; /* take over the whole viewport. */
        inset: 0; /* top, right, bottom, left = 0 */
        width: 100%;
        height: 100%;
        border: none;
        z-index: 9999; /* make sure it sits above platform header */
      }
    `,
  ],
})
export class IframeWrapperComponent {
  src: SafeResourceUrl;
  private readonly sanitizer = inject(DomSanitizer);

  constructor() {
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl(
      'assets/clara/index.html',
    );
  }
}

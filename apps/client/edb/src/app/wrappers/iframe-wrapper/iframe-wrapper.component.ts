// apps/client/edb/src/app/wrappers/iframe-wrapper/iframe-wrapper.component.ts
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-iframe-wrapper',
  template: `
    <div class="clara-fill">
      <iframe
        class="clara-frame"
        [src]="src"
        allow="microphone; autoplay"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      ></iframe>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }

      .clara-fill {
        position: absolute;
        inset: 5rem 0 0 0; /* top offset for header */
      }

      .clara-frame {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        border: 0;
      }
    `,
  ],
})
export class IframeWrapperComponent {
  src: SafeResourceUrl;
  constructor(s: DomSanitizer) {
    this.src = s.bypassSecurityTrustResourceUrl('assets/clara/index.html');
  }
}

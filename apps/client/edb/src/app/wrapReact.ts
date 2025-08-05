import {
  AfterContentInit,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KeycloakService } from '@edb/client-auth';

@Component({
  template: '<div #vc></div>',
})
export class WrapperComponent implements AfterContentInit {
  @ViewChild('vc', { read: ElementRef, static: true }) vc!: ElementRef;

  constructor(private route: ActivatedRoute) {}

  private keycloakService = inject(KeycloakService);

  async ngAfterContentInit(): Promise<void> {
    // Only inject the script if the custom element is not yet defined
    if (!customElements.get('home-react')) {
      await this.loadScript('/assets/eDB-user-account/eDB-user-account.js');
    }

    const token = this.keycloakService.authState().token;
    const el = document.createElement('home-react');
    if (token) el.setAttribute('data-token', token);

    this.vc.nativeElement.appendChild(el);
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.body.appendChild(script);
    });
  }
}

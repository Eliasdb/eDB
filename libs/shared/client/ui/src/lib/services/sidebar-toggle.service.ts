/* libs/shared-client/ui/src/lib/layout/sidebar-toggle.service.ts */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/** Broadcast “please toggle the main shell drawer” */
@Injectable({ providedIn: 'root' })
export class SidebarToggleService {
  private _toggle$ = new Subject<void>();
  readonly toggle$ = this._toggle$.asObservable();

  requestToggle() {
    this._toggle$.next();
  }
}

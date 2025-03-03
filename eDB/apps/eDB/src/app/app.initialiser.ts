import { Injector, inject, runInInjectionContext } from '@angular/core';
import { AuthService } from '@eDB/client-auth';

export function initializeAppFactory(): Promise<unknown> {
  const injector = inject(Injector);
  return runInInjectionContext(injector, () => {
    const authService = inject(AuthService);
    return authService.checkSessionPromise();
  });
}

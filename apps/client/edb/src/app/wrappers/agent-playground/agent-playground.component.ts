// src/app/playground/agent-playground.component.ts
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ApplicationRef,
  Component,
  ComponentRef,
  ElementRef,
  EnvironmentInjector,
  OnDestroy,
  OnInit,
  ViewChild,
  createComponent,
} from '@angular/core';
import { EventPlannerComponent } from '../../agent-playground/event-planner.component';

@Component({
  selector: 'app-agent-playground',
  standalone: true,
  imports: [CommonModule],
  host: {
    class: 'block bg-[var(--background)] text-[var(--foreground)]',
  },
  template: `
    <section class="max-w-6xl mx-auto p-6 space-y-4 pt-24">
      <header class="space-y-1">
        <h1 class="text-lg font-semibold leading-tight">Agent Playground</h1>
        <p class="text-sm text-[color:var(--muted-foreground,#6b7280)]">
          Mount area for generated UI.
        </p>
      </header>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="inline-flex items-center rounded-lg border border-[var(--border,#e5e7eb)] bg-[var(--card,#fff)] px-3 py-2 text-sm"
          (click)="clear()"
        >
          Clear
        </button>
      </div>

      <div
        #mount
        id="agent-mount"
        class="min-h-80 rounded-xl border border-dashed border-[var(--border,#d1d5db)] bg-[var(--card,#fafafa)] p-4"
        aria-live="polite"
      ></div>
    </section>
  `,
})
export class AgentPlaygroundComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('mount', { static: true }) mountRef!: ElementRef<HTMLDivElement>;
  private mountedComponent?: ComponentRef<EventPlannerComponent>;

  constructor(
    private readonly environmentInjector: EnvironmentInjector,
    private readonly appRef: ApplicationRef,
  ) {}

  clear() {
    this.destroyMountedApp();
    this.mountRef.nativeElement.innerHTML = '';
  }

  /** helper the agent can call to inject HTML */
  mountHtml(html: string) {
    this.destroyMountedApp();
    this.mountRef.nativeElement.innerHTML = html ?? '';
  }

  mountApp() {
    this.destroyMountedApp();
    const componentRef = createComponent(EventPlannerComponent, {
      environmentInjector: this.environmentInjector,
    });
    this.appRef.attachView(componentRef.hostView);
    this.mountRef.nativeElement.innerHTML = '';
    this.mountRef.nativeElement.appendChild(
      componentRef.location.nativeElement,
    );
    this.mountedComponent = componentRef;
  }

  ngOnInit() {
    if (typeof window !== 'undefined') {
      (window as any).agentPlayground = {
        mountHtml: this.mountHtml.bind(this),
        clear: this.clear.bind(this),
        mountApp: this.mountApp.bind(this),
        el: () => this.mountRef.nativeElement,
      };
    }
  }

  ngAfterViewInit() {
    queueMicrotask(() => this.mountApp());
  }

  ngOnDestroy() {
    this.destroyMountedApp();
    if (typeof window !== 'undefined') {
      delete (window as any).agentPlayground;
    }
  }

  private destroyMountedApp() {
    if (this.mountedComponent) {
      this.appRef.detachView(this.mountedComponent.hostView);
      this.mountedComponent.destroy();
      this.mountedComponent = undefined;
    }
  }
}

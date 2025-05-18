// libs/react-wrapper/src/lib/wrap-react.ts
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  Type,
  ViewChild,
} from '@angular/core';
import React from 'react';
import * as ReactDOM from 'react-dom/client';

const cache = new WeakMap<any, Type<any>>();

export function wrapReact(ReactComponent: any): Type<any> {
  if (cache.has(ReactComponent)) return cache.get(ReactComponent)!;

  @Component({
    standalone: true,
    template: '<div #root></div>',
  })
  class ReactBridge implements AfterViewInit, OnDestroy {
    @ViewChild('root', { static: true }) root!: ElementRef<HTMLDivElement>;
    private reactRoot!: ReactDOM.Root;
    ngAfterViewInit() {
      this.reactRoot = ReactDOM.createRoot(this.root.nativeElement);
      this.reactRoot.render(React.createElement(ReactComponent));
    }
    ngOnDestroy() {
      this.reactRoot?.unmount();
    }
  }

  cache.set(ReactComponent, ReactBridge);
  return ReactBridge;
}

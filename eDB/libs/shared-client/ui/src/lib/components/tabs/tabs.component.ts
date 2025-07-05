import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';
import { TabsModule } from 'carbon-components-angular';

@Component({
  selector: 'ui-tabs',
  standalone: true,
  imports: [TabsModule, CommonModule],
  template: `
    <cds-tabs
      type="line"
      [followFocus]="true"
      [isNavigation]="false"
      [cacheActive]="false"
    >
      @for (tab of tabs; track tab.label) {
        <cds-tab [heading]="tab.label" [tabContent]="tab.content"></cds-tab>
      }
    </cds-tabs>
  `,
})
export class UiTabsComponent {
  @Input() tabs: { label: string; content: TemplateRef<any> }[] = [];
}

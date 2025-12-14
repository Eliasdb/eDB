import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';
import { ModalModule, PlaceholderModule } from 'carbon-components-angular';

import { MatDrawer } from '@angular/material/sidenav';

import { AdminDashboardComponent } from './components/test/admin-dashboard.component';

import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PieController,
  Tooltip,
} from 'chart.js';

Chart.register(
  LinearScale,
  CategoryScale,
  LineController,
  LineElement,
  BarElement,
  BarController,
  ArcElement,
  PieController,
  Tooltip,
  Legend,
);

console.log('✅ Chart.js registered once in host:', Chart);

@Component({
  selector: 'platform-admin',
  template: `
    <ibm-modal-placeholder></ibm-modal-placeholder>
    <section class="admin-page ">
      <edb-admin-dashboard />
    </section>
  `,
  imports: [AdminDashboardComponent, ModalModule, PlaceholderModule],
  styleUrls: ['admin.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminPage implements OnDestroy {
  currentView = signal<'books' | 'order-overview'>('books');
  @ViewChild('drawer') drawer!: MatDrawer;

  switchDrawerContent(newContent: 'books' | 'order-overview') {
    console.log(`Switching view to: ${newContent}`);
    this.currentView.set(newContent);
    this.drawer.toggle();
  }

  ngOnDestroy() {
    console.log('[ADMIN] destroyed');
  }
}

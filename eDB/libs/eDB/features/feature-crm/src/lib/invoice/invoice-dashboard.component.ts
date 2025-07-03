import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { UiTableComponent, UiTileComponent } from '@edb/shared-ui';
import {
  TableHeaderItem,
  TableItem,
  TableModel,
} from 'carbon-components-angular';
import {
  BarController,
  BarElement,
  CategoryScale,
  ChartConfiguration,
  ChartData,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

ChartJS.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

import { environment } from '@eDB/shared-env';

/**
 * Redesigned invoice dashboard (v2)
 * --------------------------------------------------------------
 * - Compact bar chart with strict typings that compile under
 *   Chart.js 4 + ng2‑charts 4 (Angular 17).
 * - Uses `ChartConfiguration<'bar'>['options']` to satisfy the
 *   BaseChartDirective generic and remove TS2322 / TS2322 overlap
 *   errors.
 * - `chartType` is now a literal `'bar'` to match the directive’s
 *   expected type parameter.
 */
@Component({
  selector: 'app-invoice-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    UiTableComponent,
    BaseChartDirective,
    UiTileComponent,
  ],
  template: `
    <div class="p-8 flex flex-col gap-10 bg-slate-50 min-h-screen">
      <!-- KPI Tiles -->
      <!-- ░ Page title ░ -->
      <h1 class="mb-8 text-2xl font-bold tracking-tight text-black">
        BTW-aangifte
      </h1>
      <section class="grid gap-6 sm:grid-cols-3">
        <ui-tile
          class="shadow-lg rounded-xl"
          [title]="'Total Net'"
          [description]="'Sum of all net amounts'"
          [tags]="[totalNet() + ' €']"
        ></ui-tile>

        <ui-tile
          class="shadow-lg rounded-xl"
          [title]="'Total VAT'"
          [description]="'Total BTW collected'"
          [tags]="[totalVat() + ' €']"
        ></ui-tile>

        <ui-tile
          class="shadow-lg rounded-xl"
          [title]="'Invoices'"
          [description]="'Total invoice count'"
          [tags]="[invoices().length.toString()]"
        ></ui-tile>
      </section>

      <!-- Dashboard Content -->
      <section class="grid gap-8 lg:grid-cols-2">
        <!-- VAT Chart -->
        <div class="bg-white p-6 rounded-xl shadow-lg flex flex-col">
          <h2 class="text-lg font-semibold mb-4 text-black">VAT per Month</h2>
          <div class="relative h-72 w-full">
            <canvas
              baseChart
              [data]="chartData"
              [labels]="chartLabels"
              [type]="chartType"
              [options]="chartOptions"
            ></canvas>
          </div>
        </div>

        <!-- Invoice Table -->
        <div class="bg-white p-6 rounded-xl shadow-lg overflow-auto">
          <h2 class="text-lg font-semibold mb-4 text-black">
            Invoice Overview
          </h2>
          <ui-table
            [title]="'Invoices'"
            [description]="'All parsed Hetzner invoices'"
            [model]="tableModel()"
            [sortable]="true"
            [showSelectionColumn]="false"
            [showToolbar]="true"
            [striped]="true"
          ></ui-table>
        </div>
      </section>
    </div>
  `,
})
export class InvoiceDashboardComponent implements OnInit {
  invoices = signal<any[]>([]);
  totalNet = signal<string>('0');
  totalVat = signal<string>('0');

  // ---- Chart Setup --------------------------------------------------------
  chartLabels: string[] = [];
  chartData: ChartData<'bar'> = { labels: [], datasets: [] };
  /**
   * `chartType` must be the literal union that matches the generic
   * parameter supplied to BaseChartDirective, otherwise Angular’s
   * template‑type‑checker complains.
   */
  chartType: 'bar' = 'bar';

  /**
   * Use the helper type from Chart.js to match the directive:
   *   ChartConfiguration<'bar'>['options']
   */
  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        type: 'category',
        grid: { display: false },
        // Keep ticks simple to avoid overload on typings
      },
      y: {
        type: 'linear',
        beginAtZero: true,
        grid: { color: '#f3f4f6' },
        ticks: {
          callback: (value: string | number) => `€${value}`,
        },
      },
    },
  };

  // ---- Table --------------------------------------------------------------
  tableModel = signal<TableModel>(new TableModel());

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http
      .get<any[]>(`${environment.invoicesAPIUrl}/invoices`)
      .subscribe((invoices) => {
        this.invoices.set(invoices);
        this.setupTable(invoices);
        this.calculateTotals(invoices);
        this.setupChart(invoices);
      });
  }

  /* ─────────────────────────── Helpers ─────────────────────────── */
  private setupTable(invoices: any[]) {
    const model = new TableModel();
    model.header = [
      new TableHeaderItem({ data: 'Invoice Number' }),
      new TableHeaderItem({ data: 'Date' }),
      new TableHeaderItem({ data: 'Service Period' }),
      new TableHeaderItem({ data: 'Net (€)' }),
      new TableHeaderItem({ data: 'VAT (€)' }),
      new TableHeaderItem({ data: 'Total (€)' }),
    ];

    model.data = invoices.map((inv) => [
      new TableItem({ data: inv.invoice_number }),
      new TableItem({ data: inv.invoice_date }),
      new TableItem({ data: inv.service_period }),
      new TableItem({ data: inv.net }),
      new TableItem({ data: inv.vat }),
      new TableItem({ data: inv.total }),
    ]);

    this.tableModel.set(model);
  }

  private calculateTotals(invoices: any[]) {
    const net = invoices.reduce((sum, inv) => sum + parseFloat(inv.net), 0);
    const vat = invoices.reduce((sum, inv) => sum + parseFloat(inv.vat), 0);
    this.totalNet.set(net.toFixed(2));
    this.totalVat.set(vat.toFixed(2));
  }

  private setupChart(invoices: any[]) {
    const vatByMonth: Record<string, number> = {};

    for (const inv of invoices) {
      const month = inv.service_period; // e.g. "2024-01"
      vatByMonth[month] = (vatByMonth[month] || 0) + parseFloat(inv.vat);
    }

    const sortedMonths = Object.keys(vatByMonth).sort();
    this.chartLabels = sortedMonths;

    this.chartData = {
      labels: sortedMonths,
      datasets: [
        {
          label: 'VAT (€)',
          data: sortedMonths.map((m) => vatByMonth[m]),
          backgroundColor: '#3b82f6',
          borderRadius: 4,
          borderSkipped: false,
          barPercentage: 0.6,
          categoryPercentage: 0.6,
        },
      ],
    };
  }
}

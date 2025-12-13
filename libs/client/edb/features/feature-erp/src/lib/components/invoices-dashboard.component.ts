import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
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

import { environment } from '@eDB/shared-env';
import { BtwFilingReminderComponent } from './btw-filing-reminder.component';

ChartJS.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

type Invoice = {
  invoice_number: string;
  invoice_date: string;
  service_period: string;
  net: string;
  vat: string;
  total: string;
};

@Component({
  selector: 'edb-invoice-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    UiTableComponent,
    UiTileComponent,
    BaseChartDirective,
    BtwFilingReminderComponent,
  ],
  template: `
    <div class="p-8 flex flex-col gap-10 bg-slate-50 min-h-screen">
      <!-- ░ Reminder Section ░ -->
      <edb-btw-filing-reminder />

      <!-- ░ KPI Section ░ -->
      <section class="grid gap-6 sm:grid-cols-3">
        <ui-tile
          class="shadow-lg rounded-xl"
          [title]="'Total Net'"
          [description]="'Sum of all net amounts'"
          [tags]="[totalNet() + ' €']"
        />
        <ui-tile
          class="shadow-lg rounded-xl"
          [title]="'Total VAT'"
          [description]="'Total BTW collected'"
          [tags]="[totalVat() + ' €']"
        />
        <ui-tile
          class="shadow-lg rounded-xl"
          [title]="'Invoices'"
          [description]="'Total invoice count'"
          [tags]="[invoices().length.toString()]"
        />
      </section>

      <!-- ░ Dashboard Section ░ -->
      <section class="grid gap-8 lg:grid-cols-2">
        <!-- Chart -->
        <div class="bg-white p-6 rounded-xl shadow-lg">
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

        <!-- Table -->
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
          />
        </div>
      </section>
    </div>
  `,
})
export class InvoiceDashboardComponent implements OnInit {
  invoices = signal<Invoice[]>([]);
  totalNet = signal<string>('0');
  totalVat = signal<string>('0');
  tableModel = signal<TableModel>(new TableModel());

  chartLabels: string[] = [];
  chartType = 'bar' as const;
  chartData: ChartData<'bar'> = { labels: [], datasets: [] };
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

  private readonly http = inject(HttpClient);

  ngOnInit(): void {
    this.http
      .get<Invoice[]>(`${environment.invoicesAPIUrl}/invoices`)
      .subscribe((invoices) => {
        this.invoices.set(invoices);
        this.setupTable(invoices);
        this.calculateTotals(invoices);
        this.setupChart(invoices);
      });
  }

  private setupTable(invoices: Invoice[]) {
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

  private calculateTotals(invoices: Invoice[]) {
    const net = invoices.reduce((sum, inv) => sum + parseFloat(inv.net), 0);
    const vat = invoices.reduce((sum, inv) => sum + parseFloat(inv.vat), 0);
    this.totalNet.set(net.toFixed(2));
    this.totalVat.set(vat.toFixed(2));
  }

  private setupChart(invoices: Invoice[]) {
    const vatByMonth: Record<string, number> = {};
    for (const inv of invoices) {
      const month = inv.service_period;
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

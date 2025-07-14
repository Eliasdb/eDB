import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'erp-home',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-[calc(100dvh-9rem)] p-6 bg-slate-50 text-black">
      <h1 class="text-2xl font-bold mb-6 ">ERP Home</h1>
      <p class="text-gray-600 mb-8">
        Welcome to the ERP dashboard. Choose a module below:
      </p>

      <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        <a
          routerLink="invoices"
          class="p-6 rounded-xl bg-white border shadow hover:bg-gray-50 transition"
        >
          <h2 class="text-lg font-semibold mb-2">🧾 Invoices</h2>
          <p class="text-sm text-gray-600">
            View VAT insights and invoice reports
          </p>
        </a>

        <a
          routerLink="reports"
          class="p-6 rounded-xl bg-white border shadow hover:bg-gray-50 transition opacity-50 cursor-not-allowed"
        >
          <h2 class="text-lg font-semibold mb-2">📊 Reports</h2>
          <p class="text-sm text-gray-600">
            Coming soon: ERP metrics and analytics
          </p>
        </a>
      </div>
    </div>
  `,
})
export class ErpHomeComponent {}

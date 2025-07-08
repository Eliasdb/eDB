import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'crm-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6 pt-8 bg-slate-50 min-h-[calc(100vh-9rem)] ">
      <section class="max-w-7xl mx-auto">
        <h1 class="text-2xl font-bold mb-6 text-black">CRM Home</h1>
        <p class="text-gray-600 mb-8">
          Welcome! Choose a module below to get started:
        </p>

        <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <a
            routerLink="contacts"
            class="p-6 rounded-xl bg-white border shadow hover:bg-gray-50 transition"
          >
            <h2 class="text-lg font-semibold mb-2">📇 Contacts</h2>
            <p class="text-sm text-gray-600">
              View and manage companies & contacts
            </p>
          </a>

          <a
            routerLink="reports"
            class="p-6 rounded-xl bg-white border shadow hover:bg-gray-50 transition opacity-50 cursor-not-allowed"
          >
            <h2 class="text-lg font-semibold mb-2">📊 Reports</h2>
            <p class="text-sm text-gray-600">
              Insights and exports (coming soon)
            </p>
          </a>
        </div>
      </section>
    </div>
  `,
})
export class CrmHomeComponent {}

import { Component } from '@angular/core';

@Component({
  selector: 'edb-btw-filing-reminder',
  standalone: true,
  template: `
    <div class="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
      <h2 class="text-lg font-bold text-yellow-700 mb-2">
        BTW Aangifte Reminder
      </h2>
      <p class="mb-4 text-sm text-gray-700">
        Je bent een <strong>kwartaalaangever</strong>. Vergeet je btw-aangifte
        niet tijdig in te dienen! Je mag je aangifte ook
        <strong>vroeger indienen</strong>, zodra het kwartaal voorbij is.
      </p>
      <ul class="list-disc list-inside text-sm text-gray-800 space-y-1">
        <li>
          <strong>Q2 2025</strong> (apr–jun): indienen vóór
          <strong>25 juli 2025</strong>
        </li>
        <li>
          <strong>Q3 2025</strong> (jul–sep): indienen vóór
          <strong>25 oktober 2025</strong>
        </li>
        <li>
          <strong>Q4 2025</strong> (okt–dec): indienen vóór
          <strong>25 januari 2026</strong>
        </li>
      </ul>
      <p class="mt-4 text-xs text-gray-500">
        Tip: Dien je aangifte in via
        <a
          href="https://intervat.minfin.fgov.be/VAT/dashboard"
          target="_blank"
          class="underline"
          >Intervat</a
        >.
      </p>
    </div>
  `,
})
export class BtwFilingReminderComponent {}

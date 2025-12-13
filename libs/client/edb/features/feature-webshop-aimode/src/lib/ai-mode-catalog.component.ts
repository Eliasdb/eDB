// feature-aimode/ai-mode-catalog.component.ts
import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AiSearchService } from './services/ai-search.service';
import { AiBookItem } from './types/ai-search';

@Component({
  selector: 'webshop-ai-mode-catalog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section
      class="fixed inset-0 z-[999] bg-white/95 backdrop-blur-sm overflow-y-auto p-6 pt-24"
    >
      <!-- Header -->
      <div class="flex items-start justify-between mb-6">
        <div class="w-full max-w-3xl mx-auto text-center">
          <h2 class="text-xl font-semibold text-slate-800">
            AI Results for: <span class="italic">“{{ svc.nlQuery() }}”</span>
          </h2>

          <div
            class="mt-4 flex flex-col md:flex-row gap-3 justify-center items-center"
          >
            <input
              [formControl]="searchControl"
              placeholder="Search these results…"
              class="w-full md:w-96 text-sm pl-3 pr-3 py-2 rounded-xl border border-slate-300 bg-white/60 hover:bg-slate-100 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
            />

            <div class="flex gap-2 flex-wrap justify-center">
              @for (k of filterKeys(); track k) {
                <span
                  class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-xs"
                >
                  {{ k }}={{ firstPage().filters_used[k] }}
                </span>
              }
            </div>
          </div>
        </div>

        <button
          (click)="close()"
          class="text-sm text-red-600 hover:underline font-medium ml-4 shrink-0 absolute right-6 top-6"
        >
          ✕ Exit AI Mode
        </button>
      </div>

      <!-- Content -->
      @if (!svc.isLoading()) {
        @if (svc.flatItems().length) {
          <div
            class="mx-auto max-w-[82%] grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3"
          >
            @for (b of svc.flatItems(); track b) {
              <article
                class="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <img
                  [src]="b.photoUrl"
                  [alt]="b.title"
                  loading="lazy"
                  class="w-full aspect-[2/3] object-cover"
                />
                <div class="p-3">
                  <h3
                    class="text-sm font-semibold text-slate-800 mb-1 leading-snug"
                  >
                    {{ b.title }}
                  </h3>
                  <p class="text-xs text-slate-600 mb-0.5">by {{ b.author }}</p>
                  <p class="text-[11px] text-slate-500 mb-1">
                    {{ b.publishedDate }} • {{ b.genre }}
                  </p>
                  <p class="text-xs text-slate-700 line-clamp-3 leading-snug">
                    {{ b.description }}
                  </p>
                </div>
              </article>
            }
          </div>

          @if (svc.hasMore()) {
            <div class="text-center py-8">
              <button
                class="px-4 py-2 text-sm rounded-md bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50"
                (click)="svc.aiInfiniteQuery.fetchNextPage()"
                [disabled]="svc.isFetchingNextPage()"
              >
                {{ svc.isFetchingNextPage() ? 'Loading…' : 'Load more' }}
              </button>
            </div>
          } @else {
            <div class="mt-6 text-center text-slate-400 text-xs">
              End of results
            </div>
          }
        } @else {
          <div class="py-32 text-center text-slate-400 text-sm">
            No results for “{{ svc.nlQuery() }}”
          </div>
        }
      } @else {
        <div class="py-32 text-center text-slate-500 text-sm">Loading…</div>
      }
    </section>
  `,
})
export class AiModeCatalogComponent implements OnInit {
  readonly onClose = input<() => void>(() => undefined);
  protected svc = inject(AiSearchService);

  searchControl = new FormControl('');

  ngOnInit() {
    this.searchControl.setValue(this.svc.nlQuery(), { emitEvent: false });

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        const query = (value ?? '').trim();
        this.svc.run(query);
      });
  }

  firstPage = computed(() => this.svc.firstPage());
  filterKeys = computed(() =>
    this.firstPage() ? Object.keys(this.firstPage()?.filters_used ?? {}) : [],
  );

  trackByIndex = (index: number, _item: AiBookItem) => index;
  close() {
    this.onClose()();
  }
}

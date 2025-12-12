# EDB Platform – Feature & UI Contribution Guide (Angular + Nx)

This guide defines exactly how to build, organize, and integrate new features in your EDB application—including library structure, UI, and data-access standards. **Every new feature, page, or domain should be implemented according to these patterns and using only the commands below.**

---

## 1. EDB App Structure & Feature Integration

- Each major area (“dashboard”, “catalog”, “crm”, “webshop”, “erp”, etc) is its own Nx Angular feature library, **lazy-loaded via the app’s main routes:**
  ```typescript
  // (Excerpt)
  {
    path: 'crm',
    loadChildren: () =>
      import('@edb/feature-crm').then((m) => m.featureCrmRoutes),
  },
  ```
- New features are integrated by:
  1. Generating a new feature lib (see commands below)
  2. Exporting its feature routes via `lib.routes.ts`
  3. Adding a corresponding lazy-loaded route to the EDB app’s routing array as shown above

- **Remote/module-federated features (e.g., admin):**
  - Use `loadRemote` and expose `Routes` from remote builds

- **Wrapper and Auth:**
  - Use wrapper components (React/iframe) at route boundaries if integrating non-Angular UI
  - Secure all routes as needed with guards (e.g., `AuthGuard`)

---

## 2. UI Library (libs/shared/client/ui)

- **All reusable project UI must live here.**
- **ng-zorro components** (or wrappers/adapters) go in `libs/shared/client/ui/ng-zorro/`
- Export all ng-zorro integrations from the UI library’s main barrel so other libs “just” import from your UI lib, not ng-zorro directly

**To add a new shared UI component:**

```sh
nx g @nx/angular:component MyComponent --project=shared-client-ui
```

If using ng-zorro:

- Scaffold in `/ng-zorro` and then export from main `index.ts` or NgModule

---

## 3. Feature Library Guidelines

- **All features** live in:  
  `libs/client/edb/features/feature-edb-{feature}/`
- **Consistent structure (example):**
  ```
  feature-{name}/
  ├── README.md
  ├── project.json
  ├── tsconfig.json
  ├── tsconfig.lib.json
  ├── tsconfig.spec.json
  └── src/
      ├── index.ts
      ├── test-setup.ts
      └── lib/
          ├── components/
          ├── types/
          ├── feature-{name}.config.ts
          ├── feature-{name}.container.ts
          ├── lib.routes.ts
  ```

**To generate a new Angular feature lib:**

```sh
nx g @nx/angular:library --name=feature-xyz \
  --directory=libs/client/edb/features/feature-xyz \
  --standalone
```

- **All lazy-loaded routes** must be exported from `lib.routes.ts` as e.g. `featureMyfeatureRoutes`

---

## 4. Data-Access Library Guidelines

- **All feature-related data-access/queries:**  
  `libs/client/edb/data-access/edb-{domain}/src/lib/`

- **Structure per entity/domain:**
  ```
  {entity}/
    queries.ts  // TanStack Query hooks
    mutations.ts
    service.ts
    types.ts
  ```
- **Use only [TanStack Query](https://tanstack.com/query/latest/docs/framework/angular/overview) for all data fetching/mutations in new code**

**To generate new JS data-access lib:**

```sh
nx g @nx/js:library client-myfeature --directory=client/edb/data-access/{client-myfeature}
```

---

## 5. Adding a New Feature – Step-by-Step

1. **UI**:
   - Add or extend shared UI/NgZorro wrappers/components under `libs/shared/client/ui`
   - Export from main index/barrels

2. **Feature**:
   - Scaffold lib using Nx CLI above
   - Container/component code imports UI only from shared UI lib

3. **Data**:
   - Scaffold data-access lib using CLI above
   - All queries/mutations must use TanStack Query pattern

4. **Wire-up**:
   - Export routes from feature’s `lib.routes.ts`
   - Add lazy-loaded import to `app.routes.ts` as in the example
   - No direct imports from features in the app—**always** code split

5. **Documentation & Tests**:
   - Update READMEs per lib (UI/feature/data-access)
   - Add and co-locate relevant tests/specs

---

## 6. Rules & Best Practices

- **DO**: Always use shared UI lib and ng-zorro wrappers—never import ng-zorro directly in app/feature
- **DO**: ALL data fetching/mutations via TanStack Query in `data-access` libs
- **DO**: Lazy-load all feature routes via app route config
- **DON’T**: Bypass UI/data lib boundaries, or merge unrelated logic into core/app/feature layer
- **DO**: Use Nx CLI as above for all new libs/components for consistency

---

> Follow this doc exactly for any new feature, page, or upgrade to EDB platform.

### 🚨 Using `@if` and `@for` Instead of `*ngIf` / `*ngFor` (Angular 17+)

In this project, **always** use the new Angular control flow block syntax for conditional and list rendering:

---

#### ✅ Use `@if` for conditionals

```html
@if (condition) {
<div>Show this if true!</div>
}
```

#### ❌ Do NOT use deprecated `*ngIf`

```html
<!-- ❌ Deprecated -->
<div *ngIf="condition">Show this if true!</div>
```

---

#### ✅ Use `@for` for loops

```html
@for (let item of items; track item.id) {
<app-row [data]="item" />
}
```

#### ❌ Do NOT use deprecated `*ngFor`

```html
<!-- ❌ Deprecated -->
<div *ngFor="let item of items; trackBy: trackById">
  <app-row [data]="item" />
</div>
```

---

- Both `@if` and `@for` are part of Angular’s [built-in control flow](https://angular.dev/reference/templates/control-flow).
- All new features and refactored components **must use** these patterns.
- When updating or touching older components, convert from `*ngIf`/`*ngFor` to `@if`/`@for`.

> Consult the [official docs here](https://angular.dev/reference/templates/control-flow) for more info.

# Mobile Application + Libraries Contribution Guide (Nx Monorepo)

Every new feature, screen, or integration—by human or agent—must conform exactly to this modular architecture and use the correct, up-to-date Nx or Expo CLI commands for generation.

---

## 1. Folders & Structure (Copy + CLI Examples)

### 1.1 UI Primitives (`libs/shared/client/ui-rn/`)

- All foundational UI (Button, Box, Typography, Input, etc.) must live here.
- **To add a new primitive:**
  ```sh
  nx g @nx/expo:component MyPrimitive --project=shared-client-ui-rn
  # or use @nx/react-native:component if set up that way
  ```

### 1.2 Feature Libraries (`libs/client/edb-clara/features/feature-clara-{domain}/`)

- For a new mobile feature library (with React Native/Expo integration):
  ```sh
  nx g @nx/expo:library feature-clara-NEWFEATURE --directory=`client/edb-clara/features/{feature-clara-NEWFEATURE}`
  # or
  cp -r feature-clara-template feature-clara-NEWFEATURE
  ```
- Place modular, shareable UI in `src/lib/components/` using primitives from `ui-rn`.

### 1.3 Data Access Libraries (`libs/client/edb-clara/data-access/`)

- For new pure javascript/ts data-access library:
  ```sh
  nx g @nx/js:library client-clara-NEWDOMAIN --directory=`client/edb-clara/data-access/{client-clara-NEWDOMAIN}`
  ```
- Organize each resource as:
  ```
  {entity}/
    queries.ts
    mutations.ts
    service.ts
    types.ts
  ```

### 1.4 Real-Time/Voice Libraries (`libs/client/edb-clara/real-time/`)

- For a new real-time/voice shared logic library:
  ```sh
  nx g @nx/js:library new-realtime-feature --directory=client/edb-clara/real-time/src/lib
  ```
- Structure by domain under `client/`, `core/`, `hooks/`, `previews/`.

### 1.5 Mobile App (`apps/mobile/src/app/(tabs)/{domain}/(features)/`)

- Only compose screens/features from the primitives, feature, data-access, and real-time libs above.
- App containers should never reimplement primitives or fetch/data logic.

---

## 2. Adding a Feature: Step-by-Step

1. **UI Primitive needed?**
   - Use CLI as above or copy another primitive in `ui-rn/`.

2. **New feature logic or UI?**
   - Use the Expo CLI as above to generate a feature library, or copy a template.
   - All components in `/src/lib/components/`; import only from `ui-rn`.

3. **API/data hooks?**
   - Generate a data-access lib for the domain with `@nx/js:library` and organize by resource as shown.

4. **Real-time/voice logic?**
   - Use CLI to scaffold under `real-time`, or copy a sibling folder and refactor.

5. **App integration:**
   - Compose new features/screens in the mobile app, wiring together only from the libraries above.

6. **Documentation:**
   - Always update READMEs, describing new primitives, features, and data/real-time interface.

---

## 3. Dos and Don’ts

- **DO:** Use only the up-to-date CLI/copy examples shown above.
- **DO:** Keep primitives, features, data, and real-time logic clearly modular and in their libs.
- **DON'T:** Scatter implementation or use deprecated/outdated generator commands.
- **DO:** Maintain documentation at every layer.

---

> Following these conventions and commands ensures maintainability, composability, and clarity for your Nx/Expo-powered mobile application.

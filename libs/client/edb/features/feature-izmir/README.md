# feature-izmir

Voice-assisted ordering workspace for the Izmir pizza & kebab bar. This feature
library renders the cashier-facing dashboard, showcasing menu filters, a live
agent status panel, and the interactive catalog built with the shared
`@edb/shared-ui` ng-zorro wrappers.

## Development

- `nx lint feature-izmir` – run lint checks for the library.
- `nx test feature-izmir` – execute unit tests (none defined yet).

Routes are exported from `featureIzmirRoutes` so the EDB host app can lazy-load
the dashboard at `/izmir`.

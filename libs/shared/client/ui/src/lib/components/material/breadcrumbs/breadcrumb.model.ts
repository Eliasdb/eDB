/** A single crumb in a UI breadcrumb trail. */
export interface Breadcrumb {
  /** Text shown to the user. */
  label: string;
  /** Route to navigate to when clicked (optional). */
  route?: string;
}

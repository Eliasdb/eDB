export interface WorkbenchApiFeatureSchema {
  /**
   * Plural-ish name for this resource.
   * Controls:
   * - lib folder: feature-<name>
   * - route prefix: /<name>
   * - register<Name>Routes()
   */
  name: string;

  /**
   * Comma-separated list of fields:
   *   fieldName:type
   *
   * Supported types:
   *   string
   *   number
   *   boolean
   *   date
   *   enum(a|b|c)
   *
   * Example:
   *   "title:string,status:enum(active|archived),priority:number,dueAt:date"
   */
  fields: string;
}

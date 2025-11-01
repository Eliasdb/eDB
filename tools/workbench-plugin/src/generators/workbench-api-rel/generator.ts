import { Tree } from '@nx/devkit';
import createFlow from './create';
import revertFlow from './revert';
import type { Schema } from './utils';
import { deriveNames } from './utils';

export default async function generator(tree: Tree, schema: Schema) {
  if (!schema.belongsTo?.trim())
    throw new Error('--belongsTo is required (child:parent)');
  const nameset = deriveNames(schema.belongsTo);

  if (schema.revert) {
    return revertFlow(tree, schema, nameset);
  } else {
    return createFlow(tree, schema, nameset);
  }
}

import devkit from '@nx/devkit';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

const { readWorkspaceConfig, runCommand } = devkit;

// Read the Nx workspace configuration
const workspaceConfig = JSON.parse(readFileSync('nx.json', 'utf-8'));

// Loop through all projects in the workspace
Object.keys(workspaceConfig.projects).forEach((projectName) => {
  console.log(`Running migrations for project: ${projectName}`);
  execSync(
    `pnpm nx generate @angular/core:signal-inputs-migration --project=${projectName}`,
    { stdio: 'inherit' },
  );
  execSync(
    `pnpm nx generate @angular/core:outputs-migration --project=${projectName}`,
    { stdio: 'inherit' },
  );
});

// I get a bug in dev env when I remove this...
(window as typeof window & { ngDevMode?: boolean }).ngDevMode = true;

import('./bootstrap');

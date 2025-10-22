import { DownloadOutline } from '@ant-design/icons-angular/icons';
import { applicationConfig } from '@storybook/angular';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { NZ_ICONS } from 'ng-zorro-antd/icon';

import '@carbon/styles/css/styles.css'; // Carbon layer
import '../src/lib/styles/main.css'; // ✅ correct path

export const decorators: any[] = [
  applicationConfig({
    providers: [
      { provide: NZ_I18N, useValue: en_US }, // Default locale
      { provide: NZ_ICONS, useValue: [DownloadOutline] },
    ],
  }),
];

export const tags = ['autodocs'];

import { Section, TwoCol } from '@edb/shared-ui-rn';
import { CompanyDetailsList } from '../company-details-list';
import CompanyQuickStats from '../company-quick-stats/company-quick-stats';

import type { CompanyOverview } from '@data-access/crm/companies/types';
import { companyDetailsConfig } from './company-snapshot-collection.config';

export type SnapshotCollectionProps = {
  data?: CompanyOverview;
  loading?: boolean;
};

export function SnapshotCollection({ data, loading }: SnapshotCollectionProps) {
  return (
    <TwoCol
      columns={2}
      gap={16}
      stackGap={16}
      breakpoint={1024}
      widths={[0.44, 0.56]}
    >
      {/* Left column: Quick stats in a section */}
      <Section title="Quick stats" titleGap={14} flushTop>
        <CompanyQuickStats data={data} loading={loading} />
      </Section>

      {/* Right column */}
      <Section title="Company" titleGap={14} flushTop>
        <CompanyDetailsList
          data={data}
          loading={loading}
          config={companyDetailsConfig}
        />
      </Section>
    </TwoCol>
  );
}

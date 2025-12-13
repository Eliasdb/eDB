import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ExpandedDataConfig } from '../../models/table.model';
import { TableUtilsService } from './table-utils.service';

// Mock TableHeaderItem and TableItem
vi.mock('carbon-components-angular', () => ({
  TableHeaderItem: vi.fn((init: unknown) => init), // Mock returns the input directly
  TableItem: vi.fn((init: unknown) => init), // Same for TableItem
}));

// Import the mocked classes
import { TableHeaderItem, TableItem } from 'carbon-components-angular';

describe('TableUtilsService - createExpandedData', () => {
  let service: TableUtilsService;

  beforeEach(() => {
    service = new TableUtilsService();
  });

  it('should create expanded data rows with headers and expanded data', () => {
    const items = [
      { id: 1, name: 'Alice', details: 'Extra Data 1' },
      { id: 2, name: 'Bob', details: 'Extra Data 2' },
    ];

    const config: ExpandedDataConfig<{ id: number; name: string; details: string }> = {
      headers: [
        new TableHeaderItem({ data: 'Name' }),
        new TableHeaderItem({ data: 'Details' }),
      ],
      rowMapper: (item) => [
        new TableItem({ data: item.name }),
        new TableItem({ data: item.details }),
      ],
      expandedDataMapper: (item) => [
        [
          new TableItem({ data: `Expanded: ${item.details}` }),
          new TableItem({ data: `Extra Info for ${item.name}` }),
        ],
      ],
    };

    const result = service.createExpandedData(items, config);

    expect(result).toEqual([
      [
        {
          data: 'Alice',
          expandedData: [
            [
              { data: 'Expanded: Extra Data 1' },
              { data: 'Extra Info for Alice' },
            ],
          ],
          expandAsTable: true,
        },
        { data: 'Extra Data 1' },
      ],
      [
        {
          data: 'Bob',
          expandedData: [
            [
              { data: 'Expanded: Extra Data 2' },
              { data: 'Extra Info for Bob' },
            ],
          ],
          expandAsTable: true,
        },
        { data: 'Extra Data 2' },
      ],
    ]);
  });

  it('should handle missing expandedDataMapper', () => {
    const items = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];

    const config: ExpandedDataConfig<{ id: number; name: string }> = {
      headers: [new TableHeaderItem({ data: 'Name' })],
      rowMapper: (item) => [new TableItem({ data: item.name })],
    };

    const result = service.createExpandedData(items, config);

    expect(result).toEqual([[{ data: 'Alice' }], [{ data: 'Bob' }]]);
  });
});

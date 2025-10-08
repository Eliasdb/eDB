// apps/mobile/src/lib/ui/primitives/List.tsx
import { View } from 'react-native';

type ListProps = {
  inset?: boolean;
  children: React.ReactNode;
  className?: string;
};
export function List({ inset, children, className }: ListProps) {
  return (
    <View
      className={
        inset
          ? `rounded-xl overflow-hidden bg-surface dark:bg-surface-dark border border-border dark:border-border-dark ${className ?? ''}`
          : `rounded-xl overflow-hidden ${className ?? ''}`
      }
    >
      {children}
    </View>
  );
}

type ItemProps = {
  children: React.ReactNode;
  first?: boolean;
  className?: string;
};
List.Item = function Item({ children, first, className }: ItemProps) {
  return (
    <View
      className={`${first ? '' : 'border-t border-border dark:border-border-dark'} ${className ?? ''}`}
    >
      {children}
    </View>
  );
};

// Optional convenience for placeholders
type PlaceholderProps = {
  rows: number;
  renderRow: (index: number) => React.ReactNode;
};
List.Placeholder = function Placeholder({ rows, renderRow }: PlaceholderProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <List.Item key={i} first={i === 0}>
          {/* prevent interactions while loading */}
          <View pointerEvents="none">{renderRow(i)}</View>
        </List.Item>
      ))}
    </>
  );
};

// apps/mobile/src/lib/ui/primitives/List.tsx
import { View } from 'react-native';

type ListProps = {
  inset?: boolean; // adds rounded bg + border (Card-like)
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
  first?: boolean; // if you need to suppress top border for the first row
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

// @ui/primitives/lists/list-row.tsx
import { ReactNode } from 'react';
import { View, ViewProps } from 'react-native';

export type ListRowProps = ViewProps & {
  left?: ReactNode;
  body?: ReactNode;
  right?: ReactNode;
  compact?: boolean; // tighter padding for dense lists
  showDividerTop?: boolean;

  /** New: make left slot inline (no fixed column) to match Panel/Accordion spacing */
  leftInline?: boolean; // default false (keeps old 32px column)
  /** New: gap between left & body when leftInline=true (px) */
  leftGap?: number; // default 12
};

export function ListRow({
  left,
  body,
  right,
  compact,
  showDividerTop,
  className,
  style,
  leftInline = false,
  leftGap = 12,
  ...rest
}: ListRowProps) {
  const padClass = compact ? 'px-3 py-2' : 'px-4 py-3';
  const dividerClass = showDividerTop
    ? 'border-t border-border dark:border-border-dark'
    : '';

  return (
    <View
      className={[
        'flex-row items-center',
        padClass,
        dividerClass,
        className ?? '',
      ].join(' ')}
      style={style}
      {...rest}
    >
      {/* left */}
      {left ? (
        leftInline ? (
          <View style={{ marginRight: leftGap, alignItems: 'center' }}>
            {left}
          </View>
        ) : (
          <View style={{ width: 32, alignItems: 'center' }}>{left}</View>
        )
      ) : (
        // keep layout stable if no left (inline or fixed)
        <View style={leftInline ? { width: 0 } : { width: 32 }} />
      )}

      {/* body */}
      <View style={{ flex: 1, paddingRight: 8 }}>{body}</View>

      {/* right */}
      <View className="flex-row items-center gap-2">{right}</View>
    </View>
  );
}

export default ListRow;

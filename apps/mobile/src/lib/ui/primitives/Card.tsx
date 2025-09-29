import { View, ViewProps } from 'react-native';
import { cn } from '../utils/cn';

export function Card(props: ViewProps & { inset?: boolean }) {
  const { style, inset, ...rest } = props;
  return (
    <View
      className={cn(
        'bg-white dark:bg-surface-dark rounded-lg shadow-card',
        inset ? 'p-md' : 'p-0',
      )}
      style={style}
      {...rest}
    />
  );
}

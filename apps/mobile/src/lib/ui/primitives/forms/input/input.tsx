import { TextInput, TextInputProps } from 'react-native';

export type InputProps = TextInputProps & {
  className?: string;
};

export function Input({ className, ...props }: InputProps) {
  return (
    <TextInput
      {...props}
      className={[
        // light/dark token-friendly defaults
        'bg-muted dark:bg-muted-dark',
        'rounded-xl px-3 py-3 text-[16px]',
        'text-text dark:text-text-dark',
        'border border-border dark:border-border-dark',
        className || '',
      ].join(' ')}
      placeholderTextColor={props.placeholderTextColor ?? '#98a2b3'}
    />
  );
}

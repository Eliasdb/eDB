import { Ionicons } from '@expo/vector-icons';
import { ComponentProps, ReactNode, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

/** A soft card-like container that stands out on light, stays matte on dark. */
type PanelProps = {
  children: ReactNode;
  className?: string;
  frameless?: boolean; // <- new prop
};

export function Panel({ children, className, frameless }: PanelProps) {
  // shared shape
  const baseClasses = ['rounded-2xl overflow-hidden', className ?? ''];

  // normal panel styling
  const styledClasses = [
    'bg-surface-2/90 dark:bg-surface-dark/95',
    'backdrop-blur-sm',
    'border border-border/60 dark:border-border-dark',
    Platform.OS !== 'android'
      ? 'shadow-[0_1px_8px_rgba(0,0,0,0.05)] dark:shadow-none'
      : '',
  ];

  return (
    <View
      className={[...baseClasses, ...(frameless ? [] : styledClasses)].join(
        ' ',
      )}
    >
      {children}
    </View>
  );
}

/** A grouped list wrapper (the “inner box” with its own subtle background). */
export function Group({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <View
      className={[
        'rounded-xl overflow-hidden',
        'bg-surface-2/70 dark:bg-transparent',
        'border border-border/60 dark:border-border-dark',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </View>
  );
}

/** Small title + helper used at the top of panels. */
export function SectionHeader({
  title,
  subtitle = 'Manage and configure related options.',
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View className="px-4 pt-4 pb-3">
      <Text className="text-[16px] font-extrabold text-text dark:text-text-dark">
        {title}
      </Text>
      <Text className="text-[12px] mt-1 text-text-dim dark:text-text-dimDark">
        {subtitle}
      </Text>
    </View>
  );
}

/** Reusable accordion row (header only; you control children below). */
export function AccordionRow({
  title,
  icon,
  open,
  onToggle,
}: {
  title: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      onPress={onToggle}
      className="
        px-3 py-3 flex-row items-center justify-between active:opacity-95
        bg-surface-2/60 dark:bg-transparent
      "
    >
      <View className="flex-row items-center gap-3">
        <Ionicons
          name={icon}
          size={20}
          className="text-text dark:text-text-dark"
        />
        <Text className="text-[16px] font-normal text-text dark:text-text-dark">
          {title}
        </Text>
      </View>
      <Ionicons
        name={open ? 'chevron-up' : 'chevron-down'}
        size={18}
        className="text-text dark:text-text-dark"
      />
    </Pressable>
  );
}

/** Convenience component that manages its own open state. */
export function AccordionSection({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <View>
      <AccordionRow
        title={title}
        icon={icon}
        open={open}
        onToggle={() => setOpen((v) => !v)}
      />
      {open ? <View className="px-3 pb-3">{children}</View> : null}
    </View>
  );
}

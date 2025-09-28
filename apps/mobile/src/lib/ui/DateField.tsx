import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useRef } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

// Native (iOS/Android)
let RNDateTimePicker: any;
try {
  RNDateTimePicker = require('@react-native-community/datetimepicker').default;
} catch {}

type Props = {
  value?: string; // "YYYY-MM-DD"
  onChange: (next?: string) => void;
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  label?: string;
};

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function fromISO(v?: string) {
  if (!v) return undefined;
  const [y, m, d] = v.split('-').map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

export default function DateField({
  value,
  onChange,
  placeholder = 'YYYY-MM-DD',
  minimumDate,
  maximumDate,
  label,
}: Props) {
  const dateObj = useMemo(() => fromISO(value) ?? new Date(), [value]);

  // Web support check (once)
  const webInputRef = useRef<HTMLInputElement | null>(null);
  const dateSupported = useMemo(() => {
    if (Platform.OS !== 'web') return false;
    const i = document.createElement('input');
    i.setAttribute('type', 'date');
    return i.type === 'date';
  }, []);

  return (
    <View>
      {label ? (
        <Text className="text-[13px] mb-1 text-text-dim dark:text-text-dimDark">
          {label}
        </Text>
      ) : null}

      <View className="relative">
        {/* Pretty field UI */}
        <Pressable
          onPress={() => {
            if (Platform.OS === 'web') {
              webInputRef.current?.focus();
              webInputRef.current?.click();
            }
          }}
          className="flex-row items-center rounded-lg px-3 h-10
                     bg-muted dark:bg-muted-dark
                     border border-border dark:border-border-dark"
        >
          <Ionicons name="time-outline" size={16} color="#64748b" />
          <Text
            className={`ml-2 text-[16px] ${
              value
                ? 'text-text dark:text-text-dark'
                : 'text-text-dim dark:text-text-dimDark'
            }`}
          >
            {value || placeholder}
          </Text>
        </Pressable>

        {/* Web: real <input type="date"> overlay for click/focus */}
        {Platform.OS === 'web' && (
          <input
            ref={webInputRef as any}
            type={dateSupported ? 'date' : 'text'}
            placeholder={placeholder}
            value={value ?? ''}
            min={minimumDate ? toISODate(minimumDate) : undefined}
            max={maximumDate ? toISODate(maximumDate) : undefined}
            pattern="\d{4}-\d{2}-\d{2}"
            onChange={(e) => {
              const v = e.currentTarget.value || undefined;
              onChange(v);
            }}
            // Layer it on top but invisible
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0,
              cursor: 'pointer',
              // ensure it can receive clicks
              pointerEvents: 'auto',
            }}
          />
        )}
      </View>

      {/* Native picker on iOS/Android */}
      {Platform.OS !== 'web' && RNDateTimePicker ? (
        <View className="mt-2">
          <RNDateTimePicker
            mode="date"
            display={Platform.OS === 'android' ? 'calendar' : 'inline'}
            value={dateObj}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            onChange={(_e: any, selected?: Date) => {
              if (!selected) return;
              onChange(toISODate(selected));
            }}
          />
        </View>
      ) : null}
    </View>
  );
}

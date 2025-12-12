// apps/mobile/src/lib/ui/widgets/DateField.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useRef, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

// Lazy require so web bundles don't pull the native module
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

export function DateField({
  value,
  onChange,
  placeholder = 'YYYY-MM-DD',
  minimumDate,
  maximumDate,
  label,
}: Props) {
  const [showNative, setShowNative] = useState(false); // 🔑 only show when tapped
  const dateObj = useMemo(() => fromISO(value) ?? new Date(), [value]);

  // Web support check (once)
  const webInputRef = useRef<HTMLInputElement | null>(null);
  const dateSupported = useMemo(() => {
    if (Platform.OS !== 'web') return false;
    const i = document.createElement('input');
    i.setAttribute('type', 'date');
    return i.type === 'date';
  }, []);

  const openPicker = () => {
    if (Platform.OS === 'web') {
      webInputRef.current?.focus();
      webInputRef.current?.click();
    } else {
      setShowNative(true);
    }
  };

  const handleNativeChange = (e: any, selected?: Date) => {
    // Android fires onChange for both selection and dismiss
    if (Platform.OS === 'android') setShowNative(false);

    if (!selected) {
      // dismissed: e.type === 'dismissed' on Android
      return;
    }
    onChange(toISODate(selected));
  };

  return (
    <View>
      {label ? (
        <Text className="text-[13px] mb-1 text-text-dim dark:text-text-dimDark">
          {label}
        </Text>
      ) : null}

      {/* Display field */}
      <Pressable
        onPress={openPicker}
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

      {/* Web overlay input */}
      {Platform.OS === 'web' && (
        <input
          ref={webInputRef as any}
          type={dateSupported ? 'date' : 'text'}
          placeholder={placeholder}
          value={value ?? ''}
          min={minimumDate ? toISODate(minimumDate) : undefined}
          max={maximumDate ? toISODate(maximumDate) : undefined}
          pattern="\d{4}-\d{2}-\d{2}"
          onChange={(e) => onChange(e.currentTarget.value || undefined)}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            cursor: 'pointer',
            pointerEvents: 'auto',
          }}
        />
      )}

      {/* Native picker: **conditional** */}
      {Platform.OS !== 'web' && RNDateTimePicker && showNative && (
        <RNDateTimePicker
          mode="date"
          // iOS can be inline if you prefer:
          display={Platform.OS === 'android' ? 'calendar' : 'inline'}
          value={dateObj}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onChange={handleNativeChange}
          // Optional niceties on Android:
          // neutralButtonLabel="Clear"
          // onChange={(e, d) => { if (e.type === 'neutralButtonPressed') onChange(undefined); else handleNativeChange(e, d); }}
        />
      )}
    </View>
  );
}

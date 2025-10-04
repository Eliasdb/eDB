import { StyleSheet, View } from 'react-native';

export function Divider() {
  return (
    <View
      className="bg-border dark:bg-border-dark"
      style={{ height: StyleSheet.hairlineWidth }}
    />
  );
}

import {
  ActionSheetIOS,
  Alert,
  Platform,
  type AlertButton, // 👈 import the type
} from 'react-native';

export type MenuAction = {
  label: string;
  key: string;
  destructive?: boolean;
};

export function showContextMenu(
  title: string,
  actions: MenuAction[],
  onSelect: (key: string) => void,
) {
  if (Platform.OS === 'ios') {
    const opts = actions.map((a) => a.label);
    const destructiveIndex = actions.findIndex((a) => a.destructive);
    const cancelIndex = actions.length; // add trailing cancel
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title,
        options: [...opts, 'Cancel'],
        destructiveButtonIndex:
          destructiveIndex >= 0 ? destructiveIndex : undefined,
        cancelButtonIndex: cancelIndex,
      },
      (index) => {
        if (index === cancelIndex || index < 0) return;
        onSelect(actions[index].key);
      },
    );
  } else {
    // Android fallback
    const buttons: AlertButton[] = [
      ...actions.map(
        (a): AlertButton => ({
          text: a.label,
          style: a.destructive
            ? ('destructive' as const)
            : ('default' as const),
          onPress: () => onSelect(a.key),
        }),
      ),
      { text: 'Cancel', style: 'cancel' as const },
    ];

    Alert.alert(title, undefined, buttons, { cancelable: true });
  }
}

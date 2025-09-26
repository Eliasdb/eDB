import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PersonalDetailsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // demo state (replace with real user data)
  const [firstName, setFirstName] = useState('Elias');
  const [lastName, setLastName] = useState('De Bock');
  const [email, setEmail] = useState('elias@example.com');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('Clara Labs');
  const [role, setRole] = useState('Founder');
  const [notes, setNotes] = useState('');

  const onSave = () => {
    // TODO: Persist to your backend / CRM
    // Validate, then:
    router.back();
  };

  return (
    <View style={styles.root}>
      {/* Safe-area aware header, consistent with app */}
      <View style={{ paddingTop: insets.top, backgroundColor: '#fff' }}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="chevron-back" size={24} color="#111" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Personal details</Text>

          <TouchableOpacity onPress={onSave} style={styles.headerBtn}>
            <Text style={styles.headerAction}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.screen}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 24 + insets.bottom,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Identity */}
          <Card title="Identity">
            <Field label="First name">
              <Input
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First name"
              />
            </Field>
            <Field label="Last name">
              <Input
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last name"
              />
            </Field>
            <Field label="Email">
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder="you@company.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </Field>
            <Field label="Phone">
              <Input
                value={phone}
                onChangeText={setPhone}
                placeholder="+32 ..."
                keyboardType="phone-pad"
              />
            </Field>
          </Card>

          {/* Work */}
          <Card title="Work">
            <Field label="Company">
              <Input
                value={company}
                onChangeText={setCompany}
                placeholder="Company"
              />
            </Field>
            <Field label="Role / Title">
              <Input value={role} onChangeText={setRole} placeholder="Role" />
            </Field>
          </Card>

          {/* Notes */}
          <Card title="Notes">
            <View style={{ gap: 6 }}>
              <Text style={styles.fieldLabel}>Private notes</Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Anything Clara should know…"
                multiline
                style={[
                  styles.input,
                  { height: 120, textAlignVertical: 'top' },
                ]}
              />
            </View>
          </Card>

          {/* Bottom save bar (nice on long forms) */}
          <View style={styles.saveBarSpacer} />
        </ScrollView>

        <View
          style={[
            styles.saveBar,
            { paddingBottom: Math.max(10, insets.bottom) },
          ]}
        >
          <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
            <Ionicons name="save-outline" size={18} color="#fff" />
            <Text style={styles.saveBtnText}>Save changes</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

/* ---------- Little building blocks ---------- */

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={{ gap: 14 }}>{children}</View>
    </View>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

function Input(props: React.ComponentProps<typeof TextInput>) {
  return <TextInput {...props} style={[styles.input, props.style]} />;
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f6f7fb' },

  /* Header */
  headerRow: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerBtn: {
    height: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#111' },
  headerAction: { fontSize: 16, fontWeight: '600', color: '#6C63FF' },

  /* Screen/container */
  screen: { flex: 1 },

  /* Card */
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
  },

  /* Field + input */
  fieldLabel: { fontSize: 14, fontWeight: '600', color: '#444' },
  input: {
    backgroundColor: '#f2f3f7',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111',
    borderWidth: 1,
    borderColor: '#ececf2',
  },

  /* Save bar */
  saveBarSpacer: { height: 64 }, // reserve space so last inputs aren't hidden by save bar
  saveBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e8e8ef',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  saveBtn: {
    height: 44,
    borderRadius: 12,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

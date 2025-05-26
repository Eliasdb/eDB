// Components
import { Contact } from 'lucide-react';
import { EditableProfileRow } from '../../components/editable-profile-row';

// Services
import { ChangeEvent, useEffect, useState } from 'react';
import { getToken, updateUserInfo } from '../../services/user-service';

// Types
import { UserInfo } from '../../types/types';
type Props = { userInfo?: UserInfo | null };

export function PersonalInfoView({ userInfo }: Props) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    displayName: '',
  });
  const [initial, setInitial] = useState(formData);
  const [editing, setEditing] = useState<keyof typeof formData | null>(null);

  useEffect(() => {
    if (!userInfo) return;
    const filled = {
      firstName: userInfo.given_name || '',
      lastName: userInfo.family_name || '',
      username: userInfo.preferred_username || '',
      email: userInfo.email || '',
      displayName: userInfo.preferred_username || '',
    };
    setFormData(filled);
    setInitial(filled);
  }, [userInfo]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function submit(field: keyof typeof formData) {
    const token = await getToken();
    if (!token) return alert('No access token');
    if (formData[field] === initial[field]) {
      setEditing(null);
      return;
    }
    try {
      const res = await updateUserInfo(formData, token);
      alert(res.message);
      setInitial(formData);
      setEditing(null);
    } catch (e: any) {
      alert(e.message || 'Failed');
    }
  }

  // Define editable fields + dynamic label fallback
  const fields: { key: keyof typeof formData; defaultLabel: string }[] = [
    { key: 'firstName', defaultLabel: 'Name' },
    { key: 'username', defaultLabel: 'Username' },
    { key: 'email', defaultLabel: 'Email address' },
    { key: 'displayName', defaultLabel: 'Display name' },
  ];

  return (
    <section>
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-base font-medium flex items-center gap-2">
          <Contact className="w-5 h-5" />
          Personal information
        </h2>
      </div>
      <section className="text-sm bg-white space-y-6">
        {fields.map(({ key, defaultLabel }) => {
          const isName = key === 'firstName';
          const isEditingRow = editing === key;
          const primaryValue = isName
            ? `${formData.firstName} ${formData.lastName}`.trim()
            : formData[key];
          const secondaryValue = isName ? formData.lastName : undefined;
          const isUnchanged = formData[key] === initial[key];
          const label =
            userInfo?.[`label_${key}` as keyof UserInfo]?.toString() ||
            defaultLabel;

          return (
            <EditableProfileRow
              key={key}
              label={label}
              fieldKey={key}
              value={primaryValue}
              secondaryValue={secondaryValue}
              isEditing={isEditingRow}
              onEdit={() => setEditing(key)}
              onCancel={() => {
                setFormData(initial);
                setEditing(null);
              }}
              onSave={() => submit(key)}
              onChange={handleChange}
              isDisabled={isUnchanged}
            />
          );
        })}
      </section>
    </section>
  );
}

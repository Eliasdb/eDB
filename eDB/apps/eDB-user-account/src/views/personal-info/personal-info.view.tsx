// Components
import { Building2, Contact } from 'lucide-react';
import { EditableProfileRow } from '../../components/editable-profile-row';

// Services
import { ChangeEvent, useEffect, useState } from 'react';
import {
  getToken,
  updateCustomAttributes,
  updateUserInfo,
} from '../../services/user-service';

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

  const [companyInfo, setCompanyInfo] = useState({
    jobTitle: '',
    company: '',
    industry: '',
  });
  const [initialCompanyInfo, setInitialCompanyInfo] = useState(companyInfo);
  const [editingCompanyField, setEditingCompanyField] = useState<
    keyof typeof companyInfo | null
  >(null);

  useEffect(() => {
    if (!userInfo) return;
    const filled = {
      jobTitle: userInfo.attributes?.jobTitle || '',
      company: userInfo.attributes?.company || '',
      industry: userInfo.attributes?.industry || '',
    };
    setCompanyInfo(filled);
    setInitialCompanyInfo(filled);
    console.log('userInfo passed to PersonalInfoView:', userInfo);
  }, [userInfo]);

  function handleCompanyChange(e: ChangeEvent<HTMLInputElement>) {
    setCompanyInfo((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function submitCompany(field: keyof typeof companyInfo) {
    const token = await getToken();
    if (!token) return alert('No access token');
    if (companyInfo[field] === initialCompanyInfo[field]) {
      setEditingCompanyField(null);
      return;
    }

    try {
      const res = await updateCustomAttributes(
        { attributes: { [field]: companyInfo[field] } },
        token,
      );
      alert(res.message);
      setInitialCompanyInfo(companyInfo);
      setEditingCompanyField(null);
    } catch (e: any) {
      alert(e.message || 'Failed to update');
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
      <section>
        <h1 className="text-xl mb-8">Personal information</h1>
      </section>
      <section className="mb-16">
        <div className="flex items-center justify-between pb-2 ">
          <h2 className="text-lg font-normal flex items-center gap-2">
            <Contact className="w-5 h-5" />
            Personal Information
          </h2>
        </div>
        <section className="text-sm bg-white space-y-6">
          {fields.map(({ key, defaultLabel }) => {
            const isName = key === 'firstName';
            const isEditingRow = editing === key;
            const primaryValue = formData[key]; // always just the field itself
            const secondaryValue = isName ? formData.lastName : undefined;
            const displayValue =
              key === 'firstName'
                ? `${formData.firstName} ${formData.lastName}`.trim()
                : formData[key];

            const isUnchanged = formData[key] === initial[key];
            const label =
              userInfo?.[`label_${key}` as keyof UserInfo]?.toString() ||
              defaultLabel;

            return (
              <EditableProfileRow
                key={key}
                label={label}
                fieldKey={key}
                value={isEditingRow ? primaryValue : displayValue}
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

      <section>
        <div className="flex items-center justify-between pb-2 ">
          <h2 className="text-lg font-normal flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Company
          </h2>
        </div>
        <section className="text-sm bg-white space-y-6">
          {(['jobTitle', 'company', 'industry'] as const).map((key) => {
            const label = key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, (c) => c.toUpperCase());

            // New: guard against undefined or blank
            const value = companyInfo[key] ?? '';
            const showValue = value.trim() !== '' ? value : undefined;
            console.log(value);

            return (
              <EditableProfileRow
                key={key}
                label={label}
                fieldKey={key}
                value={showValue || ''}
                isEditing={editingCompanyField === key}
                onEdit={() => setEditingCompanyField(key)}
                onCancel={() => {
                  setCompanyInfo(initialCompanyInfo);
                  setEditingCompanyField(null);
                }}
                onSave={() => submitCompany(key)}
                onChange={handleCompanyChange}
                isDisabled={companyInfo[key] === initialCompanyInfo[key]}
              />
            );
          })}
        </section>
      </section>
    </section>
  );
}

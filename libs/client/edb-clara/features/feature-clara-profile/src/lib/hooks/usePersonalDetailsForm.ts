// apps/mobile/src/features/profile/hooks/usePersonalDetailsForm.ts
import { useMemo, useState } from 'react';
import { INITIAL_PERSONAL_DETAILS, makePersonalDetailsCards } from '../config';
import type { CardDef } from '../types/profile-details.types';
import type { TFunction } from 'i18next';

export function usePersonalDetailsForm(t: TFunction<'translation'>) {
  const [firstName, setFirstName] = useState(
    INITIAL_PERSONAL_DETAILS.firstName,
  );
  const [lastName, setLastName] = useState(INITIAL_PERSONAL_DETAILS.lastName);
  const [email, setEmail] = useState(INITIAL_PERSONAL_DETAILS.email);
  const [phone, setPhone] = useState(INITIAL_PERSONAL_DETAILS.phone);
  const [company, setCompany] = useState(INITIAL_PERSONAL_DETAILS.company);
  const [role, setRole] = useState(INITIAL_PERSONAL_DETAILS.role);
  const [notes, setNotes] = useState(INITIAL_PERSONAL_DETAILS.notes);

  const dirty =
    firstName !== INITIAL_PERSONAL_DETAILS.firstName ||
    lastName !== INITIAL_PERSONAL_DETAILS.lastName ||
    email !== INITIAL_PERSONAL_DETAILS.email ||
    phone !== INITIAL_PERSONAL_DETAILS.phone ||
    company !== INITIAL_PERSONAL_DETAILS.company ||
    role !== INITIAL_PERSONAL_DETAILS.role ||
    notes !== INITIAL_PERSONAL_DETAILS.notes;

  // cards stay derived from state, but hook owns it
  const cards: CardDef[] = useMemo(
    () =>
      makePersonalDetailsCards({
        t,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        email,
        setEmail,
        phone,
        setPhone,
        company,
        setCompany,
        role,
        setRole,
        notes,
        setNotes,
      }),
    [t, firstName, lastName, email, phone, company, role, notes],
  );

  return {
    state: { firstName, lastName, email, phone, company, role, notes },
    setters: {
      setFirstName,
      setLastName,
      setEmail,
      setPhone,
      setCompany,
      setRole,
      setNotes,
    },
    cards,
    dirty,
  };
}

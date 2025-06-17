'use client';

import { Pencil } from 'lucide-react';
import * as React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

type EditableProfileRowProps = {
  label: string;
  fieldKey: string;
  value: string;
  secondaryValue?: string;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
};

export function EditableProfileRow({
  label,
  fieldKey,
  value,
  secondaryValue,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  onChange,
  isDisabled,
}: EditableProfileRowProps) {
  const isName = fieldKey === 'firstName';

  const inputSection = isName ? (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex flex-col gap-1">
        <Label htmlFor="firstName">First name</Label>
        <Input
          id="firstName"
          name="firstName"
          type="text"
          placeholder="First name"
          value={value}
          onChange={onChange}
          className="w-full text-base h-10 md:max-w-xs"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="lastName">Last name</Label>
        <Input
          id="lastName"
          name="lastName"
          type="text"
          placeholder="Last name"
          value={secondaryValue}
          onChange={onChange}
          className="w-full text-base h-10 md:max-w-xs"
        />
      </div>
    </div>
  ) : (
    <Input
      id={fieldKey}
      name={fieldKey}
      type={fieldKey === 'email' ? 'email' : 'text'}
      placeholder={`Enter ${label.toLowerCase()}`}
      value={value}
      onChange={onChange}
      className="w-full text-base h-10 md:max-w-xs"
    />
  );

  return (
    <div
      className={`
        border-t pt-4
        grid 
        grid-cols-1
        md:grid-cols-[1fr_2fr_1fr]
        ${isEditing ? 'md:items-start' : 'md:items-center'}
      `}
    >
      <div className="flex justify-between items-center md:justify-start md:col-start-1 md:col-end-2">
        <span className="font-normal">{label}</span>
        <div className="md:hidden w-[72px] flex justify-end">
          <Button
            size="sm"
            variant="ghost"
            className={`text-sm font-normal transition-opacity duration-150 ${
              isEditing ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            onClick={onEdit}
          >
            Edit <Pencil className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      <div className="md:col-start-2 md:col-end-3 flex flex-col gap-2">
        {isEditing ? (
          <>
            <span className="text-sm font-normal text-muted-foreground">
              Update your {label.toLowerCase()}
            </span>
            {inputSection}
          </>
        ) : (
          <div className="flex items-center gap-2">
            <span>
              {value || <span className="text-muted-foreground">Not set</span>}
            </span>
            {fieldKey === 'email' && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: '#f1f6fd',
                  color: '#2a5bd7',
                  fontWeight: 500,
                }}
              >
                Primary
              </span>
            )}
          </div>
        )}
      </div>

      <div className="md:col-start-3 md:col-end-4 text-right flex flex-col items-end gap-2 ">
        <div className="hidden md:block relative">
          {!isEditing && (
            <Button
              size="sm"
              variant="ghost"
              className="text-sm font-normal absolute top-1/2 right-0 -translate-y-1/2"
              onClick={onEdit}
            >
              Edit <Pencil className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>

        {isEditing && (
          <div className="w-full flex flex-col md:flex-row md:justify-end gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="w-full md:w-auto"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="w-full md:w-auto"
              onClick={onSave}
              disabled={isDisabled}
            >
              Update
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

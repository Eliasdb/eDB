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

  return (
    <div className="border-t pt-6 pb-6 grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] md:items-start gap-y-4">
      {/* Label */}
      <div className="flex justify-between md:justify-start md:items-start">
        <span className="font-medium text-sm text-muted-foreground">
          {label}
        </span>
        {!isEditing && (
          <Button
            size="sm"
            variant="ghost"
            className="text-sm font-normal md:hidden"
            onClick={onEdit}
          >
            Edit <Pencil className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>

      {/* Input or Value */}
      <div className="flex flex-col gap-2">
        {isEditing ? (
          isName ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="First name"
                  value={value}
                  onChange={onChange}
                  className="h-10 text-base"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Last name"
                  value={secondaryValue}
                  onChange={onChange}
                  className="h-10 text-base"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <Label htmlFor={fieldKey}>{label}</Label>
              <Input
                id={fieldKey}
                name={fieldKey}
                type={fieldKey === 'email' ? 'email' : 'text'}
                placeholder={`Enter ${label.toLowerCase()}`}
                value={value}
                onChange={onChange}
                className="h-10 text-base"
              />
            </div>
          )
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <span>
              {value || <span className="text-muted-foreground">Not set</span>}
            </span>
            {fieldKey === 'email' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                Primary
              </span>
            )}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col items-end gap-2">
        {!isEditing && (
          <Button
            size="sm"
            variant="ghost"
            className="hidden md:inline-flex text-sm font-normal"
            onClick={onEdit}
          >
            Edit <Pencil className="w-4 h-4 ml-1" />
          </Button>
        )}

        {isEditing && (
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
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

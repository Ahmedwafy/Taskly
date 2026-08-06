'use client';
import { useState } from 'react';

// Editable Description Textarea — same idea
interface EditableDescriptionProps {
  initialValue: string;
  isSaving: boolean;
  onBlurCommit: (value: string) => void;
  className: string;
  rows: number;
}
const EditableDescriptionTextarea = ({
  initialValue,
  isSaving,
  onBlurCommit,
  className,
  rows,
}: EditableDescriptionProps) => {
  const [value, setValue] = useState(initialValue);

  return (
    <textarea
      rows={rows}
      value={value}
      disabled={isSaving}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => onBlurCommit(value.trim())}
      placeholder="No description provided"
      className={className}
    />
  );
};

export default EditableDescriptionTextarea;

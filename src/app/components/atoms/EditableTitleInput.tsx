'use client';
import { useState } from 'react';

// Editable Title Input — owns its own draft state, initialized from task
interface EditableTitleProps {
  initialValue: string;
  isSaving: boolean;
  onBlurCommit: (value: string) => void;
  className: string;
}
const EditableTitleInput = ({
  initialValue,
  isSaving,
  onBlurCommit,
  className,
}: EditableTitleProps) => {
  const [value, setValue] = useState(initialValue);

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      disabled={isSaving}
      onBlur={() => {
        const trimmed = value.trim();
        if (!trimmed) {
          setValue(initialValue); // revert locally if empty
          return;
        }
        onBlurCommit(trimmed);
      }}
      className={className}
      placeholder="Task title..."
    />
  );
};

export default EditableTitleInput;

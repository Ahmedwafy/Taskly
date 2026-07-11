// src/app/components/atoms/TasksViewSelection.tsx
import ArrowDown from '@/../public/svgIcons/ArrowDown.svg';
import Squares from '@/../public/svgIcons/Squares.svg';
import TasksListIcon from '@/../public/svgIcons/TasksListIcon.svg';

interface Option {
  value: string;
  label: string;
}

interface TasksViewSelectionProps {
  currentValue: string;
  handleViewChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
}

const TasksViewSelection = ({
  currentValue,
  handleViewChange,
  options,
}: TasksViewSelectionProps) => {
  // Find the label for what is currently selected to display it on the UI
  const selectedLabel =
    options.find((opt) => opt.value === currentValue)?.label || '';

  return (
    <div className="relative w-full h-full flex items-center justify-center cursor-pointer">
      {/* 1. Visible Label Text */}
      <div className="flex gap-4 item-center! justify-center">
        <span className="my-auto">
          {currentValue === 'BOARD_VIEW' ? (
            <Squares className="pointer-events-none z-10" />
          ) : (
            <TasksListIcon className="pointer-events-none z-10" />
          )}
        </span>
        <span className="text-md font-medium capitalize">
          {selectedLabel.toLowerCase()}
        </span>
        <span className="my-auto">
          <ArrowDown />
        </span>
      </div>

      {/* 2. Invisible Select overlaying everything */}
      <select
        value={currentValue}
        onChange={handleViewChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer appearance-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TasksViewSelection;

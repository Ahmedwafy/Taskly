'use client';
import Select, {
  SingleValue,
  components,
  // ControlProps,
  OptionProps,
  SingleValueProps,
  DropdownIndicatorProps,
} from 'react-select';
import ArrowDown from '@/../public/svgIcons/ArrowDown.svg';
import Squares from '@/../public/svgIcons/Squares.svg';
import TasksListIcon from '@/../public/svgIcons/TasksListIcon.svg';

interface Option {
  value: string;
  label: string;
}

interface TasksViewSelectionProps {
  currentValue: string;
  // Updated to accept a clean string instead of a native React change event
  handleViewChange: (newValue: string) => void;
  options: Option[];
}

// 1. Custom Option component to inject icons inside the dropdown list menu
const CustomOption = (props: OptionProps<Option, false>) => {
  return (
    <components.Option {...props}>
      <div className="flex items-center gap-3 cursor-pointer">
        {props.data.value === 'BOARD_VIEW' ? <Squares /> : <TasksListIcon />}
        <span className="capitalize text-sm font-medium">
          {props.data.label.toLowerCase()}
        </span>
      </div>
    </components.Option>
  );
};

// 2. Custom SingleValue component to handle icons for the selected item view
// checks if the value is 'BOARD_VIEW' to render the Squares icon, or the TasksListIcon alongside your label text when the dropdown is closed.
const CustomSingleValue = (props: SingleValueProps<Option, false>) => {
  return (
    <components.SingleValue {...props}>
      <div className="flex items-center gap-3">
        {props.data.value === 'BOARD_VIEW' ? <Squares /> : <TasksListIcon />}
        <span className="capitalize text-md font-medium text-gray-900">
          {props.data.label.toLowerCase()}
        </span>
      </div>
    </components.SingleValue>
  );
};

// 3. Custom Dropdown Indicator to match your exact Arrow SVG design
const CustomDropdownIndicator = (
  props: DropdownIndicatorProps<Option, false>,
) => {
  return (
    <components.DropdownIndicator {...props}>
      <ArrowDown className="text-gray-500" />
    </components.DropdownIndicator>
  );
};

const TasksViewSelection = ({
  currentValue,
  handleViewChange,
  options,
}: TasksViewSelectionProps) => {
  // Map standard selection target object
  const currentSelectObject =
    options.find((opt) => opt.value === currentValue) || null;

  // console.log('currentSelectObject', currentSelectObject);
  // {value: 'BOARD_VIEW', label: 'BOARD VIEW'} -or- {value: 'LIST_VIEW', label: 'LIST VIEW'}

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Select<Option, false>
        options={options}
        value={currentSelectObject}
        isSearchable={false}
        onChange={(selected: SingleValue<Option>) => {
          if (selected) handleViewChange(selected.value);
        }}
        // Register your custom UI element components
        components={{
          Option: CustomOption,
          SingleValue: CustomSingleValue,
          DropdownIndicator: CustomDropdownIndicator,
          IndicatorSeparator: null, // Removes the native divider line
        }}
        styles={{
          container: (baseStyles) => ({
            ...baseStyles,
            width: '100%',
          }),
          control: (baseStyles) => ({
            ...baseStyles,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
            borderRadius: '0.375rem', // rounded-md
            border: '1px solid #E5E7EB', // border-gray-200
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // shadow-sm
            cursor: 'pointer',
            height: '3.75rem', // h-15 (60px)
            width: '100%',
            paddingLeft: '1.25rem', // Gives a generous gap to the left icon
            paddingRight: '1.25rem', // Spacing for the right arrow
            '&:hover': {
              backgroundColor: '#F9FAFB', // hover:bg-gray-50
              borderColor: '#D1D5DB',
            },
          }),
          // 1. ADD THIS: Strips React Select's default absolute layout spacing on text
          valueContainer: (baseStyles) => ({
            ...baseStyles,
            padding: 0,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
          }),
          // 2. ADD THIS: Strips native dropdown container padding to align arrow perfectly
          indicatorsContainer: (baseStyles) => ({
            ...baseStyles,
            padding: 0,
            margin: 0,
          }),
          menu: (baseStyles) => ({
            ...baseStyles,
            borderRadius: '0.375rem',
            boxShadow:
              '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            zIndex: 50,
            width: '100%',
            left: 0,
            marginTop: '6px', // Creates a perfectly clean alignment gap under the card button
            padding: '4px', // Subtle floating card padding inside the dropdown menu card
          }),
          option: (baseStyles, state) => ({
            ...baseStyles,
            borderRadius: '0.25rem', // Makes the hover state match the inner menu feel cleanly
            backgroundColor: state.isSelected
              ? '#EFF6FF' // blue-50
              : state.isFocused
                ? '#F9FAFB' // gray-50
                : 'transparent',
            color: '#111827', // gray-900
            padding: '0.75rem 1rem',
          }),
        }}
        // Style React Select dynamically to match your original tailwind look seamlessly
        // styles={{
        //   container: (baseStyles) => ({
        //     ...baseStyles,
        //     width: '100%',
        //   }),
        //   control: (baseStyles) => ({
        //     ...baseStyles,
        //     display: 'flex',
        //     border: 'none',
        //     background: 'transparent',
        //     boxShadow: 'none',
        //     cursor: 'pointer',
        //     height: '100%',
        //     width: '100%',
        //   }),
        //   menu: (baseStyles) => ({
        //     ...baseStyles,
        //     borderRadius: '0.375rem',
        //     boxShadow:
        //       '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // shadow-md
        //     zIndex: 50,
        //     width: '100%',
        //     left: 0,
        //     paddingLeft: '4px',
        //     paddingRight: '4px',
        //     marginTop: '20px',
        //   }),
        //   option: (baseStyles, state) => ({
        //     ...baseStyles,
        //     backgroundColor: state.isSelected
        //       ? '#EFF6FF' // blue-50
        //       : state.isFocused
        //         ? '#F9FAFB' // gray-50
        //         : 'transparent',
        //     color: '#111827', // gray-900
        //     padding: '0.75rem 1rem',
        //   }),
        // }}
      />
    </div>
  );
};

export default TasksViewSelection;

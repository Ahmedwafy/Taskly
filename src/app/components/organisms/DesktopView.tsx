// // import Image from 'next/image';
// // import Button from '../atoms/Button';
// // import Link from 'next/link';
// // import * as icons from '../../../../public/icons/icons';
// import Input from '../atoms/input';
// import { UseFormRegister, FieldErrors } from 'react-hook-form';

// interface AddProjectDataTypes {
//   name: string;
//   description?: string;
// }

// interface Props {
//   register: UseFormRegister<AddProjectDataTypes>;
//   errors: FieldErrors<AddProjectDataTypes>;
// }

// const DesktopView = ({ register, errors }: Props) => {
//   return (
//     <section className="hidden lg:block">
//       <Input
//         {...register('name', {
//           required: 'name is required.',
//           minLength: {
//             value: 3,
//             message: 'Project name must be at least 3 characters.',
//           },
//         })}
//         label="PROJECT TITLE"
//         className="mt-10"
//         type="text"
//         // requiredd={true}
//         error={errors.name?.message}
//       />
//       <Input
//         {...register('description', {
//           maxLength: {
//             value: 500,
//             message: 'Description must be at most 500 characters.',
//           },
//         })}
//         label="DESCRIPTION"
//         multiline
//         rows={6}
//         optional="Optional"
//         placeholder="Provide a high-level overview of the project's architectural objectives and key milestones..."
//         className="mt-12"
//       />
//     </section>
//   );
// };

// export default DesktopView;

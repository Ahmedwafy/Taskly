// 'use client';
// import Button from '@/app/components/atoms/Button';
// import Link from 'next/link';
// import { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { ForgotPasswordFormTypes } from '@/types/shared';
// import InputField from '../atoms/input';
// import { forgotPasswordAction } from '@/app/actions/auth';
// import { toast } from 'sonner';
// import { useIsMobile } from '@/app/hooks/useIsMobile';
// import Arrow from '@/../public/svgIcons/Arrow.svg';
// import Success from '@/../public/svgIcons/Success.svg';
// import Timer from '@/../public/svgIcons/Timer.svg';

// const ForgotPasswordForm = () => {
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm<ForgotPasswordFormTypes>({
//     defaultValues: {
//       email: '',
//     },
//   });

//   const [countdown, setCountdown] = useState(0);
//   const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
//   const isMobile = useIsMobile();

//   useEffect(() => {
//     if (countdown === 0) return;

//     const timer = setInterval(() => {
//       setCountdown((prev) => prev - 1);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [countdown]);

//   const formatCountdown = (seconds: number) => {
//     if (seconds <= 0) return '';
//     const minutes = Math.floor(seconds / 60);
//     const remainder = seconds % 60;

//     if (minutes > 0) {
//       return remainder === 0
//         ? `${minutes}m`
//         : `${minutes}m ${String(remainder).padStart(2, '0')}s`;
//     }

//     return `${remainder}s`;
//   };

//   const handleResend = async () => {
//     setCountdown(300);
//   };

//   const onSubmit = async (data: ForgotPasswordFormTypes) => {
//     const result = await forgotPasswordAction({ email: data.email.trim() });

//     if (result.error) {
//       console.error('Error submitting data:', result.error);
//       toast.error(result.error);
//       setIsSubmitted(false);
//       return; // Halt execution
//     }

//     setCountdown(300);
//     setIsSubmitted(true);
//     reset();
//     toast.success('Reset link sent! Please check your inbox.');
//   };

//   if (isMobile === null) return null;

//   return (
//     <>
//       {/* ●──────────────────────────● Desktop Layout ●──────────────────────────● */}
//       {!isMobile && (
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="bg-background w-md py-4 px-4 rounded-2xl mx-auto mt-14 shadow-md"
//         >
//           <div className="w-91.5 flex flex-col justify-center mx-auto py-8">
//             <div className="flex flex-col gap-2">
//               <h1 className="headline-lg">Forgot password?</h1>
//               <p className="body-md">
//                 No worries, we&apos;ll send you reset instructions.
//               </p>
//             </div>

//             <div className="flex flex-col gap-4 mt-6">
//               <InputField
//                 {...register('email', {
//                   required: 'Email is required.',
//                   pattern: {
//                     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                     message: 'Enter a valid email address.',
//                   },
//                 })}
//                 name="email"
//                 label="email address"
//                 placeholder="Enter your email"
//                 error={errors.email?.message}
//               />

//               <Button
//                 name="Send Reset Link"
//                 variant="primary"
//                 type="submit"
//                 isSubmitting={isSubmitting}
//                 disabled={isSubmitting}
//               />
//             </div>

//             <Link
//               href="/login"
//               className="flex items-center gap-2 justify-center py-6"
//             >
//               <Arrow />
//               <p className="text-[#003D9B]">Back to log in</p>
//             </Link>

//             <div>
//               {isSubmitted && (
//                 <p className="flex justify-center py-4 my-4 bg-success text-[#005235] gap-2 rounded-md">
//                   <Success />
//                   <span>Your request has been sent successfully</span>
//                 </p>
//               )}
//             </div>

//             <p className="label-sm flex justify-center text-[#434654]">
//               DIDN&apos;T RECEIVE THE EMAIL?
//             </p>

//             <button
//               onClick={handleResend}
//               disabled={countdown > 0}
//               className="disabled:opacity-50 w-full mb-2 mt-4"
//               type="button"
//             >
//               <strong className="flex gap-2 justify-center items-center bg-surface-highest rounded-sm py-4 text-[#737685]">
//                 <Timer />

//                 {countdown > 0
//                   ? `Resend in ${formatCountdown(countdown)}`
//                   : 'Resend'}
//               </strong>
//             </button>
//           </div>
//         </form>
//       )}

//       {/* ●──────────────────────────● Mobile Layout ●──────────────────────────● */}
//       {isMobile && (
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="bg-background py-4 rounded-2xl mx-auto mt-10 shadow-md"
//         >
//           <div className="w-91.5 flex flex-col justify-center mx-auto py-8">
//             <div className="flex flex-col gap-2">
//               <h1 className="headline-lg">Forgot password?</h1>
//               <p className="body-md">
//                 No worries, we&apos;ll send you reset instructions.
//               </p>
//             </div>

//             <div className="flex flex-col gap-4 mt-6">
//               <InputField
//                 {...register('email', {
//                   required: 'Email is required.',
//                   pattern: {
//                     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                     message: 'Enter a valid email address.',
//                   },
//                 })}
//                 name="email"
//                 label="email address"
//                 placeholder="Enter your email"
//                 error={errors.email?.message}
//               />

//               <Button
//                 name="Send Reset Link"
//                 variant="primary"
//                 type="submit"
//                 isSubmitting={isSubmitting}
//                 disabled={isSubmitting}
//               />
//             </div>

//             <Link
//               href="/login"
//               className="flex items-center gap-2 justify-center py-6"
//             >
//               <Arrow />
//               <p className="text-[#003D9B]">Back to log in</p>
//             </Link>

//             <div>
//               {isSubmitted && (
//                 <p className="flex justify-center py-4 my-4 bg-success text-[#005235] gap-2 rounded-md">
//                   <Success />
//                   <span>Your request has been sent successfully</span>
//                 </p>
//               )}
//             </div>

//             <p className="label-sm flex justify-center text-[#434654]">
//               DIDN&apos;T RECEIVE THE EMAIL?
//             </p>

//             <button
//               onClick={handleResend}
//               disabled={countdown > 0}
//               className="disabled:opacity-50 w-full mb-2 mt-4"
//               type="button"
//             >
//               <strong className="flex gap-2 justify-center items-center bg-surface-highest rounded-sm py-4 text-[#737685]">
//                 <Timer />
//                 {countdown > 0
//                   ? `Resend in ${formatCountdown(countdown)}`
//                   : 'Resend'}
//               </strong>
//             </button>
//           </div>
//         </form>
//       )}
//     </>
//   );
// };

// export default ForgotPasswordForm;
'use client';
import Button from '@/app/components/atoms/Button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ForgotPasswordFormTypes } from '@/types/shared';
import InputField from '../atoms/input';
import { useIsMobile } from '@/app/hooks/useIsMobile';
import { useForgotPassword } from '@/app/hooks/auth/useForgotPassword';
import Arrow from '@/../public/svgIcons/Arrow.svg';
import Success from '@/../public/svgIcons/Success.svg';
import Timer from '@/../public/svgIcons/Timer.svg';

const ForgotPasswordForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordFormTypes>({
    defaultValues: {
      email: '',
    },
  });

  const [countdown, setCountdown] = useState(0);
  const isMobile = useIsMobile();

  const { mutate: sendResetLink, isPending, isSuccess } = useForgotPassword();

  useEffect(() => {
    if (countdown === 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const formatCountdown = (seconds: number) => {
    if (seconds <= 0) return '';
    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;

    if (minutes > 0) {
      return remainder === 0
        ? `${minutes}m`
        : `${minutes}m ${String(remainder).padStart(2, '0')}s`;
    }

    return `${remainder}s`;
  };

  const handleResend = async () => {
    setCountdown(300);
  };

  const onSubmit = (data: ForgotPasswordFormTypes) => {
    sendResetLink(
      { email: data.email.trim() },
      {
        onSuccess: () => {
          setCountdown(300);
          reset();
        },
      },
    );
  };

  if (isMobile === null) return null;

  return (
    <>
      {/* ●──────────────────────────● Desktop Layout ●──────────────────────────● */}
      {!isMobile && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-background w-md py-4 px-4 rounded-2xl mx-auto mt-14 shadow-md"
        >
          <div className="w-91.5 flex flex-col justify-center mx-auto py-8">
            <div className="flex flex-col gap-2">
              <h1 className="headline-lg">Forgot password?</h1>
              <p className="body-md">
                No worries, we&apos;ll send you reset instructions.
              </p>
            </div>

            <div className="flex flex-col gap-4 mt-6">
              <InputField
                {...register('email', {
                  required: 'Email is required.',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Enter a valid email address.',
                  },
                })}
                name="email"
                label="email address"
                placeholder="Enter your email"
                error={errors.email?.message}
              />

              <Button
                name="Send Reset Link"
                variant="primary"
                type="submit"
                isSubmitting={isPending}
                disabled={isPending}
              />
            </div>

            <Link
              href="/login"
              className="flex items-center gap-2 justify-center py-6"
            >
              <Arrow />
              <p className="text-[#003D9B]">Back to log in</p>
            </Link>

            <div>
              {isSuccess && (
                <p className="flex justify-center py-4 my-4 bg-success text-[#005235] gap-2 rounded-md">
                  <Success />
                  <span>Your request has been sent successfully</span>
                </p>
              )}
            </div>

            <p className="label-sm flex justify-center text-[#434654]">
              DIDN&apos;T RECEIVE THE EMAIL?
            </p>

            <button
              onClick={handleResend}
              disabled={countdown > 0}
              className="disabled:opacity-50 w-full mb-2 mt-4"
              type="button"
            >
              <strong className="flex gap-2 justify-center items-center bg-surface-highest rounded-sm py-4 text-[#737685]">
                <Timer />

                {countdown > 0
                  ? `Resend in ${formatCountdown(countdown)}`
                  : 'Resend'}
              </strong>
            </button>
          </div>
        </form>
      )}

      {/* ●──────────────────────────● Mobile Layout ●──────────────────────────● */}
      {isMobile && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-background py-4 rounded-2xl mx-auto mt-10 shadow-md"
        >
          <div className="w-91.5 flex flex-col justify-center mx-auto py-8">
            <div className="flex flex-col gap-2">
              <h1 className="headline-lg">Forgot password?</h1>
              <p className="body-md">
                No worries, we&apos;ll send you reset instructions.
              </p>
            </div>

            <div className="flex flex-col gap-4 mt-6">
              <InputField
                {...register('email', {
                  required: 'Email is required.',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Enter a valid email address.',
                  },
                })}
                name="email"
                label="email address"
                placeholder="Enter your email"
                error={errors.email?.message}
              />

              <Button
                name="Send Reset Link"
                variant="primary"
                type="submit"
                isSubmitting={isPending}
                disabled={isPending}
              />
            </div>

            <Link
              href="/login"
              className="flex items-center gap-2 justify-center py-6"
            >
              <Arrow />
              <p className="text-[#003D9B]">Back to log in</p>
            </Link>

            <div>
              {isSuccess && (
                <p className="flex justify-center py-4 my-4 bg-success text-[#005235] gap-2 rounded-md">
                  <Success />
                  <span>Your request has been sent successfully</span>
                </p>
              )}
            </div>

            <p className="label-sm flex justify-center text-[#434654]">
              DIDN&apos;T RECEIVE THE EMAIL?
            </p>

            <button
              onClick={handleResend}
              disabled={countdown > 0}
              className="disabled:opacity-50 w-full mb-2 mt-4"
              type="button"
            >
              <strong className="flex gap-2 justify-center items-center bg-surface-highest rounded-sm py-4 text-[#737685]">
                <Timer />
                {countdown > 0
                  ? `Resend in ${formatCountdown(countdown)}`
                  : 'Resend'}
              </strong>
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default ForgotPasswordForm;

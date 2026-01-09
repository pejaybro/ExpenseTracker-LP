import { apiCLient } from "@/api/apiClient";
import ExpButton from "@/components/buttons/exp-button";
import { ErrorField, FormField } from "@/components/Forms/Form";
import { Icons } from "@/components/icons";
import Flexcol from "@/components/section/flexcol";
import Flexrow from "@/components/section/flexrow";
import VerticalDevider from "@/components/strips/vertical-devider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PATH } from "@/router/routerConfig";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
const inputStyle =
  "border-dark-a3 bg-dark-a1 focus:bg-dark-a1 hover:bg-dark-a1 w-full rounded-md border p-2.5 outline-none";
const ResetPassword = () => {
  const navigate = useNavigate();
  const [resetPayload, setResetPayload] = useState(null);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [userFound, setUserFound] = useState(false);
  const [codeMatched, setCodeMatched] = useState(false);
  const [newPassword, setNewPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const onResetSubmit = async (data) => {
    if (isVerifying) return;
    try {
      setIsVerifying(true);
      await apiCLient.post("/user/reset-password", {
        email: data.email,
      });

      setResetPayload({ email: data.email });
      setUserFound(true);

      setTimeout(() => {
        setUserFound(false);
        setIsVerifying(false);
        setStep(2);
      }, 2000);
    } catch (error) {
      setIsVerifying(false);
    }
  };

  const resendPasswordCode = async () => {
    if (isVerifying) return;
    try {
      setIsVerifying(true);
      await apiCLient.post("/user/reset-password", {
        email: resetPayload.email,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const onVerifySubmit = async (data) => {
    if (isVerifying || !resetPayload?.email) return;

    try {
      setIsVerifying(true);
      const res = await apiCLient.post("/user/verify-password-reset", {
        email: resetPayload.email,
        code: data.code,
      });

      if (res.data.passwordReset) {
        setCodeMatched(true);

        setTimeout(() => {
          setCodeMatched(false);
          setIsVerifying(false);
          setStep(3);
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onNewPasswordSubmit = async (data) => {
    if (isVerifying || !resetPayload?.email) return;
    try {
      setIsVerifying(true);
      if (String(data.password) !== String(data.confirm_password)) {
        setPasswordMatch(true);
        return;
      }
      await apiCLient.post("/user/new-password", {
        email: resetPayload.email,
        password: data.password,
      });
      setPasswordMatch(false);
      setNewPassword(true);

      setTimeout(() => {
        setNewPassword(false);
        setIsVerifying(false);
        navigate(PATH.login);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Flexrow className="bg-dark-a1 min-h-screen items-center justify-center px-2">
      {/* Main Container */}
      <Flexcol className="bg-dark-a3 font-para2-m !text-14px text-slate-a1 max-w-5xl gap-2.5 rounded-lg p-5 shadow-xl">
        {/* Logo */}
        <h1 className="text-32px font-title tracking-wide">
          Spece<span className="text-exp-a1">ly</span>
        </h1>
        {step === 1 && (
          <>
            <span>Enter your e-mail to reset password</span>
            <form
              autoComplete="off"
              onSubmit={handleSubmit(onResetSubmit)}
              className="space-y-2"
            >
              <FormField className="py-0">
                <Input
                  placeholder="Enter email address"
                  className={cn(inputStyle)}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />
                <ErrorField error={errors.email} />
              </FormField>
              {/* Login Button */}
              <FormField className="py-0 pt-2">
                <ExpButton
                  type="submit"
                  custom_textbtn
                  disabled={isVerifying}
                  className={cn("bg-exp-a3 text-dark-a3 !text-14px w-full")}
                >
                  {isVerifying ? "Submitting..." : "Submit"}
                </ExpButton>
              </FormField>
            </form>
            {userFound && (
              <Flexrow>
                <span>User Found</span>
              </Flexrow>
            )}
            <Flexrow className="mt-2 items-center gap-2">
              <span> Don’t have an account ?</span>
              <button
                type="button"
                onClick={() => navigate(PATH.signup)}
                className={cn("text-exp-a3 cursor-pointer underline")}
              >
                Sign up
              </button>

              <span> OR </span>
              <button
                type="button"
                onClick={() => navigate(PATH.login)}
                className={cn("text-exp-a3 cursor-pointer underline")}
              >
                Login
              </button>
            </Flexrow>
          </>
        )}
        {step === 2 && (
          <>
            <span>Enter 6-digit code to Reset Your Password</span>
            <form onSubmit={handleSubmit(onVerifySubmit)} className="space-y-4">
              <Input
                maxLength={6}
                className="bg-dark-a1 text-center"
                placeholder="Enter verification code"
                {...register("code", {
                  required: "Code is required",
                  minLength: {
                    value: 6,
                    message: "Enter full 6-digit code",
                  },
                })}
              />

              <ExpButton
                type="submit"
                custom_textbtn
                disabled={isVerifying}
                className={cn("bg-exp-a3 text-dark-a3 !text-14px w-full")}
              >
                {isVerifying ? "Varifying..." : "Verify & Submit"}
              </ExpButton>
            </form>
            {codeMatched && (
              <Flexrow>
                <span>Code Matched</span>
              </Flexrow>
            )}
            <Flexrow className="mt-2 items-center gap-2">
              <span> Didn't get the code ?</span>
              <button
                type="button"
                onClick={() => resendPasswordCode()}
                className={cn("text-exp-a3 cursor-pointer underline")}
              >
                Resend
              </button>
            </Flexrow>
          </>
        )}
        {step === 3 && (
          <>
            <span>Enter Your New Password</span>
            <form
              autoComplete="off"
              onSubmit={handleSubmit(onNewPasswordSubmit)}
              className="space-y-2"
            >
              <FormField className="relative py-0">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={cn(inputStyle)}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Minimum 8 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="text-slate-a1/60 hover:text-slate-a1 absolute top-1/2 right-3 -translate-y-1/2"
                >
                  {showPassword ? <Icons.eye_open /> : <Icons.eye_close />}
                </button>
                <ErrorField error={errors.password} />
              </FormField>

              <FormField className="relative py-0">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={cn(inputStyle)}
                  {...register("confirm_password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Minimum 8 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="text-slate-a1/60 hover:text-slate-a1 absolute top-1/2 right-3 -translate-y-1/2"
                >
                  {showPassword ? <Icons.eye_open /> : <Icons.eye_close />}
                </button>
                <ErrorField error={errors.confirm_password} />
                <span className="text-12px text-rr font-para2-m">
                  {passwordMatch && "Password Not Matched"}
                </span>
              </FormField>
              <ExpButton
                type="submit"
                custom_textbtn
                disabled={isVerifying}
                className={cn("bg-exp-a3 text-dark-a3 !text-14px w-full")}
              >
                {isVerifying ? "Updating..." : "Update Password"}
              </ExpButton>
            </form>

            {newPassword && (
              <Flexrow>
                <span>Password Updated</span>
              </Flexrow>
            )}
          </>
        )}
      </Flexcol>
    </Flexrow>
  );
};

export default ResetPassword;

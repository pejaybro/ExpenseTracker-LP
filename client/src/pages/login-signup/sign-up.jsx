import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ExpButton from "@/components/buttons/exp-button";

import Flexrow from "@/components/section/flexrow";
import Flexcol from "@/components/section/flexcol";
import VerticalDevider from "@/components/strips/vertical-devider";

import { Icons } from "@/components/icons";
import { ErrorField, FormField } from "@/components/Forms/Form";

import { cn } from "@/lib/utils";
import { apiCLient } from "@/api/apiClient";
import { PATH } from "@/router/routerConfig";
import { useDebounce } from "@/hooks/useDebounce";

const Signup = () => {
  /* ---------------------------------------------------
     Navigation & step control
  --------------------------------------------------- */
  const navigate = useNavigate();
  const [step, setStep] = useState("signup"); // signup | verify

  /* ---------------------------------------------------
     State used across steps
  --------------------------------------------------- */
  const [signupPayload, setSignupPayload] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  /* ---------------------------------------------------
     Resend OTP timer state
  --------------------------------------------------- */
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  /* ---------------------------------------------------
     React Hook Form
  --------------------------------------------------- */
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  /* ---------------------------------------------------
     Username availability check
  --------------------------------------------------- */
  const username = watch("username");
  const debouncedUsername = useDebounce(username, 600);
  const [usernameStatus, setUsernameStatus] = useState(null);
  // null | "checking" | "available" | "taken"

  useEffect(() => {
    if (!debouncedUsername || debouncedUsername.length < 3) {
      setUsernameStatus(null);
      return;
    }

    setUsernameStatus("checking");

    const checkUsername = async () => {
      try {
        const res = await apiCLient.get(
          `/user/check-username?username=${debouncedUsername}`,
        );
        setUsernameStatus(res.data.available ? "available" : "taken");
      } catch {
        setUsernameStatus(null);
      }
    };

    checkUsername();
  }, [debouncedUsername]);

  /* ---------------------------------------------------
     Email availability check
  --------------------------------------------------- */
  const email = watch("email");
  const debouncedEmail = useDebounce(email, 600);
  const [emailStatus, setEmailStatus] = useState(null);
  // null | "checking" | "available" | "taken"

  useEffect(() => {
    if (
      !debouncedEmail ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(debouncedEmail)
    ) {
      setEmailStatus(null);
      return;
    }

    setEmailStatus("checking");

    const checkEmail = async () => {
      try {
        const res = await apiCLient.get(
          `/user/check-email?email=${debouncedEmail}`,
        );
        setEmailStatus(res.data.available ? "available" : "taken");
      } catch {
        setEmailStatus(null);
      }
    };

    checkEmail();
  }, [debouncedEmail]);

  /* ---------------------------------------------------
     Signup submit (Step 1)
  --------------------------------------------------- */
  const onSignupSubmit = async (data) => {
    if (usernameStatus === "taken" || emailStatus === "taken") return;

    try {
      await apiCLient.post("/user/signup", data);

      // Only store what verification step needs
      setSignupPayload({ email: data.email });
      setStep("verify");
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------------------------------------------
     OTP verify submit (Step 2)
  --------------------------------------------------- */
  const onVerifySubmit = async (data) => {
    if (isVerifying || !signupPayload?.email) return;

    try {
      setIsVerifying(true);

      await apiCLient.post("/user/verify", {
        email: signupPayload.email,
        code: data.code,
      });

      navigate(PATH.login);
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  /* ---------------------------------------------------
     Resend OTP logic with 60s cooldown
  --------------------------------------------------- */
  useEffect(() => {
    if (step !== "verify") return;

    setCanResend(false);
    setResendTimer(60);

    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  const resendCode = async () => {
    if (!canResend || !signupPayload?.email) return;

    try {
      await apiCLient.post("/user/resend-code", {
        email: signupPayload.email,
      });

      setCanResend(false);
      setResendTimer(60);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------------------------------------------
     Styles
  --------------------------------------------------- */
  const inputStyle =
    "border-dark-a3 bg-dark-a1 focus:bg-dark-a1 hover:bg-dark-a1 w-full rounded-md border p-2.5 outline-none";

  /* ---------------------------------------------------
     JSX
  --------------------------------------------------- */
  return (
    <Flexrow className="bg-dark-a1 min-h-screen items-center justify-center p-5">
      <Flexrow className="bg-dark-a3 max-w-5xl gap-0 rounded-lg p-5 shadow-xl">
        <Flexrow className="bg-exp-a1 w-1/2 rounded-lg" />

        <Flexrow className="w-full justify-center px-14 py-10 md:w-1/2">
          <Flexcol className="bg-dark-a3 text-slate-a1 font-para2-m !text-14px gap-2.5">
            <h1 className="text-32px font-title tracking-wide">
              Spece<span className="text-exp-a1">ly</span>
            </h1>

            {/* ---------------- SIGNUP STEP ---------------- */}
            {step === "signup" && (
              <>
                <span>Create your account</span>

                <form
                  autoComplete="off"
                  onSubmit={handleSubmit(onSignupSubmit)}
                  className="space-y-2"
                >
                  <FormField className="py-0">
                    <Input
                      placeholder="Enter a username"
                      className={cn(inputStyle)}
                      {...register("username", {
                        required: "Username is required",
                      })}
                    />
                    <ErrorField error={errors.username} />

                    {usernameStatus === "checking" && (
                      <span className="text-slate-a4 text-xs">
                        Checking availability...
                      </span>
                    )}
                    {usernameStatus === "available" && (
                      <span className="text-xs text-green-400">
                        Username is available
                      </span>
                    )}
                    {usernameStatus === "taken" && (
                      <span className="text-xs text-red-400">
                        Username already taken
                      </span>
                    )}
                  </FormField>

                  <FormField className="py-0">
                    <Input
                      placeholder="Enter full name"
                      className={cn(inputStyle)}
                      {...register("fullname", {
                        required: "Full Name is required",
                      })}
                    />
                    <ErrorField error={errors.fullname} />
                  </FormField>

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

                    {emailStatus === "checking" && (
                      <span className="text-slate-a4 text-xs">
                        Checking email availability...
                      </span>
                    )}
                    {emailStatus === "available" && (
                      <span className="text-xs text-green-400">
                        Email is available
                      </span>
                    )}
                    {emailStatus === "taken" && (
                      <span className="text-xs text-red-400">
                        Email already registered
                      </span>
                    )}
                  </FormField>

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

                  <FormField className="pt-2">
                    <ExpButton
                      type="submit"
                      disabled={
                        usernameStatus === "checking" ||
                        usernameStatus === "taken" ||
                        emailStatus === "checking" ||
                        emailStatus === "taken"
                      }
                      custom_textbtn
                      className="bg-exp-a3 text-dark-a3 w-full"
                    >
                      Sign up
                    </ExpButton>
                  </FormField>
                </form>
                <Flexrow className="mt-2 gap-2">
                  <span> Already have an account ?</span>
                  <button
                    custom_textbtn
                    type="button"
                    onClick={() => navigate(PATH.login)}
                    className={cn("text-exp-a3 cursor-pointer underline")}
                  >
                    Login
                  </button>
                </Flexrow>
              </>
            )}

            {/* ---------------- VERIFY STEP ---------------- */}
            {step === "verify" && (
              <>
                <span>Enter 6-digit code to confirm your account</span>

                <form
                  onSubmit={handleSubmit(onVerifySubmit)}
                  className="space-y-4"
                >
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

                  <Button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full bg-white text-black disabled:opacity-60"
                  >
                    {isVerifying ? "Verifying..." : "Verify & Create Account"}
                  </Button>
                </form>

                <Flexrow className="mt-4 items-center gap-2">
                  <button
                    type="button"
                    disabled={!canResend}
                    onClick={resendCode}
                    className={cn(
                      canResend
                        ? "text-exp-a3"
                        : "text-slate-a5 cursor-not-allowed",
                    )}
                  >
                    {canResend ? "Resend Code" : `Resend in ${resendTimer}s`}
                  </button>

                  <VerticalDevider />

                  <button
                    type="button"
                    onClick={() => navigate(PATH.login)}
                    className="text-exp-a3"
                  >
                    Go back
                  </button>
                </Flexrow>
              </>
            )}
          </Flexcol>
        </Flexrow>
      </Flexrow>
    </Flexrow>
  );
};

export default Signup;

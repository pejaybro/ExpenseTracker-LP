import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Flexrow from "@/components/section/flexrow";
import Flexcol from "@/components/section/flexcol";
import HorizontalDivider from "@/components/strips/horizontal-divider";
import { useState } from "react";
import { Icons } from "@/components/icons";
import VerticalDevider from "@/components/strips/vertical-devider";
import { ErrorField, FieldLabel, FormField } from "@/components/Forms/Form";
import { cn } from "@/lib/utils";
import ExpButton from "@/components/buttons/exp-button";
import { useNavigate } from "react-router-dom";
import { PATH } from "@/router/routerConfig";

const Signup = () => {
  const [step, setStep] = useState("signup"); // signup | verify
  const [signupPayload, setSignupPayload] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  /* STEP 1: Signup */
  const onSignupSubmit = (data) => {
    console.log("Signup data:", data);

    // Call API: POST /auth/signup
    // Backend sends 6-digit code
    setSignupPayload(data);
    setStep("verify");
  };

  const password = watch("password");

  /* STEP 2: Verify Code */
  const onVerifySubmit = (data) => {
    const finalPayload = {
      ...signupPayload,
      verificationCode: data.code,
    };
    console.log("Final payload to server:", finalPayload);

    // Call API: POST /auth/verify
  };

  const iconStyle = "text-exp-a3";
  const inputStyle =
    "border-dark-a3 bg-dark-a1 focus:bg-dark-a1 hover:bg-dark-a1 w-full rounded-md border p-2.5 outline-none";

  return (
    <Flexrow className="bg-dark-a1 min-h-screen items-center justify-center p-5">
      {/* Main Container */}
      <Flexrow className="bg-dark-a3 max-w-5xl gap-0 rounded-lg p-5 shadow-xl">
        {/* LEFT SECTION (Image / Visual) */}
        <Flexrow className="bg-exp-a1 w-1/2 rounded-lg"></Flexrow>

        {/* RIGHT SECTION (Form) */}
        <Flexrow className="w-full justify-center px-14 py-10 md:w-1/2">
          <Flexcol className="bg-dark-a3 text-slate-a1 font-para2-m !text-14px gap-2.5">
            {/* Logo */}
            <h1 className="text-32px font-title tracking-wide">
              Spece<span className="text-exp-a1">ly</span>
            </h1>

            {/* ================= SIGNUP STEP ================= */}
            {step === "signup" && (
              <>
                <span>Create your account</span>

                <form
                  autoComplete="off"
                  onSubmit={handleSubmit(onSignupSubmit)}
                  className="space-y-2"
                >
                  {/* Name */}

                  <FormField className="py-0">
                    <Input
                      autoComplete="new-username"
                      placeholder="Enter a username"
                      className={cn(inputStyle)}
                      {...register("username", {
                        required: "Username is required",
                      })}
                    />

                    <ErrorField error={errors.username} />
                  </FormField>

                  {/* Name */}

                  <FormField className="py-0">
                    <Input
                      autoComplete="new-name"
                      placeholder="Enter full name"
                      className={cn(inputStyle)}
                      {...register("fullname", {
                        required: "Full Name is required",
                      })}
                    />

                    <ErrorField error={errors.fullname} />
                  </FormField>

                  {/* Email */}

                  <FormField className="py-0">
                    <Input
                      autoComplete="new-email"
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

                  {/* Password */}

                  <FormField className="relative py-0">
                    <Input
                      autoComplete="new-password"
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
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="text-slate-a1/60 hover:text-slate-a1 absolute top-1/2 right-3 -translate-y-1/2"
                    >
                      {showPassword ? <Icons.eye_open /> : <Icons.eye_close />}
                    </button>

                    <ErrorField error={errors.password} />
                  </FormField>

                  {/* Signup Button */}

                  <FormField className="py-0 pt-2">
                    <ExpButton
                      type="submit"
                      custom_textbtn
                      className={cn("bg-exp-a3 text-dark-a3 !text-14px w-full")}
                    >
                      Sign up
                    </ExpButton>
                  </FormField>
                </form>

                {/* Divider */}
                <Flexrow className="text-slate-a4 my-2.5 items-center justify-center gap-2.5 !text-[12px]">
                  <HorizontalDivider className="bg-slate-a6 h-[0.5px]" />
                  <span>OR</span>
                  <HorizontalDivider className="bg-slate-a6 h-[0.5px]" />
                </Flexrow>

                {/* Google Signup */}

                <ExpButton
                  type="button"
                  custom_textbtn
                  className={cn(
                    "bg-slate-a1 text-dark-a3 !text-14px w-full gap-2.5",
                  )}
                >
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    className="h-3 w-3"
                  />
                  <span>Continue with Google</span>
                </ExpButton>

                {/* Login link */}
                <Flexrow className="mt-2 gap-2">
                  <span>Already have an account?</span>
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
            {/* ================= VERIFY STEP ================= */}

            {/* ================= VERIFY STEP ================= */}
            {step === "verify" && (
              <>
                <span className="mb-2">
                  Enter 6-digit code to confirm your account
                </span>

                <form
                  onSubmit={handleSubmit(onVerifySubmit)}
                  className="space-y-4"
                >
                  <Input
                    placeholder="enter verification code"
                    className="bg-dark-a1 text-center placeholder:text-white/40"
                    maxLength={6}
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
                    className="w-full bg-white text-black hover:bg-white/90"
                  >
                    Verify & Create Account
                  </Button>
                </form>

                <Flexrow className="mt-4 items-center gap-2">
                  <span className="text-exp-a3 cursor-pointer">
                    Resend Code
                  </span>
                  <VerticalDevider />
                  <span className="text-exp-a3 cursor-pointer">Go back</span>
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

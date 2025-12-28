import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Flexrow from "@/components/section/flexrow";
import Flexcol from "@/components/section/flexcol";
import HorizontalDivider from "@/components/strips/horizontal-divider";
import { PATH } from "@/router/routerConfig";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ErrorField, FormField } from "@/components/Forms/Form";
import { Icons } from "@/components/icons";
import ExpButton from "@/components/buttons/exp-button";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Login Data:", data);
  };
  const inputStyle =
    "border-dark-a3 bg-dark-a1 focus:bg-dark-a1 hover:bg-dark-a1 w-full rounded-md border p-2.5 outline-none";

  return (
    <Flexrow className="bg-dark-a1 min-h-screen items-center justify-center px-2">
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

            <span>Login to your account</span>

            <form
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-2"
            >
              {/* ID */}

              <FormField className="py-0">
                <Input
                  autoComplete="new-user-id"
                  placeholder="Email or Username"
                  className={cn(inputStyle)}
                  {...register("identifier", {
                    required: "ID is required",
                  })}
                />
                <ErrorField error={errors.identifier} />
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

              {/* Login Button */}
              <FormField className="py-0 pt-2">
                <ExpButton
                  type="submit"
                  custom_textbtn
                  className={cn("bg-exp-a3 text-dark-a3 !text-14px w-full")}
                >
                  Login
                </ExpButton>
              </FormField>
            </form>

            {/* Divider */}
            <Flexrow className="text-slate-a4 my-2.5 items-center justify-center gap-2.5 !text-[12px]">
              <HorizontalDivider className="bg-slate-a6 h-[0.5px]" />
              <span>OR</span>
              <HorizontalDivider className="bg-slate-a6 h-[0.5px]" />
            </Flexrow>

            {/* Google Login */}
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

            {/* Sign up */}

            <Flexrow className="mt-2 gap-2">
              <span> Don’t have an account ?</span>
              <button
                custom_textbtn
                type="button"
                onClick={() => navigate(PATH.signup)}
                className={cn("text-exp-a3 cursor-pointer underline")}
              >
                Sign up
              </button>
            </Flexrow>
          </Flexcol>
        </Flexrow>
      </Flexrow>
    </Flexrow>
  );
};

export default Login;

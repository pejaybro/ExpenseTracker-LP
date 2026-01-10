import Flexcol from "@/components/section/flexcol";
import { useState } from "react";
import { TitleSection } from ".";
import { ErrorField, FormField } from "@/components/Forms/Form";
import { Icons } from "@/components/icons";
import { PATH } from "@/router/routerConfig";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { apiCLient } from "@/api/apiClient";
import { toast } from "sonner";

const inputStyle =
  "border-dark-a3 bg-dark-a1 focus:bg-dark-a1 hover:bg-dark-a1 w-full rounded-md border p-2.5 outline-none";

const PasswordChange = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onNewPassword = async (data) => {
    try {
      if (String(data.new_password) !== String(data.confirm_new_password)) {
        toast.error("Password Mismatched", {
          duration: 5000,
          description: "New Password didnt matched.",
        });
        return;
      }
      const res = await apiCLient.post("/user/update-password", {
        currentPassword: data.current_password,
        newPassword: data.new_password,
      });

      toast.success("Success!", {
        duration: 5000,
        description: res.data.message,
      });
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong", {
        duration: 5000,
      });
      reset();
    }
  };
  return (
    <Flexcol>
      <TitleSection title={"Change Password"} />
      <form
        autoComplete="off"
        className="space-y-4"
        onSubmit={handleSubmit(onNewPassword)}
      >
        <FormField className="relative py-0">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={cn(inputStyle)}
            {...register("current_password", {
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
          <ErrorField error={errors.current_password} />
        </FormField>
        <FormField className="relative py-0">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={cn(inputStyle)}
            {...register("new_password", {
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
          <ErrorField error={errors.new_password} />
          <span className="text-12px text-rr font-para2-m">
            {passwordMatch && "Password Not Matched"}
          </span>
        </FormField>
        <FormField className="relative py-0">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={cn(inputStyle)}
            {...register("confirm_new_password", {
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
          <ErrorField error={errors.confirm_new_password} />
          <span className="text-12px text-rr font-para2-m">
            {passwordMatch && "Password Not Matched"}
          </span>
        </FormField>

        <FormField className="flex-row justify-start">
          <ExpButton
            type="submit"
            disable={isSubmitting}
            className={"text-dark-a1 bg-exp-a3"}
            custom_textbtn
          >
            Update
          </ExpButton>
          <ExpButton
            type="submit"
            onClick={() => navigate(PATH.passwordReset)}
            className={"text-dark-a1 bg-exp-a3"}
            custom_textbtn
          >
            Forgot Password ?
          </ExpButton>
        </FormField>
      </form>
    </Flexcol>
  );
};

export default PasswordChange;

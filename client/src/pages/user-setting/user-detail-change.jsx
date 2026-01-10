import Flexcol from "@/components/section/flexcol";
import { TitleSection } from ".";
import { useForm } from "react-hook-form";
import { ErrorField, FormField } from "@/components/Forms/Form";
import { useDebounce } from "@/hooks/useDebounce";
import { apiCLient } from "@/api/apiClient";
import { toast } from "sonner";
import { useState } from "react";
import { setUser } from "@/redux/slices/user-slice";
import { useDispatch } from "react-redux";

const inputStyle =
  "border-dark-a3 bg-dark-a1 focus:bg-dark-a1 hover:bg-dark-a1 w-full rounded-md border p-2.5 outline-none";

const UserDetailChange = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
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

  const email = watch("email");
  const debouncedEmail = useDebounce(email, 600);
  const [emailStatus, setEmailStatus] = useState(null);

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

  const onUpdateUserDetails = async (data) => {
    const payload = {};

    if (data.username) payload.username = data.username;
    if (data.fullname) payload.fullname = data.fullname;
    if (data.email) payload.email = data.email;

    if (Object.keys(payload).length === 0) {
      toast.error("Nothing to update", {
        description: "Please change at least one field.",
      });
      return;
    }
    if (usernameStatus === "taken" || emailStatus === "taken") return;

    try {
      const res = await apiCLient.post("/user/update-user-details", payload);

      dispatch(setUser(res.data.user));

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
      <TitleSection title={"Change User Details"} />
      <form
        autoComplete="off"
        onSubmit={handleSubmit(onUpdateUserDetails)}
        className="space-y-2"
      >
        <FormField className="py-0">
          <input
            placeholder="Enter a username"
            className={cn(inputStyle)}
            {...register("username", {
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters",
              },
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
            <span className="text-xs text-red-400">Username already taken</span>
          )}
        </FormField>
        <FormField className="py-0">
          <input
            placeholder="Enter full name"
            className={cn(inputStyle)}
            {...register("fullname")}
          />
          <ErrorField error={errors.fullname} />
        </FormField>
        <FormField className="py-0">
          <input
            placeholder="Enter email address"
            className={cn(inputStyle)}
            {...register("email", {
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
            <span className="text-xs text-green-400">Email is available</span>
          )}
          {emailStatus === "taken" && (
            <span className="text-xs text-red-400">
              Email already registered
            </span>
          )}
        </FormField>
        <FormField className="pt-2">
          <ExpButton
            type="submit"
            disabled={isSubmitting}
            custom_textbtn
            className="bg-exp-a3 text-dark-a3 w-full"
          >
            Update
          </ExpButton>
        </FormField>
      </form>
    </Flexcol>
  );
};

export default UserDetailChange;

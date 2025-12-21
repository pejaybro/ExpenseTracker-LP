import { Controller, useForm } from "react-hook-form";
import { ErrorField, FieldLabel, FormField, SelectDate } from "./Form";
import { Icons } from "../icons";
import Flexrow from "../section/flexrow";
import ExpButton from "../buttons/exp-button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiCLient } from "@/api/apiClient";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CreateSavingsGoalForm = ({ className }) => {
  const queryClient = useQueryClient();
  const createGoal = async (payload) => {
    const res = await apiCLient.post(`/saving-goal/create-goal`, payload);
    return res.data;
  };
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      userID: 123456,
      startDate: new Date(),
      log: [],
    },
  });

  const mutation = useMutation({
    mutationFn: createGoal,
    onSuccess: (data) => {
      toast.success("Savings Goal Created!", {
        description: `A new goal ${data.title} created.`,
        action: { label: "Ok!" },
      });
      queryClient.invalidateQueries({ queryKey: ["saving-goal"] });
      reset();
    },
    onError: (error) => {
      alert(error.message || "Failed to create goal");
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };
  return (
    <>
      <div className={cn("text-14px", className)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/** ====== Amount ===== */}
          <FormField>
            <FieldLabel iconColor={"text-exp-a1"} label="Goal Amount" />
            <div className="border-slate-a7 font-para2-b inline-flex w-full items-center border-b-1">
              <Icons.rupee className="text-18px" />
              <input
                className="inputType-number text-24px w-full rounded-md border-none px-3 py-1 outline-none"
                type="number"
                step="any"
                min={0}
                {...register("ofAmount", {
                  required: "* Amount is required",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "* Amount must be positive",
                  },
                })}
              />
              <span className="text-18px">INR</span>
            </div>
            <ErrorField error={errors.ofAmount} />
          </FormField>
          {/** ====== Title ===== */}
          <FormField>
            <FieldLabel iconColor={"text-exp-a1"} label="Goal Title" />
            <input
              className="border-dark-a3 bg-dark-a3 focus:bg-dark-a2 hover:bg-dark-a2 w-full rounded-sm border p-2 py-1 outline-none"
              {...register("title", {
                required: "* Goal title is required",
              })}
            />
            <ErrorField error={errors.title} />
          </FormField>
          {/** ====== Start & End Dates ===== */}
          <Flexrow className={"basis-1 flex-wrap gap-x-2 gap-y-0"}>
            <FormField className="flex-1 basis-[250px]">
              <FieldLabel iconColor={"text-exp-a1"} label="Start Date" />
              <Controller
                name="startDate"
                control={control}
                rules={{ required: "Date is required" }}
                render={({ field }) => (
                  <SelectDate
                    onSelect={field.onChange}
                    selected={field.value}
                  />
                )}
              />
              <ErrorField error={errors.startDate} />
            </FormField>
            <FormField className="flex-1 basis-[250px]">
              <FieldLabel iconColor={"text-exp-a1"} label="End Date" />
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <SelectDate
                    onSelect={field.onChange}
                    selected={field.value}
                  />
                )}
              />
              <ErrorField error={errors.startDate} />
            </FormField>
          </Flexrow>
          <FormField className="flex-row justify-end">
            <ExpButton
              type="submit"
              className={"text-dark-a1 bg-exp-a3"}
              custom_textbtn
            >
              Add Now
            </ExpButton>
            <ExpButton
              onClick={() => {
                reset();
              }}
              type="button"
              className={"bg-error-a1"}
              custom_textbtn
            >
              Cancel
            </ExpButton>
          </FormField>
        </form>
      </div>
    </>
  );
};

export default CreateSavingsGoalForm;

import { apiCLient } from "@/api/apiClient";
import ExpButton from "@/components/buttons/exp-button";
import CreateSavingsGoalForm from "@/components/Forms/create-savings-goal-form";
import { ErrorField, FieldLabel, FormField } from "@/components/Forms/Form";
import { Icons } from "@/components/icons";
import Flexcol from "@/components/section/flexcol";
import Flexrow from "@/components/section/flexrow";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Index = () => {
  const {
    data: goals,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["saving-goal"],
    queryFn: fetchSavingGoals,
  });
  const activeGoals = goals?.filter((g) => !g.isCompleted) ?? [];
  const completedGoals = goals?.filter((g) => g.isCompleted) ?? [];
  return (
    <>
      <Flexrow>
        <div className={"w-1/2"}>image</div>
        <div className="w-1/2">
          <CreateSavingsGoalForm />
        </div>
      </Flexrow>
      {activeGoals?.map((g) => (
        <GoalCard key={g._id} data={g} />
      ))}
      {completedGoals?.map((g) => (
        <GoalCard key={g._id} data={g} />
      ))}
    </>
  );
};

export default Index;

export const fetchSavingGoals = async () => {
  const userID = 123456;
  const res = await apiCLient.get(`/saving-goal/get-goal/${userID}`);
  return res.data; // this is what useQuery receives
};

export const GoalCard = ({ data }) => {
  const { log } = data;
  const latestAmount = log[log?.length - 1]?.amount;
  const previousAmount = log[log?.length - 2]?.amount ?? 0;
  const progress = Math.min((latestAmount / data.ofAmount) * 100, 100);

  const queryClient = useQueryClient();

  const updateGoal = async (payload) => {
    const res = await apiCLient.patch(`/saving-goal/update-goal`, payload);
    return res.data;
  };

  const completeMutation = useMutation({
    mutationFn: updateGoal,
    onSuccess: (data) => {
      toast.success("Savings Goal Completed!", {
        description: `Congrats your goal  has been completed`,
      });
      queryClient.invalidateQueries({ queryKey: ["saving-goal"] });
    },
    onError: (error) => {
      alert(error.message || "Failed to create goal");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateGoal,
    onSuccess: (data) => {
      toast.success("Goal Updated", {
        description: `Congrats your goal has been Updated`,
      });
      queryClient.invalidateQueries({ queryKey: ["saving-goal"] });
      reset({
        userID: 123456,
        _id: data._id,
      });
    },
    onError: (error) => {
      alert(error.message || "Failed to create goal");
    },
  });
  const {
    register,
    handleSubmit,
    reset,

    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      userID: 123456,
      _id: data._id,
    },
  });

  const handleGoalComplete = (data) => {
    const updatedData = {
      isCompleted: true,
      updatedAmount: data.ofAmount,
      _id: data._id,
    };
    toast.custom((t) => (
      <Flexrow
        className={cn(
          "!text-14px bg-dark-br1 text-slate-1 border-dark-br1 shadow-dark-p2 w-[24rem] items-center gap-2 rounded-lg border px-4 py-2 shadow-md",
        )}
      >
        <Flexcol className="flex-1 gap-0">
          <span className="font-medium">Set Complete?</span>
          <span>Do you want to set this goal as complete ?</span>
        </Flexcol>
        <Flexrow className="w-max justify-end gap-2">
          <ExpButton
            custom_textbtn
            className="bg-ggbg"
            onClick={() => {
              completeMutation.mutate(updatedData);
              toast.dismiss(t);
            }}
          >
            Yes
          </ExpButton>
          <ExpButton
            custom_textbtn
            className="bg-rrbg"
            onClick={() => {
              toast.dismiss(t);
            }}
          >
            No
          </ExpButton>
        </Flexrow>
      </Flexrow>
    ));
  };

  const onSubmit = (data) => {
    updateMutation.mutate(data);
  };

  return (
    <>
      <Flexcol className="bg-dark-a3 my-5 gap-2.5 rounded-md p-5">
        <div>Title : {data.title}</div>
        <Flexrow className={"justify-between"}>
          <div>
            Goal Achieved : {previousAmount} || {latestAmount}
          </div>
          <div>Goal Target : {data.ofAmount}</div>
        </Flexrow>
        <Progress
          value={progress}
          className={"bg-slate-a8 [&>div]:bg-exp-a1 h-4"}
        />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex h-full items-center gap-2"
        >
          <input
            className="inputType-number text-14px border-dark-a5 bg-dark-a2 w-full flex-1 rounded-md border px-3 py-1 outline-none"
            type="number"
            {...register("updatedAmount", {
              required: "* Amount is required",
              valueAsNumber: true,
              min: {
                value: 0,
                message: "* Amount must be positive",
              },
              max: {
                value: data.ofAmount,
                message: "* Amount must be below or equal to goal amount",
              },
              onBlur: (e) => {
                if (!e.target.value) {
                  clearErrors("updatedAmount");
                }
              },
            })}
            placeholder="Update Goal Amount"
          />

          <ExpButton
            type="submit"
            className={"text-dark-a1 bg-exp-a3 !text-12px !h-full"}
            custom_textbtn
          >
            Add Now
          </ExpButton>

          <ExpButton
            type="button"
            onClick={() => handleGoalComplete(data)}
            className={"text-dark-a1 bg-inc-a3 !text-12px !h-full"}
            custom_textbtn
          >
            Set Complete
          </ExpButton>
        </form>
        <ErrorField error={errors.updatedAmount} />
      </Flexcol>
    </>
  );
};

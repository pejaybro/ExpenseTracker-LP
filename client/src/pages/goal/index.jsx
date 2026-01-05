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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Spinner } from "flowbite-react";
import { getDate } from "@/utilities/calander-utility";
import moment from "moment";
import HorizontalDivider from "@/components/strips/horizontal-divider";
import VerticalDevider from "@/components/strips/vertical-devider";
import { amountFloat } from "@/components/utilityFilter";
const style = "!text-12px bg-exp-a3 text-dark-a3 px-3 w-max font-para2-b";

const Index = () => {
  const {
    data: goals,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["saving-goal"],
    queryFn: fetchSavingGoals,
    select: (goals) => ({
      activeGoals: goals.filter((g) => !g.isCompleted),
      completedGoals: goals.filter((g) => g.isCompleted),
    }),
  });
  const activeGoals = goals?.activeGoals ?? [];
  const completedGoals = goals?.completedGoals ?? [];

  //Pagination
  const ITEMS_PER_PAGE = 10;
  const [page_active, setPage_active] = useState(1);
  const start_active = (page_active - 1) * ITEMS_PER_PAGE;
  const end_active = start_active + ITEMS_PER_PAGE;
  const currentPageItems_active = activeGoals.slice(start_active, end_active);
  const [page_comleted, setPage_comleted] = useState(1);
  const totalPages_active = Math.ceil(activeGoals.length / ITEMS_PER_PAGE);
  const start_completed = (page_comleted - 1) * ITEMS_PER_PAGE;
  const end_completed = start_completed + ITEMS_PER_PAGE;

  const currentPageItems_comleted = completedGoals.slice(
    start_completed,
    end_completed,
  );
  const totalPages_comleted = Math.ceil(completedGoals.length / ITEMS_PER_PAGE);

  const [showForm, setShowForm] = useState(false);

  // NOTE: 1. Handle the loading state first
  if (isLoading) {
    // Replace with your preferred loading spinner component
    return (
      <Flexrow className="h-full items-center justify-center">
        <Spinner
          className="text-slate-a3 fill-exp-a1"
          size="lg"
          aria-label="expense page loader"
        />
      </Flexrow>
    );
  }

  // NOTE: 2. Handle the error state next
  if (isError) {
    return (
      <>
        <Flexrow className="h-full items-center justify-center">
          ERROR : {error}
        </Flexrow>
      </>
    );
  }

  if (!activeGoals.length && !completedGoals.length) {
    return (
      <Flexcol className={"m-auto max-w-[600px] items-center"}>
        <div className="text-dark-a0 flex h-[250px] w-[600px] items-center justify-center rounded-lg bg-amber-400">
          image here
        </div>
        <CreateSavingsGoalForm className="w-full flex-1" />
      </Flexcol>
    );
  }

  return (
    <Flexcol className="gap-8">
      {/** ====== Banner Image ====== */}
      <div className="text-dark-a0 flex h-[250px] w-full max-w-[1100px] items-center justify-center rounded-lg bg-amber-400">
        image here
      </div>

      {/** ====== Buttons and Goals Progress Counter ====== */}

      {(activeGoals.length || completedGoals.length) && (
        <Flexrow>
          <ExpButton className={cn(style)} custom_textbtn>
            <Icons.goal />
            Goals Completed : {completedGoals.length}
          </ExpButton>
          <ExpButton className={cn(style, "bg-inc-a3")} custom_textbtn>
            <Icons.goal />
            Goals Active : {activeGoals.length}
          </ExpButton>
          <ExpButton
            custom_textbtn
            onClick={() => setShowForm(!showForm)}
            className={cn(
              style,
              "flex-1",
              showForm && "bg-error-a1 text-slate-a1",
            )}
          >
            {showForm ? "Close Form" : "Create New Goal"}
          </ExpButton>
        </Flexrow>
      )}

      {/** ====== Create Goal Form ====== */}
      {showForm && <CreateSavingsGoalForm className="w-full flex-1" />}

      {/** ====== Active Goals List ====== */}
      {currentPageItems_active?.length > 0 && (
        <Flexcol>
          <span className="font-title text-[32px] tracking-wide">
            Active Goals
          </span>
          {currentPageItems_active?.map((g) => (
            <GoalCard key={g._id} data={g} />
          ))}

          <CustomPagination page={page_active} totalPages={totalPages_active} />
        </Flexcol>
      )}

      {/** ====== Completed Goals List ====== */}
      {currentPageItems_comleted.length > 0 && (
        <Flexcol>
          <span className="font-title text-[32px] tracking-wide">
            Completed Goals
          </span>
          {currentPageItems_comleted?.map((g) => (
            <GoalCard isCompleted key={g._id} data={g} />
          ))}
          <CustomPagination
            page={page_comleted}
            totalPages={totalPages_comleted}
          />
        </Flexcol>
      )}
    </Flexcol>
  );
};

export default Index;

export const fetchSavingGoals = async () => {
  const res = await apiCLient.get(`/saving-goal/get-goal`);
  return res.data; // this is what useQuery receives
};

export const GoalCard = ({ data, isCompleted }) => {
  const { log } = data;
  const latestAmount = log.reduce((sum, l) => sum + l.amount, 0);
  const previousAmount =
    log.length > 1 ? latestAmount - log[log.length - 1]?.amount : 0;
  const progress = Math.min((latestAmount / data.ofAmount) * 100, 100);

  const queryClient = useQueryClient();

  const updateGoal = async (payload) => {
    const res = await apiCLient.patch(`/saving-goal/update-goal`, payload);
    return res.data;
  };
  const deleteGoal = async (payload) => {
    const res = await apiCLient.delete(`/saving-goal/delete-goal`, {
      data: payload,
    });
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
        _id: data._id,
      });
    },
    onError: (error) => {
      alert(error.message || "Failed to update goal");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGoal,
    onMutate: async (deletedGoal) => {
      await queryClient.cancelQueries({ queryKey: ["saving-goal"] });
      const previousGoals = queryClient.getQueryData(["saving-goal"]);
      queryClient.setQueryData(["saving-goal"], (old) =>
        old?.filter((g) => g._id !== deletedGoal._id),
      );
      return { previousGoals };
    },

    onError: (error, _, context) => {
      queryClient.setQueryData(["saving-goal"], context.previousGoals);
      alert(error.message || "Failed to delete goal");
    },
    onSuccess: () => {
      toast.success("Savings Goal Deleted!", {
        description: `your goal has been deleted`,
      });
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
          <span className="font-para2-m">Set Complete?</span>
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

  const handleGoalDelete = (data) => {
    toast.custom((t) => (
      <Flexrow
        className={cn(
          "!text-14px bg-dark-br1 text-slate-1 border-dark-br1 shadow-dark-p2 w-[24rem] items-center gap-2 rounded-lg border px-4 py-2 shadow-md",
        )}
      >
        <Flexcol className="flex-1 gap-0">
          <span className="font-para2-m">Delete Goal?</span>
          <span>are you sure want to delete goal?</span>
        </Flexcol>
        <Flexrow className="w-max justify-end gap-2">
          <ExpButton
            custom_textbtn
            className="bg-ggbg"
            onClick={() => {
              deleteMutation.mutate(data);
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

  const completedDate = data.log[data.log.length - 1]?.createdAt;

  return (
    <>
      <Flexcol className="bg-dark-a3 font-para2-m gap-4 rounded-md p-5">
        <Flexrow className={"justify-between"}>
          <div className="font-para2-b text-20px inline-flex items-center gap-1">
            <Icons.goal className="text-16px" /> {data.title}
          </div>
          {!isCompleted && (
            <ExpButton
              type="button"
              onClick={() => handleGoalDelete(data)}
              className={"bg-error-a1 text-12px p-2"}
              delete_iconbtn
            />
          )}
        </Flexrow>

        {!isCompleted && (
          <Flexrow className={"text-12px items-center justify-between"}>
            <ExpButton
              custom_textbtn
              className="border-slate-a3 items-center gap-2 border"
            >
              <span>Achieved </span>
              <span>: </span>
              {amountFloat(previousAmount)}
              {latestAmount !== -1 && (
                <>
                  <Icons.double_arrow_right className="text-exp-a3" />
                  {amountFloat(latestAmount)}
                </>
              )}
            </ExpButton>

            <ExpButton
              custom_textbtn
              className="border-slate-a3 items-center gap-2 border"
            >
              <span>Target : </span> {amountFloat(data.ofAmount)}
              <VerticalDevider />
              <span>Pending : </span>{" "}
              {amountFloat(data.ofAmount - latestAmount)}
            </ExpButton>
          </Flexrow>
        )}

        <Progress
          value={progress}
          className={cn(
            "bg-slate-a8 [&>div]:bg-exp-a1 h-4",
            isCompleted && "[&>div]:bg-inc-a1",
          )}
        />
        {isCompleted && (
          <Flexrow className={"gap-2"}>
            <ExpButton
              custom_textbtn
              className={cn(
                "!text-12px border-exp-a3 bg-exp-a3/8 fon-para2-m text-salte-a3 cursor-default border",
              )}
            >
              <Icons.goal />
              Goal Target : {data.ofAmount}
            </ExpButton>
            <ExpButton
              custom_textbtn
              className={cn(
                "!text-12px border-inc-a3 bg-inc-a3/8 fon-para2-m text-slate-a3 cursor-default border",
              )}
            >
              <Icons.goal />
              Created : {getDate(data.startDate)}
            </ExpButton>
            <ExpButton
              custom_textbtn
              className={cn(
                "!text-12px border-inc-a3 bg-inc-a3/8 fon-para2-m text-slate-a3 cursor-default border",
              )}
            >
              <Icons.goal />
              Completed : {getDate(completedDate)}
            </ExpButton>
            {!moment(data.startDate).isSame(data.endDate, "day") && (
              <ExpButton
                custom_textbtn
                className={cn(
                  "!text-12px border-exp-a3 bg-exp-a3/8 fon-para2-m text-slate-a3 cursor-default border",
                )}
              >
                <Icons.goal />
                Deadline : {getDate(data.endDate)}
              </ExpButton>
            )}
            <ExpButton
              type="button"
              onClick={() => handleGoalDelete(data)}
              className={"bg-error-a1/9 border-error-a1 text-12px border p-2"}
              delete_iconbtn
            />
          </Flexrow>
        )}

        {!isCompleted && (
          <Flexcol className="gap-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex h-full items-center gap-2"
            >
              <input
                className="inputType-number text-14px border-dark-a5 bg-dark-a2 w-full flex-1 rounded-md border px-3 py-1 outline-none"
                type="number"
                min="0"
                step="any"
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
            <Flexrow className="text-slate-a4 !text-12px font-para2-m items-center justify-start gap-2 px-1">
              <Icons.calander_date />
              {!moment(data.startDate).isSame(data.endDate, "day") && (
                <>
                  <span>Your Goal Deadline</span>
                  <span>-</span>
                  {getDate(data.endDate, "DD MMM , YY")}
                  <VerticalDevider />
                  {moment(data.endDate)
                    .startOf("day")
                    .diff(moment().startOf("day"), "days") > 0 && (
                    <>
                      <span>Days Remining</span>
                      <span>-</span>
                      {moment(data.endDate)
                        .startOf("day")
                        .diff(moment().startOf("day"), "days") + 1}
                    </>
                  )}
                  {moment(data.endDate)
                    .startOf("day")
                    .diff(moment().startOf("day"), "days") === 0 && (
                    <span>Today is Last Day</span>
                  )}
                  {moment(data.endDate)
                    .startOf("day")
                    .diff(moment().startOf("day"), "days") < 0 && (
                    <>
                      <span>Days over deadline</span>
                      <span>-</span>
                      {amountFloat(
                        moment(data.endDate)
                          .startOf("day")
                          .diff(moment().startOf("day"), "days"),
                      )}
                    </>
                  )}
                </>
              )}
            </Flexrow>
          </Flexcol>
        )}
      </Flexcol>
    </>
  );
};

export const CustomPagination = ({
  bgColor = "bg-exp-a1",
  page,
  totalPages,
}) => {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className={
              page === 1
                ? "bg-dark-a3 pointer-events-none cursor-not-allowed"
                : `text-dark-a1 cursor-pointer ${bgColor}`
            }
          >
            <Icons.pageBack />
          </PaginationPrevious>
        </PaginationItem>

        <PaginationItem className="text-14px px-5">
          Page {page} of {totalPages}
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className={
              page === totalPages
                ? "bg-dark-a3 pointer-events-none cursor-not-allowed"
                : `text-dark-a1 cursor-pointer ${bgColor}`
            }
          >
            <Icons.pageNext />
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

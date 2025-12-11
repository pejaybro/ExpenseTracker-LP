import { cn } from "@/lib/utils";
import ExpButton from "../buttons/exp-button";
import Flexcol from "../section/flexcol";
import { ErrorField, SelectDate } from "../Forms/Form";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { PaymentStatus } from "@/global/globalVariables";
import moment from "moment";
import useRecurringConfig from "@/hooks/useRecurringConfig";
import { toast } from "sonner";
import { insertExpense } from "@/redux/slices/transaction-slice";
import { Spinner } from "flowbite-react";
import Flexrow from "../section/flexrow";
import { Icons } from "../icons";

const NotificationsBlock = ({ setIsNotiOpen, isNotiOpen }) => {
  const { notifications } = useRecurringConfig();

  return (
    <div
      data-state={isNotiOpen ? true : false}
      className="data-[state=true]:animate-in data-[state=true]:fade-in data-[state=false]:animate-out data-[state=false]:fade-out absolute inset-0 z-[9999] flex justify-end bg-[#0505055c] p-2.5"
    >
      <Flexcol className="bg-dark-a1 border-dark-a3 text-slate-a1 font-para2-m h-full w-[350px] rounded-md border p-5">
        <Flexrow className={"justify-between"}>
          <div>Notifications</div>

          <ExpButton
            custom_iconbtn
            className={"text-slate-a1 p-1"}
            onClick={() => setIsNotiOpen(false)}
          >
            <Icons.cross />
          </ExpButton>
        </Flexrow>

        {notifications.length > 0 &&
          notifications.map((n) => {
            if (!n.message) return;
            return (
              <Flexcol
                key={n.id}
                className={cn(
                  "border-exp-a1 bg-exp-a1/5 gap-2 rounded-md border p-4",
                )}
              >
                <div className="text-14px">{n.message}</div>

                {(n.status === PaymentStatus.DUE ||
                  n.status === PaymentStatus.OVERDUE) && (
                  <NotificationTab id={n.id} />
                )}
              </Flexcol>
            );
          })}
        {!notifications.length && (
          <Flexrow className={"text-slate-a6 !text-14px justify-center"}>
            empty
          </Flexrow>
        )}
      </Flexcol>
    </div>
  );
};

export default NotificationsBlock;

export const NotificationTab = ({ id }) => {
  const { createExpenseData } = useRecurringConfig();
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      onDate: new Date(),
      recID: id,
    },
  });

  const onSubmit = async (data) => {
    try {
      data.onDate = moment(data.onDate).toISOString();
      const expData = createExpenseData(data.recID);
      if (expData !== null) {
        data = {
          ...expData,
          onDate: data.onDate,
          isTripExpense: false,
          isRecurringExpense: true,
          ofTrip: null,
          ofRecurring: id,
          isReccuringStatus: PaymentStatus.PAID,
        };
        delete data._id;
        let result;
        result = await dispatch(insertExpense({ data })).unwrap();

        toast.success("Transaction Added!", {
          description: `A new entry for ${result.ofAmount} was saved successfully.`,
          action: { label: "Ok!" },
        });
      }
      reset();
    } catch (error) {
      toast.error("Operation Failed!", {
        description: error?.message ?? String(error),
        action: { label: "Try Again" },
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
        {/* --- Date Field --- */}
        <Controller
          name="onDate"
          control={control}
          rules={{ required: "Date is required" }}
          render={({ field }) => (
            <SelectDate
              className={
                "text-12px bg-exp-a3 !text-dark-a3 hover:bg-exp-a1 h-max flex-1 rounded-sm !px-2 py-1 [&_svg]:!h-3"
              }
              onSelect={field.onChange}
              selected={field.value}
            />
          )}
        />

        <ExpButton
          type="submit"
          className={cn(
            "text-dark-a3 bg-exp-a3 !text-12px h-full rounded-sm py-1",
          )}
          disabled={isSubmitting}
          custom_textbtn
        >
          {isSubmitting ? (
            <Spinner
              className="fill-slate-a1 text-dark-a2"
              size="sm"
              aria-label="trip-form-loader"
            />
          ) : (
            "Paid"
          )}
        </ExpButton>
      </form>
      <ErrorField error={errors.onDate} />
    </>
  );
};

import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { ErrorField, FieldLabel, FormField, SelectDate } from "../Forms/Form";
import { useDispatch } from "react-redux";
import {
  expenseCategories,
  getPrimeCategories,
  getSubOfPrime,
  incomeCategories,
} from "@/global/categories";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Icons } from "@/components/icons";
import ExpButton from "../buttons/exp-button";
import SelectFilter from "../selectFilter/SelectFilter";
import Flexrow from "../section/flexrow";
import { DialogClose } from "@radix-ui/react-dialog";
import {
  updateExpense,
  updateIncome,
  updateRecurringExpense,
} from "@/redux/slices/transaction-slice";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";
import moment from "moment";

const TransactionEditForm = ({
  transaction,
  isExpesne,
  isIncome,
  isRecurring,
  setSelectedTransaction,
}) => {
  const bgColor =
    (isExpesne && "bg-exp-a1") ||
    (isIncome && "bg-inc-a1") ||
    (isRecurring && "bg-rep-a1");
  const txtColor =
    (isExpesne && "text-exp-a1") ||
    (isIncome && "text-inc-a1") ||
    (isRecurring && "text-rep-a1");
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  
  const isTripExpense = watch("isTripExpense");
  const isRecurringExpense = isExpesne ? watch("isRecurringExpense") : false;
  const selectedPrimeCat = watch("primeCategory");
  const [showSubCategoryWarning, setShowSubCategoryWarning] = useState(false);

  const listOfPrimeCats = useMemo(() => {
    return isExpesne || isRecurring
      ? getPrimeCategories(expenseCategories)
      : getPrimeCategories(incomeCategories);
  }, [isExpesne, isRecurring]);

  // --- MODIFICATION: Get list of sub-categories based on selected prime ---
  const listOfSubCat = useMemo(() => {
    // Use 'selectedPrimeCat' (from watch) if available,
    // FALL BACK to 'transaction.primeCategory' for the initial render.
    const prime = selectedPrimeCat || transaction?.primeCategory;
    if (!prime) return [];
    return getSubOfPrime(prime, isExpesne || isRecurring);
  }, [selectedPrimeCat, transaction, isExpesne, isRecurring]); // Added 'transaction' dependency

  useEffect(() => {
    // Make sure the form is populated (transaction exists) AND the list of subs is ready
    if (transaction && listOfSubCat.length > 0) {
      // Check if the prime category being watched is different from the original transaction's
      if (selectedPrimeCat !== transaction.primeCategory) {
        // If it's different, the user must have changed it.
        // Auto-select the first item from the new sub-category list.
        setValue("subCategory", listOfSubCat[0], { shouldValidate: true });

        // We *also* set the warning here, in the same update.
        setShowSubCategoryWarning(true);
      }
    }
  }, [listOfSubCat, selectedPrimeCat, setValue, transaction]);

  useEffect(() => {
    if (transaction) {
      const recData = transaction.ofRecurring;
      const tripData = transaction.ofTrip;
      reset({
        ...transaction,
        onDate: new Date(transaction.onDate),
        ofAmount: transaction.ofAmount,
        lastPaymentDate:
          (isRecurring && transaction.lastPaymentDate) ||
          (isExpesne && isRecurringExpense && recData
            ? new Date(recData.lastPaymentDate)
            : false),
        isReccuringBy:
          (isRecurring && transaction.isReccuringBy) ||
          (isExpesne && isRecurringExpense && recData
            ? recData.isReccuringBy
            : false),
      });

      setShowSubCategoryWarning(false);
    }
  }, [transaction, isRecurringExpense, reset]);

  const onSubmit = async (data) => {
    const date = data.onDate;
    data.onDate = moment(date).toISOString();
    try {
      let result;
      if (isExpesne) {
        result = dispatch(updateExpense({ data })).unwrap();
      } else if (isIncome) {
        result = dispatch(updateIncome({ data })).unwrap();
      } else if (isRecurring) {
        result = dispatch(updateRecurringExpense({ data })).unwrap();
      }
      setSelectedTransaction(null);
      toast.success("Transaction Added!", {
        description: `Entry Updated Successfully!`,
        action: {
          label: "Ok!",
          onClick: () => {
            reset();
          },
        },
      });
    } catch (error) {
      toast.error("Update Failed!", {
        description: error,
        action: { label: "Try Again" },
      });
    }
  };

  // Helper for tag buttons
  const toggleTag = (fieldName) => {
    setValue(fieldName, !watch(fieldName), { shouldDirty: true });
  };
  return (
    <Dialog
      open={!!transaction}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setSelectedTransaction(null);
        }
      }}
    >
      <DialogContent className="bg-dark-a3 border-dark-a4 min-w-[650px] p-8 [&>button]:hidden">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="!text-14px text-slate-a1 font-medium"
        >
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>
              Make changes to your transaction here. Click save when you're
              done.
            </DialogDescription>
          </DialogHeader>

          {/* Form Fields: Titles on left, inputs on right */}
          <div className="grid grid-cols-[1fr_2fr] gap-x-4 gap-y-3 py-4 pt-8">
            {/* Amount */}
            <FieldLabel label="Amount" iconColor={txtColor} />
            <Flexrow className="border-slate-a7 items-center gap-1 border-b">
              <Icons.rupee className="text-sm" />
              <input
                className="inputType-number w-full bg-transparent py-1 outline-none"
                type="number"
                {...register("ofAmount", {
                  required: "Amount is required",
                  valueAsNumber: true,
                })}
              />
            </Flexrow>
            <ErrorField error={errors.ofAmount} className="col-start-2" />

            {/* Date */}
            <FieldLabel label="Date" iconColor={txtColor} />
            <Controller
              name="onDate"
              control={control}
              rules={{ required: "Date is required" }}
              render={({ field }) => (
                <SelectDate
                  className="border-dark-a2 bg-dark-a1 focus:bg-dark-a1 hover:bg-dark-a1 w-full rounded-md border p-2 outline-none"
                  onSelect={(date) => field.onChange(date)}
                  selected={field.value}
                />
              )}
            />
            <ErrorField error={errors.onDate} className="col-start-2" />

            {/* Prime Category */}
            <FieldLabel label="Primary Category" iconColor={txtColor} />
            <Controller
              name="primeCategory"
              control={control}
              rules={{ required: "Prime category is required" }}
              render={({ field }) => (
                <>
                  <SelectFilter
                    placeholder="Select Prime Category"
                    className="bg-dark-a1 w-full"
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    list={listOfPrimeCats}
                    value={field.value}
                  />
                </>
              )}
            />
            <ErrorField error={errors.primeCategory} className="col-start-2" />
            {/* --- MODIFICATION: Sub Category Dropdown --- */}
            <FieldLabel label="Sub Category" iconColor={txtColor} />
            <Controller
              name="subCategory"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <>
                  {console.log("GG", field.value)}

                  <SelectFilter
                    placeholder="Select Sub Category"
                    className="bg-dark-a1 w-full"
                    onValueChange={(value) => {
                      field.onChange(value);
                      // --- Hide warning ---
                      setShowSubCategoryWarning(false);
                    }}
                    list={listOfSubCat} // List is now dynamic based on useMemo
                    value={field.value}
                  />
                </>
              )}
            />

            {/* --- ADDED: Warning Message --- */}
            {showSubCategoryWarning && (
              <p className="text-12px text-rr col-start-2 italic">
                Note: Sub-category was auto-reset. Please confirm selection.
              </p>
            )}
            <ErrorField error={errors.subCategory} className="col-start-2" />

            {/* if isRecurring */}
            {(isRecurringExpense || isRecurring) && (
              <>
                <FieldLabel
                  iconColor={txtColor}
                  label="Expense Recurring Type"
                />

                <Controller
                  name="isReccuringBy"
                  rules={{
                    required: "Recurring Expense Type is Required",
                  }}
                  control={control}
                  render={({ field }) => (
                    <Flexrow className={"text-16px"}>
                      {[1, 2].map((type) => (
                        <Flexrow
                          key={type}
                          className={"w-max items-center gap-2"}
                        >
                          {console.log("check val", field.value)}

                          <Checkbox
                            className="data-[state=checked]:bg-rep-a3 border-slate-a7 hover:cursor-pointer"
                            // 1. Read from field.value
                            checked={field.value === type}
                            // 2. Use field.onChange to set the new value
                            onCheckedChange={() => {
                              const newValue =
                                field.value === type ? null : type;
                              field.onChange(newValue);
                            }}
                          />
                          <span>By {type === 1 ? "Month" : "Year"}</span>
                        </Flexrow>
                      ))}
                    </Flexrow>
                  )}
                />

                <FieldLabel iconColor={txtColor} label="Payment Deadline!" />
                <Controller
                  name="lastPaymentDate"
                  control={control}
                  rules={{ required: "Date is required" }}
                  render={({ field }) => (
                    <SelectDate
                      className="border-dark-a2 bg-dark-a1 focus:bg-dark-a1 hover:bg-dark-a1 w-full rounded-md border p-2 outline-none"
                      onSelect={field.onChange}
                      selected={field.value}
                    />
                  )}
                />
              </>
            )}

            {/* Note */}
            <FieldLabel label="Note" iconColor={txtColor} />
            <textarea
              rows={3}
              className="border-dark-a2 bg-dark-a1 focus:bg-dark-a1 hover:bg-dark-a1 w-full rounded-md border p-2 outline-none"
              placeholder="Transaction Note..."
              {...register("isNote")}
            />
            <FieldLabel label="Tags" iconColor={txtColor} />
            <FormField>
              <Flexrow className="gap-2">
                {isTripExpense && (
                  <ExpButton
                    as="div"
                    custom_textbtn
                    className={cn(
                      "!text-12px px-2.5 py-1",
                      "bg-trip-a3 text-dark-a2",
                    )}
                  >
                    Trip Expense
                  </ExpButton>
                )}
                {isRecurringExpense && (
                  <ExpButton
                    as="div"
                    custom_textbtn
                    className={cn(
                      "!text-12px px-2.5 py-1",
                      "bg-rep-a3 text-dark-a2",
                    )}
                  >
                    Recurring Expense
                  </ExpButton>
                )}
                {isExpesne && (
                  <ExpButton
                    as="div"
                    custom_textbtn
                    className={cn(
                      "!text-12px px-2.5 py-1",
                      "bg-exp-a4 text-dark-a2",
                    )}
                  >
                    Expense Transaction
                  </ExpButton>
                )}
                {isIncome && (
                  <ExpButton
                    as="div"
                    custom_textbtn
                    className={cn(
                      "!text-12px px-2.5 py-1",
                      "bg-inc-a4 text-dark-a2",
                    )}
                  >
                    Income Transaction
                  </ExpButton>
                )}
              </Flexrow>
            </FormField>
          </div>

          {/* Tags (as requested) */}

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <ExpButton custom_textbtn className="bg-error-a1 text-slate-a1">
                Cancel
              </ExpButton>
            </DialogClose>
            <ExpButton
              type="submit"
              custom_textbtn
              className={cn(bgColor, "text-dark-a1")}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </ExpButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionEditForm;

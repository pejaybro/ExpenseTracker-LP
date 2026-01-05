import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import moment from "moment";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { ErrorField, FieldLabel, FormField } from "../Forms/Form";
import Flexrow from "../section/flexrow";
import { Icons } from "../icons";

import { useDispatch } from "react-redux";
import { setBudget } from "@/redux/slices/budget-slice";
import ExpButton from "../buttons/exp-button";

import { CurrentMonth, CurrentYear } from "@/utilities/calander-utility";
import { useState } from "react";

const BudgetPop = ({ children, isEdit, isNew }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  //NOTE default userID
  const year = CurrentYear();
  const month = CurrentMonth();

  //NOTE react-form-hook
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      year: year,
      month: month,
    },
  });

  //NOTE form on submit
  const onSubmit = async (data) => {
    try {
      await dispatch(setBudget({ data })).unwrap();
      // If the await succeeds, show the success toast.
      setIsOpen(false);
      toast.success("Success!", {
        description: "Your budget has been saved.",
        action: {
          label: "Ok!",
          onClick: () => reset(), // Assuming reset() clears your form
        },
      });
    } catch (error) {
      toast.error("Operation Failed", {
        description: error, // 'error' is the clean error message from rejectWithValue
        action: {
          label: "Ok!",
          onClick: () => {},
        },
      });
    }
  };
  return (
    <>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent className={`from-dark-a5 to-dark-a3 bg-gradient-to-t`}>
          <DrawerHeader>
            {isEdit && (
              <DrawerTitle className={"text italic"}>
                NOTE : editing current budget will change your Budget Analysis
              </DrawerTitle>
            )}
            {isNew && (
              <DrawerTitle className={"text-budget italic"}>
                NOTE : Setting new budget will also change your analysis.
              </DrawerTitle>
            )}
            <Flexrow className="justify-center text-white">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-160 min-w-100"
              >
                <FormField>
                  <FieldLabel
                    iconColor={"text-white"}
                    htmlFor="Budget Amount"
                    label="Budget Amount"
                  />
                  <Flexrow className="font-para2-b items-center gap-0 border-b-1 border-white">
                    <Icons.rupee className="text-[18px]" />
                    <input
                      className="inputType-number text-24px w-full rounded-md border-none px-3 py-1 outline-none"
                      type="number"
                      {...register("amount", {
                        required: "* Please provide a Budget Amount",
                        valueAsNumber: true,
                      })}
                    />
                    <span className="text-[18px]">INR</span>
                  </Flexrow>
                </FormField>
                <Flexrow>
                  <ErrorField error={errors.amount} />
                </Flexrow>
                <Flexrow className={"items-center justify-end gap-2"}>
                  <ExpButton
                    custom_textbtn
                    className={"bg-bud-a3 text-dark-a1"}
                    type="submit"
                  >
                    Submit
                  </ExpButton>
                  <DrawerClose>
                    <ExpButton
                      custom_textbtn
                      as={"div"}
                      isText
                      className="bg-error-a1"
                    >
                      <span onClick={() => reset()} className="text-14px">
                        Cancel
                      </span>
                    </ExpButton>
                  </DrawerClose>
                </Flexrow>
              </form>
            </Flexrow>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default BudgetPop;

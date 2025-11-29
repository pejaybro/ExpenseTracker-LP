import { Controller, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { FieldLabel, SelectDate } from "./Form";
import { useEffect } from "react";
import { Checkbox } from "../ui/checkbox";
import Flexrow from "../section/flexrow";
import Flexcol from "../section/flexcol";
import { ErrorFieldTrip } from "./create-trip-form";
import SelectBar from "../selectFilter/SelectBar";
import SelectCard from "../selectFilter/SelectCard";
import SelectFilter from "../selectFilter/SelectFilter";
import { getCodeOf, getCountryNames } from "@/global/countries";
import HorizontalDivider from "../strips/horizontal-divider";
import numeral from "numeral";
import ExpButton from "../buttons/exp-button";
import { toast } from "sonner";
import { updateTripDetails } from "@/redux/slices/trip-slice";
import moment from "moment";
import { useDispatch } from "react-redux";

const EditTripForm = ({ tripDetails, onClose, setEditingTripDetails }) => {
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

  const tripType = watch("tripType");
  const travelType = watch("travelType");
  const abroadInfo = watch("abroadInfo");

  useEffect(() => {
    if (tripDetails) {
      reset({
        ...tripDetails,
        startOn: new Date(tripDetails.startOn),
        endsOn: new Date(tripDetails.endsOn),
      });
    }
  }, [tripDetails, reset]);

  const onSubmit = async (data) => {
    data.startOn = moment(data.startOn).toISOString();
    data.endsOn = moment(data.endsOn).toISOString();
    try {
      const result = dispatch(updateTripDetails({ data })).unwrap();
      setEditingTripDetails(null);
      toast.success("Transaction Added!", {
        description: `Trip Updated Successfully!`,
      });
    } catch (error) {
      toast.error("Update Failed!", {
        description: error,
        action: { label: "Try Again" },
      });
    }
  };

  const iconColor = "text-trip-a3";

  const handleSelectCountry = async (countryName) => {
    const countryDetails = getCodeOf(countryName);
    const currencyCode = countryDetails.currencyCode.toLowerCase();
    try {
      const res = await fetch(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currencyCode}.json`,
      );
      const data = await res.json();
      const result = {
        country: countryDetails.name,
        currency: countryDetails.currency,
        currencyCode: countryDetails.currencyCode,
        rate: data[currencyCode]["inr"] ?? null,
      };
      setValue("abroadInfo", result, { shouldValidate: true });
    } catch (error) {
      console.error("Failed to fetch currency data", error);
      setValue("abroadInfo", null);
    }
  };

  return (
    <Dialog open={!!tripDetails} onOpenChange={onClose}>
      <DialogContent className="bg-dark-a3 border-dark-a4 min-w-[650px] p-8 [&>button]:hidden">
        <form
          className={"text-slate-a1 font-para2-b"}
          onSubmit={handleSubmit(onSubmit)}
        >
          <DialogHeader>
            <DialogTitle>Edit Trip Details</DialogTitle>
            <DialogDescription>
              Make changes to your Trip here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-[1fr_2fr] gap-x-4 gap-y-3 py-4 pt-8">
            <FieldLabel label="Trip Title" iconColor={iconColor} />
            <input
              className="text-24px placeholder:text-slate-a1/70 border-slate-a2 focus:border-trip-a2 focus:ring-trip-a2 relative z-10 w-full border-b-1 px-1 py-1 font-bold outline-none"
              type="text"
              {...register("tripTitle", {
                required: "* Trip title is required",
              })}
            />
            <FieldLabel label="Start Date" iconColor={iconColor} />
            <Controller
              name="startOn"
              control={control}
              rules={{ required: "Start date is required" }}
              render={({ field }) => (
                <SelectDate
                  className={"bg-dark-a2"}
                  onSelect={field.onChange}
                  selected={field.value}
                />
              )}
            />
            <FieldLabel label="End Date" iconColor={iconColor} />
            <Controller
              name="endsOn"
              control={control}
              rules={{
                required: "End date is required",
                validate: (value, formValues) =>
                  new Date(value) >= new Date(formValues.startOn) ||
                  "End date cannot be before start date",
              }}
              render={({ field }) => (
                <SelectDate
                  className={"bg-dark-a2"}
                  onSelect={field.onChange}
                  selected={field.value}
                />
              )}
            />
            {errors?.endsOn?.message && (
              <>
                <div></div>
                <ErrorFieldTrip error={errors.endsOn?.message} />
              </>
            )}
            <FieldLabel label="Trip Type" iconColor={iconColor} />
            <Flexrow className="gap-4">
              {[0, 1].map((i) => (
                <Flexrow key={i} className={"w-max items-center gap-2"}>
                  <Checkbox
                    className="data-[state=checked]:bg-trip-a3 data-[state=checked]:text-dark-a2 text-18px border-dark-a7 bg-dark-a2 size-5 border hover:cursor-pointer"
                    checked={tripType === i}
                    // Simplified: Clicking it simply sets the tripType to that index
                    onCheckedChange={() =>
                      setValue("tripType", i, { shouldValidate: true })
                    }
                  />
                  <span>{i === 0 ? "Domestic" : "Abroad"}</span>
                </Flexrow>
              ))}
            </Flexrow>
            {tripType === 1 && (
              <>
                <FieldLabel label="Select Country" iconColor={iconColor} />
                <Controller
                  name="abroadInfo"
                  control={control}
                  rules={{
                    validate: (value, formValues) => {
                      if (formValues.tripType !== 1) {
                        return true;
                      }

                      if (value && value.country) {
                        return true; // Valid!
                      }

                      return "Country details are required for international trips";
                    },
                  }}
                  render={({ field }) => (
                    <>
                      <SelectBar className={"bg-trip-a3 text-dark-a3 gap-1.25"}>
                        <SelectCard title={"Select Country"}>
                          <SelectFilter
                            className={"flex-1"}
                            placeholder={"Select"}
                            onValueChange={handleSelectCountry}
                            list={getCountryNames()}
                            value={field.value?.country || ""}
                          />
                        </SelectCard>
                      </SelectBar>
                    </>
                  )}
                />
                {errors.abroadInfo?.message && (
                  <>
                    <div></div>
                    <ErrorFieldTrip error={errors?.abroadInfo?.message} />
                  </>
                )}

                {abroadInfo && (
                  <>
                    <FieldLabel label="Info" iconColor={iconColor} />
                    <Flexrow className={"text-14px w-max items-center gap-2"}>
                      <span>{abroadInfo.country}</span> -
                      <span>1 {abroadInfo.currencyCode} </span> -
                      <span>
                        Rs. {numeral(abroadInfo.rate).format("0.000")}
                      </span>
                    </Flexrow>
                  </>
                )}
              </>
            )}

            <FieldLabel label="Travel Type" iconColor={iconColor} />
            <Flexrow className="text-14px flex-wrap gap-2.5">
              {[0, 1, 2, 3].map((i) => (
                <Flexrow key={i} className={"max-w-[160px] items-center gap-2"}>
                  <Checkbox
                    className="data-[state=checked]:bg-trip-a3 data-[state=checked]:text-dark-a2 text-18px border-dark-a7 bg-dark-a2 size-5 border hover:cursor-pointer"
                    checked={travelType === i}
                    onCheckedChange={() =>
                      setValue("travelType", travelType === i ? 0 : i)
                    }
                  />
                  <span>
                    {i === 0 && "Solo Trip"}
                    {i === 1 && "Solo Family Trip"}
                    {i === 2 && "Group Trip"}
                    {i === 3 && "Group Family Trip"}
                  </span>
                </Flexrow>
              ))}
            </Flexrow>
            {travelType >= 2 && (
              <>
                <FieldLabel label="Members/Groups" iconColor={iconColor} />
                <input
                  className="inputType-number bg-dark-a2 focus:bg-dark-a2 focus:border-dark-a4 hover:text-slate-a1 text-14px w-full rounded-sm px-2.5 py-1 outline-none"
                  type="number"
                  {...register("ofGroup", {
                    valueAsNumber: true,
                    validate: (value) =>
                      travelType < 2 ||
                      value >= 1 ||
                      "Group size must be at least 1",
                  })}
                />

                {errors.ofGroup?.message && (
                  <>
                    <div></div>
                    <ErrorFieldTrip error={errors.ofGroup?.message} />
                  </>
                )}
              </>
            )}
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <ExpButton custom_textbtn className="bg-error-a1 text-slate-a1">
                Cancel
              </ExpButton>
            </DialogClose>
            <ExpButton
              type="submit"
              custom_textbtn
              className={"text-dark-a3 bg-trip-a3"}
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

export default EditTripForm;

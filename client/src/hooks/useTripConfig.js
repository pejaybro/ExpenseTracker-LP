import { useSelector } from "react-redux";
import {
  selectAllTripsSummary,
  selectTripList,
  selectTripSummary,
} from "@/redux/slices/trip-slice";

const useTripConfig = () => {
  const TripList = useSelector(selectTripList);
  const { TripLoading, TripError, CreateTripLoading, CreateTripError } =
    useSelector((state) => state.trip);
  const FilteredTripSummary = useSelector(selectTripSummary);
  const AllTripSummary = useSelector(selectAllTripsSummary);

  

  const getTripDetails = (id) => TripList?.find((t) => t._id === id);

  return {
    TripList,
    AllTripSummary,
    FilteredTripSummary,
    getTripDetails,
    TripLoading,
    TripError,
    CreateTripLoading,
    CreateTripError,
  };
};

export default useTripConfig;

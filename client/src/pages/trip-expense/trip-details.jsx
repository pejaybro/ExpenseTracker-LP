import useTripConfig from "@/hooks/useTripConfig";

import { useParams } from "react-router-dom";

const TripDetails = () => {
  const { getTripDetails } = useTripConfig();
  const { tripid } = useParams();
  const trip = getTripDetails(tripid);
  console.log("Trip Details", trip);

  return <>{trip.tripSummary}</>;
};

export default TripDetails;

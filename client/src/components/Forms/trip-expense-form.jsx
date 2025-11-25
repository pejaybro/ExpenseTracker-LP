import Form from "./Form";
import { useParams } from "react-router-dom";

const TripExpenseForm = ({ hasTripExpense = true, id }) => {
  const { tripid } = useParams();
  return <Form isTrip hasTripExpense={hasTripExpense} tripID={id || tripid} />;
};

export default TripExpenseForm;

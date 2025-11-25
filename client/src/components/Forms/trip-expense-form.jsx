import Form from "./Form";

const TripExpenseForm = ({hasTripExpense, id }) => {
  return <Form isTrip hasTripExpense={hasTripExpense} tripID={id} />;
};

export default TripExpenseForm;

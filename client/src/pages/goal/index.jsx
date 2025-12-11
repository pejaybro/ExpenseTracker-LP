import CreateSavingsGoalForm from "@/components/Forms/create-savings-goal-form";
import Flexrow from "@/components/section/flexrow";

const Index = () => {
  return (
    <>
      <Flexrow>
        <div className={"w-1/2"}>image</div>
        <div className="w-1/2">
          <CreateSavingsGoalForm />
        </div>
      </Flexrow>
    </>
  );
};

export default Index;

import Form from "@/components/Forms/Form";
import Flexrow from "@/components/section/flexrow";

const NewIncome = () => {
  return (
    <>
      <Flexrow>
        <Flexrow className={"w-1/2"}>
          <div className="text-dark-a0 flex h-full w-full items-center justify-center rounded-lg bg-amber-400">
            image here
          </div>
        </Flexrow>
        <Flexrow className={"w-1/2"}>
          <Form newIncome isIncome />
        </Flexrow>
      </Flexrow>
    </>
  );
};

export default NewIncome;

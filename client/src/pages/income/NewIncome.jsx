import Form from "@/components/Forms/Form";
import Flexcol from "@/components/section/flexcol";
import Flexrow from "@/components/section/flexrow";

const NewIncome = () => {
  return (
    <>
      <Flexcol className={"m-auto max-w-[600px] items-center"}>
        <div className="text-dark-a0 flex h-[250px] w-[600px] shrink-0 items-center justify-center rounded-lg bg-amber-400"></div>

        <Form className={"w-full flex-1"} newIncome isIncome />
      </Flexcol>
    </>
  );
};

export default NewIncome;

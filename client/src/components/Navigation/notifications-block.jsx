import ExpButton from "../buttons/exp-button";
import Flexcol from "../section/flexcol";
import Flexrow from "../section/flexrow";

const NotificationsBlock = ({ setIsNotiOpen, isNotiOpen }) => {
  return (
    <div
      data-state={isNotiOpen ? true : false}
      className="data-[state=true]:animate-in data-[state=true]:fade-in data-[state=false]:animate-out data-[state=false]:fade-out absolute inset-0 z-[9999] flex justify-end bg-[#0505055c] p-2.5"
    >
      <ExpButton
        custom_textbtn
        className={"bg-white"}
        onClick={() => setIsNotiOpen(false)}
      >
        close
      </ExpButton>
      <Flexcol className="bg-dark-a1 border-dark-a3 h-full w-[300px] rounded-md border text-slate-a1">
        <div>Notifications</div>
        <Flexrow>
            
        </Flexrow>

      </Flexcol>
    </div>
  );
};

export default NotificationsBlock;

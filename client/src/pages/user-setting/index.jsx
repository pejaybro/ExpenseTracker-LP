import ExpButton from "@/components/buttons/exp-button";
import { FieldLabel, FormField } from "@/components/Forms/Form";
import Flexcol from "@/components/section/flexcol";
import Flexrow from "@/components/section/flexrow";
import UserAvatar from "@/components/UserAvatar";

const SettingIndex = () => {
  return (
    <>
      <Flexcol>
        <Flexcol>
          <TitleSection title={"Change User Avatar"} />
          <UserAvatar isSettings />
        </Flexcol>
        <Flexcol>
          <TitleSection title={"Change User Details"} />
          <form>
            {/** ====== Username ===== */}
            <FormField>
              <FieldLabel iconColor={"text-exp-a1"} label="Username" />
              <input className="border-dark-a3 bg-dark-a3 focus:bg-dark-a2 hover:bg-dark-a2 w-full rounded-sm border p-2 py-1 outline-none" />
            </FormField>
            {/** ====== Name ===== */}
            <FormField>
              <FieldLabel iconColor={"text-exp-a1"} label="Name" />
              <input className="border-dark-a3 bg-dark-a3 focus:bg-dark-a2 hover:bg-dark-a2 w-full rounded-sm border p-2 py-1 outline-none" />
            </FormField>

            {/** ====== Email ===== */}
            <FormField>
              <FieldLabel iconColor={"text-exp-a1"} label="Email" />
              <input className="border-dark-a3 bg-dark-a3 focus:bg-dark-a2 hover:bg-dark-a2 w-full rounded-sm border p-2 py-1 outline-none" />
            </FormField>
            <FormField className="flex-row justify-start">
              <ExpButton
                type="submit"
                className={"text-dark-a1 bg-exp-a3"}
                custom_textbtn
              >
                Save
              </ExpButton>
            </FormField>
          </form>
        </Flexcol>
        <Flexcol>
          <TitleSection title={"Change Password"} />
           <form>
            {/** ====== Username ===== */}
            <FormField>
              <FieldLabel iconColor={"text-exp-a1"} label="Current Password" />
              <input className="border-dark-a3 bg-dark-a3 focus:bg-dark-a2 hover:bg-dark-a2 w-full rounded-sm border p-2 py-1 outline-none" />
            </FormField>
            {/** ====== Name ===== */}
            <FormField>
              <FieldLabel iconColor={"text-exp-a1"} label="New Password" />
              <input className="border-dark-a3 bg-dark-a3 focus:bg-dark-a2 hover:bg-dark-a2 w-full rounded-sm border p-2 py-1 outline-none" />
            </FormField>

            {/** ====== Email ===== */}
            <FormField>
              <FieldLabel iconColor={"text-exp-a1"} label="Confirm New Password" />
              <input className="border-dark-a3 bg-dark-a3 focus:bg-dark-a2 hover:bg-dark-a2 w-full rounded-sm border p-2 py-1 outline-none" />
            </FormField>
            <FormField className="flex-row justify-start">
              <ExpButton
                type="submit"
                className={"text-dark-a1 bg-exp-a3"}
                custom_textbtn
              >
                Update
              </ExpButton>
                <ExpButton
                type="submit"
                className={"text-dark-a1 bg-exp-a3"}
                custom_textbtn
              >
                Forgot Password ?
              </ExpButton>
            </FormField>
          </form>
        </Flexcol>
      </Flexcol>
    </>
  );
};

export default SettingIndex;
export const TitleSection = ({ title }) => {
  return (
    <Flexcol className="gap-2">
      <span className="font-para2-b text-24px">{title}</span>
      <Flexrow className="bg-exp-a1 h-0.5 w-full rounded-full"></Flexrow>
    </Flexcol>
  );
};

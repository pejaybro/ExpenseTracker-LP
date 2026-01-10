import { IconLibrary } from "@/components/IconLibearay";

import Flexcol from "@/components/section/flexcol";
import Flexrow from "@/components/section/flexrow";
import UserAvatar from "@/components/UserAvatar";

import UserDetailChange from "./user-detail-change";
import PasswordChange from "./password-change";

const SettingIndex = () => {
  return (
    <>
      <Flexcol className="text-14px m-auto max-w-[700px] gap-20">
        <Flexcol>
          <TitleSection title={"Change User Avatar"} />
          <UserAvatar isSettings />
        </Flexcol>
        <UserDetailChange />
        <PasswordChange />

        <IconLibrary />
      </Flexcol>
    </>
  );
};

export default SettingIndex;
export const TitleSection = ({ title }) => {
  return (
    <Flexcol className="border-slate-a4 gap-2 border-b-[1.25px] pb-2.5">
      <span className="font-title text-slate-a4 text-24px tracking-wide">
        {title}
      </span>
    </Flexcol>
  );
};

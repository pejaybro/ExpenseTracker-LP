import NavMenu from "@/components/Navigation/NavMenu";
import { PATH } from "@/router/routerConfig";
import { Outlet } from "react-router-dom";

const Goal = () => {
  return (
    <>
      <NavMenu activeBtn={PATH.goal}>
        <Outlet />
      </NavMenu>
    </>
  );
};

export default Goal;

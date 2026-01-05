import NavMenu from "@/components/Navigation/NavMenu";
import { Outlet } from "react-router-dom";
import { PATH } from "@/router/routerConfig";
import useDashboardLoad from "@/hooks/useDashboardLoad";

const Home = () => {
   useDashboardLoad();
  return (
    <>
      <NavMenu activeBtn={PATH.home}>
        <Outlet />
      </NavMenu>
    </>
  );
};

export default Home;

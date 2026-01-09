import NavMenu from "@/components/Navigation/NavMenu";
import { Outlet, useLocation } from "react-router-dom";
import useDashboardLoad from "@/hooks/useDashboardLoad";
import { PATH } from "@/router/routerConfig";

const AppLayout = () => {
  // Load dashboard data once user is authenticated
  useDashboardLoad();

  const { pathname } = useLocation();

  // Determine active nav button safely
  const activeBtn =
    [
      PATH.expense,
      PATH.income,
      PATH.trip,
      PATH.repeat,
      PATH.budget,
      PATH.goal,
      PATH.setting,
      PATH.analysis,
      PATH.home,
    ].find((path) => pathname.startsWith(path)) || PATH.home;

  return (
    <NavMenu activeBtn={activeBtn}>
      <Outlet />
    </NavMenu>
  );
};

export default AppLayout;

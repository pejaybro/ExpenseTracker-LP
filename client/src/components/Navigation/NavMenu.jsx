import { PATH } from "@/router/routerConfig";
import { useNavigate } from "react-router-dom";

import { FaPowerOff, FaUser } from "react-icons/fa";

import { Icons } from "../icons";
import Flexcol from "../section/flexcol";
import Flexrow from "../section/flexrow";

import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { bgDarkA3 } from "@/global/style";
import ExpButton from "../buttons/exp-button";
import UserAvatar from "../UserAvatar";

import VerticalDevider from "../strips/vertical-devider";
import {
  ActiveClock,
  ActiveDate,
  GlobalFilter,
  Logo,
  NotiBell,
  PageTitle,
  UserLogout,
  UserSettings,
} from "./top-bar";
import { AddBudget, AddExp, AddInc, BudgetBarIndicator } from "./bottom-bar";
import specely from "@/assets/specely.png";
import NotificationsBlock from "./notifications-block";
import { useState } from "react";
import useBudgetConfig from "@/hooks/useBudgetConfig";
import { useCheckViewport } from "@/hooks/useCheckViewport";
import { useSelector } from "react-redux";

function Dashboard({ activeBtn, children }) {
  const { hide } = useCheckViewport();

  const navigate = useNavigate();

  const [isNotiOpen, setIsNotiOpen] = useState(false);

  const username = useSelector((state) => state.user.username);

  function selectedStyle(toSet) {
    if (activeBtn === toSet)
      return "bg-slate-a1 text-dark-a1 [&>span]:text-dark-a1";
    else return "hover:bg-dark-a6 text-salte-a1";
  }

  // ----- Navigation array -----
  const nav = [
    {
      id: 0,
      name: <span>Dashboard</span>,
      icon: <Icons.dashbaord />,
      link: PATH.home,
    },
    {
      id: 1,
      name: <span>Expense</span>,
      icon: <Icons.expense />,
      link: PATH.expense,
    },
    {
      id: 2,
      name: <span>Income</span>,
      icon: <Icons.income />,
      link: PATH.income,
    },
    {
      id: 3,
      name: <span>Analysis</span>,
      icon: <Icons.analysis />,
      link: PATH.analysis,
    },
    {
      id: 4,
      name: <span>Recurring Expense</span>,
      icon: <Icons.repeat />,
      link: PATH.repeat,
    },
    {
      id: 5,
      name: <span>Trip Expense</span>,
      icon: <Icons.trip />,
      link: PATH.trip,
    },
    {
      id: 6,
      name: <span>Budgeting</span>,
      icon: <Icons.calc />,
      link: PATH.budget,
    },
    {
      id: 7,
      name: <span>Set Goals</span>,
      icon: <Icons.goal />,
      link: PATH.goal,
    },
  ];

  if (hide) {
    return (
      <Flexrow className="bg-dark-a1 font-para2-m min-h-screen w-full items-center justify-center">
        <div className="border-slate-a8 bg-dark-a3 !text-slate-a1 flex flex-col items-center gap-5 rounded-lg border px-15 py-10">
          <Icons.warning className="text-32px text-yellow-300" />

          <p className="text-18px">Screen size not supported</p>

          <p className="text-14px">Content only visible on following:</p>

          <ul className="text-14px space-y-1 text-center">
            <li>• Desktop: minimum - 900px w × 620px h</li>
            <li>• Portrait (Tablet) : minimum - 800px w</li>
            <li>• Landscape (Tablet) : minimum - 960px w</li>
            <li>• Not Visible on Mobile Devicesj </li>
          </ul>
          <p className="text-warning text-14px">
            Not Optimized for Every Screen Size
          </p>
        </div>
      </Flexrow>
    );
  }

  return (
    <>
      <Flexrow className="bg-dark-a0 !text-slate-a1 justify-center">
        {/** ----- Main Body ---- */}
        <Flexcol className="h-screen max-w-[1600px] gap-2.5 p-5">
          {/** ----- Top Bar ---- */}
          <Flexrow className={cn("!text-14px w-full gap-2.5")}>
            <Flexrow
              className={cn(
                "items-center justify-start gap-2.5 rounded-sm px-4 py-0.5",
                bgDarkA3,
              )}
            >
              <Logo />
              <VerticalDevider />
              <ActiveClock />
              <VerticalDevider />
              <ActiveDate />
              <VerticalDevider />
              <PageTitle nav={nav} activeBtn={activeBtn} />
            </Flexrow>
            <Flexrow
              className={
                "bg-exp-a3 flex-1 basis-1 items-center gap-2.5 rounded-sm px-4"
              }
            >
              <GlobalFilter />
            </Flexrow>
          </Flexrow>
          {/** ----- Top Bar Ends ---- */}

          {/** ----- Middle ---- */}
          <Flexrow className="flex-1 gap-2.5">
            <Flexcol
              className={cn("w-48 gap-0.75 rounded-md px-2.5 py-2.5", bgDarkA3)}
            >
              <UserAvatar />
              <ExpButton
                custom_iconbtn
                className="!text-14px text-slate-a1 justify-start space-x-0.75 px-2 py-1"
              >
                <FaUser className="text-slate-a5" />
                <span>{username}</span>
              </ExpButton>
              <Separator
                className={
                  "bg-slate-br1 mx-auto my-2 data-[orientation=horizontal]:w-[95%]"
                }
              />
              {nav.map((n) => (
                <ExpButton
                  key={n.id}
                  custom_textbtn
                  className={cn(
                    "!text-14px font-para2-b w-full justify-start space-x-0.75 p-1 px-2",
                    selectedStyle(n.link),
                  )}
                  onClick={() => navigate(n.link)}
                >
                  <span className="text-slate-a5"> {n.icon}</span>
                  {n.name}
                </ExpButton>
              ))}
              <Flexcol className="flex-1 justify-end gap-0.5">
                <Separator
                  className={
                    "bg-slate-br1 mx-auto my-2 data-[orientation=horizontal]:w-[95%]"
                  }
                />
                <NotiBell onClick={() => setIsNotiOpen(true)} />
                <UserSettings onClick={() => navigate(PATH.setting)} />
                <UserLogout />
              </Flexcol>
            </Flexcol>

            <div className="!text-slate-1 border-dark-a3 bg-dark-a1 relative flex-1 overflow-hidden rounded-md border">
              {/* Scrollable content */}
              <div className="scrollBar absolute inset-0 z-20 overflow-y-auto">
                <div className="p-12">{children}</div>
              </div>
            </div>
          </Flexrow>
          {/** ----- Middle Ends ---- */}

          {/** ----- Bottom Bar ---- */}
          <Flexrow className={cn("!text-14px w-full gap-2.5")}>
            <BudgetBarIndicator />

            <Flexrow
              className={
                "flex-1 items-center justify-center gap-2.5 rounded-sm"
              }
            >
              <AddBudget />

              <AddExp />
              <AddInc />
            </Flexrow>
          </Flexrow>
          {/** ----- Bottom Bar Ends ---- */}
        </Flexcol>
        {/** ----- Main Body Ends ---- */}
      </Flexrow>
      {isNotiOpen && (
        <NotificationsBlock
          setIsNotiOpen={setIsNotiOpen}
          isNotiOpen={isNotiOpen}
        />
      )}
    </>
  );
}
export default Dashboard;

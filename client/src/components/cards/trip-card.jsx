import moment from "moment";
import React from "react";
import { useNavigate } from "react-router-dom";
import Flexcol from "../section/flexcol";
import ExpButton from "../buttons/exp-button";

const TripCard = ({ list }) => {
  const navigate = useNavigate();
  return (
    <>
      {list.map((trip) => (
        <>
          <Flexcol
            key={trip._id}
            className="from-gradBot to-gradTop shadow-shadowBlack border-br1 gap-3.5 rounded-lg border bg-gradient-to-t p-5 shadow-md"
          >
            <Flexrow className="text-12px">
              <Flexrow className="items-center justify-start gap-2">
                <Icons.upbar className={"text-trip"} />
                {moment(trip.startOn).format("DD MMM, YYYY")}
              </Flexrow>
              <Flexrow className="items-center justify-end gap-2">
                <Icons.upbar className={"text-trip"} />
                {moment(trip.endsOn).format("DD MMM, YYYY")}
              </Flexrow>
            </Flexrow>
            <Flexrow className={"text-18px font-para2-m items-center gap-2"}>
              <Icons.trip className={"text-trip"} />
              <span>{truncate(trip.tripTitle)}</span>
            </Flexrow>
            <Flexrow className={"text-12px"}>
              <Flexrow className={"items-center gap-1"}>
                <Icons.rupee className={"text-trip"} />
                <span>{5000}</span>
              </Flexrow>
              <Flexrow className={"w-max justify-end gap-2"}>
                <ExpButton
                  className={"bg-trip"}
                  custom_textbtn
                  onClick={() => navigate(trip._id)}
                ></ExpButton>
                <ExpButton
                  className={"bg-trip"}
                  custom_textbtn
                  onClick={() => navigate(trip._id)}
                ></ExpButton>
              </Flexrow>
            </Flexrow>
          </Flexcol>
        </>
      ))}
    </>
  );
};

export default TripCard;

const truncate = (str) => (str.length > 24 ? str.slice(0, 24) + "..." : str);

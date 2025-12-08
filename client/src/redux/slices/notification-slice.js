import { PaymentStatus } from "@/global/globalVariables.js";
import { amountFloat } from "@/components/utilityFilter.js";
import { createSelector, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { ArrayCheck } from "@/components/utility";

const initialState = {
  RecurringNotifications: [],
  RecurringDataHash: null,
  TripNotifications: null,
};

const notifications = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    createRecurringNotifications: (state, action) => {
      const rec = action.payload ?? [];
     

      state.RecurringNotifications = rec
        .map((r) => createNewRecNoti(r))
        .filter(Boolean);
      
    },
    addRecurringNotification: (state, action) => {
      const newNoti = createNewRecNoti(action.payload);
      if (newNoti) state.RecurringNotifications.push(newNoti);
    },
    updateRecurringNotifications: (state, action) => {
      const newRec = action.payload;
      const index = state.RecurringNotifications.findIndex(
        (r) => r.id === String(newRec._id),
      );
      if (index > -1) {
        state.RecurringNotifications[index] = createNewRecNoti(newRec);
      }
    },

    setReccuringDataHash: (state, action) => {
      state.RecurringDataHash = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export default notifications.reducer;
export const {
  setReccuringDataHash,
  createRecurringNotifications,
  addRecurringNotification,
  updateRecurringNotifications,
  fetchRecurringNotifications,
} = notifications.actions;

function dateForThisMonthFromIso(isoDate) {
  if (!isoDate) return null;
  const day = moment(isoDate).date(); // day-of-month number
  const now = moment();
  const daysThisMonth = now.daysInMonth();
  const clampedDay = Math.min(day, daysThisMonth);
  return moment(now).date(clampedDay).startOf("day");
}

export const createNewRecNoti = (r) => {
  /**
    isReccuringBy === 1 #monthly
    isReccuringBy === 2 #yearly
  */
  const today = moment().startOf("day");

  if (r.isReccuringStatus === PaymentStatus.PAID) return null;

  // build "this month" equivalents using only day-of-month
  const onDateThisMonth = dateForThisMonthFromIso(r.onDate);
  const lastPaymentThisMonth = dateForThisMonthFromIso(r.lastPaymentDate);

  // if we couldn't build dates fallback to original behavior but startOf day
  const onDate = onDateThisMonth ?? moment(r.onDate).startOf("day");
  const lastDate =
    lastPaymentThisMonth ?? moment(r.lastPaymentDate).startOf("day");

  // compute diffs in days relative to today
  const upcomingIn = Math.max(onDate.diff(today, "days"), 0);
  const dueIn = Math.max(lastDate.diff(today, "days"), 0);
  const overdue = today.isAfter(lastDate, "day");

  let message = null;
  let type = null;

  // notification for same day payment (based on day-of-month equivalence)
  if (onDate.isSame(lastDate, "day")) {
    // upcoming: reminder 5..1 days before
    if (upcomingIn <= 5 && upcomingIn >= 1) {
      type = PaymentStatus.UPCOMING;
      message = `${r.subCategory} Payment of ${amountFloat(r.ofAmount)} is Upcoming in ${upcomingIn} days`;
    }
    // due today
    else if (upcomingIn === 0) {
      type = PaymentStatus.DUE;
      message = `${r.subCategory} Payment of ${amountFloat(r.ofAmount)} is Due Today`;
    }
    // overdue
    else if (overdue) {
      type = PaymentStatus.OVERDUE;
      message = `${r.subCategory} Payment of ${amountFloat(r.ofAmount)} is OverDue`;
    }
  } else {
    // grace period: upcoming 2..1 days before
    if (upcomingIn <= 2 && upcomingIn >= 1) {
      type = PaymentStatus.UPCOMING;
      message = `${r.subCategory} Payment of ${amountFloat(r.ofAmount)} is Upcoming in ${upcomingIn} days`;
    }
    // due: notify until last payment date
    else if (upcomingIn === 0) {
      type = PaymentStatus.DUE;
      if (dueIn === 0) {
        message = `${r.subCategory} Payment of ${amountFloat(r.ofAmount)} is Due Today`;
      } else {
        message = `${r.subCategory} Payment of ${amountFloat(r.ofAmount)} is Due in ${dueIn} days`;
      }
    }
    // overdue
    else if (overdue) {
      type = PaymentStatus.OVERDUE;
      message = `${r.subCategory} Payment of ${amountFloat(r.ofAmount)} is OverDue`;
    }
  }

  return {
    id: r._id.toString(),
    message,
    status: type,
    onDate: r.onDate,
    lastDate: r.lastPaymentDate,
    reccurBy: r.isReccuringBy,
  };
};

// ====================================================================
// ? ++ MEMOIZED SELECTORS for Notifications ++
// ====================================================================

const selectNotificationState = (state) => state.notifications;

export const selectNotifications = createSelector(
  [selectNotificationState],
  (noti) => ArrayCheck(noti.RecurringNotifications) || [],
);

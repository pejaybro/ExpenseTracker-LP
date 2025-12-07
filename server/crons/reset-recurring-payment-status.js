import cron from "node-cron";
import { recurringExpModal } from "../models/transaction-modal.js";
import moment from "moment";

cron.schedule(
  "0 0 0 1 * *",
  async () => {
    try {
      const MonthlyReset = await recurringExpModal.updateMany(
        { isReccuringStatus: 0, isReccuringBy: 1 },
        { $set: { isReccuringStatus: 1 } }
      );
      if (MonthlyReset.modifiedCount > 0)
        console.log(
          `[CRON] Monthly Reset: ${MonthlyReset.modifiedCount} records updated.`
        );

      const currentMonth = moment().month() + 1;
      const YearlyReset = await recurringExpModal.updateMany(
        {
          $expr: {
            $and: [
              { $eq: ["$isReccuringStatus", 0] },
              { $eq: ["$isReccuringBy", 2] }, // yearly
              { $eq: [{ $month: "$onDate" }, currentMonth] }, // only match same month
            ],
          },
        },
        { $set: { isReccuringStatus: 1 } }
      );
      if (YearlyReset.modifiedCount > 0)
        console.log(
          `✅ [CRON] Yearly Reset: ${YearlyReset.modifiedCount} records updated.`
        );
    } catch (error) {
      console.error("[CRON] Recurring Reset Failed:", error);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

console.log("Cron job registered: reset-recurring-payment-status");

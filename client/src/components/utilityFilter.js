import moment from "moment";
import numeral from "numeral";

export const sortByDateOldest = (list) =>
  list.sort((prev, next) => moment(prev.onDate) - moment(next.onDate));

export const sortByDateNewest = (list) =>
  list.sort((prev, next) => moment(next.onDate) - moment(prev.onDate));

export const filterByExpense = (list) =>
  list?.filter((items) => items.isTypeExpense === true) ?? [];
export const filterByIncome = (list) =>
  list?.filter((items) => items.isTypeExpense === false) ?? [];
export const filterByYear = (list, year) =>
  list?.filter((l) => l.year === year) ?? [];

export const amountFloat = (amount) =>
  numeral(Math.abs(amount)).format("00,00,000.[000]");
export const amountSignedFloat = (amount) =>
  numeral(amount).format("00,00.[000]");
export const amountInteger = (amount) => numeral(amount).format("00,00");
export const percentSigned = (amount) => numeral(amount).format("+00.[00]");
export const percentUnSigned = (amount) => numeral(amount).format("00.[00]");

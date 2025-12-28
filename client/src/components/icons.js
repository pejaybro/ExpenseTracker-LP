import {
  MdEventRepeat,
  MdCalculate,
  MdDelete,
  MdCancel,
  MdSpaceDashboard,
  MdFilterAlt,
  MdLocationPin,
  MdOutlineDoubleArrow,
} from "react-icons/md";
import {
  FaCalendar,
  FaCalendarCheck,
  FaCalculator,
  FaCalendarDay,
  FaCarSide,
  FaShare,
} from "react-icons/fa";
import { BsBarChartFill, BsFillSuitcase2Fill } from "react-icons/bs";

import { IoFilter, IoAddCircle, IoWarning } from "react-icons/io5";

import { ImParagraphLeft } from "react-icons/im";
import { GiPayMoney, GiTakeMyMoney, GiReceiveMoney } from "react-icons/gi";
import {
  FaArrowTrendDown,
  FaArrowTrendUp,
  FaIndianRupeeSign,
  FaRegWindowMaximize,
  FaPlaneDeparture,
  FaUserGroup,
} from "react-icons/fa6";

import {
  BiSolidLabel,
  BiSort,
  BiSortDown,
  BiSortUp,
  BiCheck,
  BiSolidCalendarEdit,
  BiSolidCalendarPlus,
  BiReset,
} from "react-icons/bi";
import { RiShareForwardFill } from "react-icons/ri";
import { HiPencil } from "react-icons/hi";
import { TbCancel, TbPlaylistAdd, TbTargetArrow } from "react-icons/tb";

import { CgAdd } from "react-icons/cg";

import {
  IoIosCheckmarkCircle,
  IoMdEye,
  IoIosArrowForward,
  IoIosArrowBack,
  IoMdAdd,
} from "react-icons/io";

import {
  RiDeleteBin5Fill,
  RiEdit2Fill,
  RiGlobalFill,
  RiEyeFill,
  RiEyeOffFill,
} from "react-icons/ri";
import { PiListFill, PiHandPeaceFill } from "react-icons/pi";

export const Icons = {
  analysis: MdCalculate,
  window: FaRegWindowMaximize,
  yearCal: FaCalendar,
  monthCal: FaCalendarCheck,
  dayCal: FaCalendarDay,
  upbar: BsBarChartFill,
  rupee: FaIndianRupeeSign,
  filter: IoFilter,
  calc: FaCalculator,
  textline: ImParagraphLeft,
  graphup: FaArrowTrendUp,
  graphdown: FaArrowTrendDown,
  expense: GiPayMoney,
  income: GiReceiveMoney,
  formlabel: BiSolidLabel,
  asc: BiSortUp,
  desc: BiSortDown,

  check: BiCheck,
  repeat: MdEventRepeat,
  pencil: HiPencil,
  caledit: BiSolidCalendarEdit,
  calnew: BiSolidCalendarPlus,
  money: GiTakeMyMoney,
  share: RiShareForwardFill,
  addCircle: IoAddCircle,
  cancel: TbCancel,
  checkCircle: IoIosCheckmarkCircle,
  view: IoMdEye,
  del: MdDelete,
  toDelete: MdDelete,
  gotoPage: FaShare,
  pageNext: IoIosArrowForward,
  pageBack: IoIosArrowBack,
  cross: MdCancel,
  calander_date: FaCalendarDay,
  dashbaord: MdSpaceDashboard,
  add_circle: CgAdd,
  add_plus: IoMdAdd,
  add_list: TbPlaylistAdd,
  delete_bin: RiDeleteBin5Fill,
  edit: RiEdit2Fill,
  trip_abroad: FaPlaneDeparture,
  trip_domestic: FaCarSide,
  trip: BsFillSuitcase2Fill,
  list_reset: BiReset,
  list_order: BiSort,
  filter_list: PiListFill,
  filter_global: RiGlobalFill,
  filter_funnel: MdFilterAlt,
  goal: TbTargetArrow,
  handPeace: PiHandPeaceFill,
  warning: IoWarning,
  location: MdLocationPin,
  people_group: FaUserGroup,
  double_arrow_right: MdOutlineDoubleArrow,
  eye_open: RiEyeFill,
  eye_close: RiEyeOffFill,
};

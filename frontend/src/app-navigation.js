import { HOME, USER_LIST, ATTENDANCE, MARK_SHEET } from "./utils/pages-routes";

export const navigation = [
  {
    text: "Home",
    path: HOME,
    icon: "home",
  },
  {
    icon: "doc",
    text: "Mark-Sheet",
    path: MARK_SHEET,
  },
  {
    icon: "clock",
    text: "Student",
    path: ATTENDANCE,
  },
  {
    icon: "detailslayout",
    text: "User List",
    path: USER_LIST,
  },
];

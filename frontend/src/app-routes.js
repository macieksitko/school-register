import { withNavigationWatcher } from "./contexts/navigation";
import { HomePage, AttendancePage, ProfilePage, MarkSheetPage, UserList } from "./pages";
import SubjectList from "./pages/subject-list/subject-list";
// import { ATTENDANCE, HOME, MARK_SHEET, PROFILE, USER_LIST } from "./utils/app-routes";
import { TEACHER, ADMIN, STUDENT } from "./utils/user-roles";

export const ATTENDANCE = "/attendance";
export const PROFILE = "/profile";
export const MARK_SHEET = "/mark-sheet";
export const HOME = "/home";
export const USER_LIST = "/user-list";
export const SUBJECT_LIST = "/subject-list";

export const getRoutesForRole = (role) => {
  let defaultRoutes = [PROFILE, HOME];

  switch (role) {
    case TEACHER:
      return [...defaultRoutes, MARK_SHEET];
    case ADMIN:
      return [...defaultRoutes, USER_LIST, SUBJECT_LIST];
    case STUDENT:
      return [...defaultRoutes, ATTENDANCE];
    default:
      return defaultRoutes;
  }
};

export const sideBarNavigation = [
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
  {
    icon: "detailslayout",
    text: "Subject List",
    path: SUBJECT_LIST,
  },
];

const routes = [
  {
    path: ATTENDANCE,
    component: AttendancePage,
  },
  {
    path: PROFILE,
    component: ProfilePage,
  },
  {
    path: MARK_SHEET,
    component: MarkSheetPage,
  },
  {
    path: HOME,
    component: HomePage,
  },
  {
    path: USER_LIST,
    component: UserList,
  },
  {
    path: SUBJECT_LIST,
    component: SubjectList,
  },
];

export default routes.map((route) => {
  return {
    ...route,
    component: withNavigationWatcher(route.component),
  };
});

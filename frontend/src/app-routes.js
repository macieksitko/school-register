import { withNavigationWatcher } from "./contexts/navigation";
import { HomePage, AttendancePage, ProfilePage, MarkSheetPage, UserList } from "./pages";
import { ATTENDANCE, HOME, MARK_SHEET, PROFILE, USER_LIST } from "./utils/pages-routes";

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
];

export default routes.map((route) => {
  return {
    ...route,
    component: withNavigationWatcher(route.component),
  };
});

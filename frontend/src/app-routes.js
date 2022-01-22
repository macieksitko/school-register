import { withNavigationWatcher } from "./contexts/navigation";
import { HomePage, AttendancePage, ProfilePage, MarkSheetPage, UserList } from "./pages";

const routes = [
  {
    path: "/attendance",
    component: AttendancePage,
  },
  {
    path: "/profile",
    component: ProfilePage,
  },
  {
    path: "/mark-sheet",
    component: MarkSheetPage,
  },
  {
    path: "/home",
    component: HomePage,
  },
  {
    path: "/userlist",
    component: UserList,
  },
];

export default routes.map((route) => {
  return {
    ...route,
    component: withNavigationWatcher(route.component),
  };
});

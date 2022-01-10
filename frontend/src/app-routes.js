import { withNavigationWatcher } from "./contexts/navigation";
import { HomePage, AttendancePage, ProfilePage, MarkSheetPage } from "./pages";

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
];

export default routes.map((route) => {
  return {
    ...route,
    component: withNavigationWatcher(route.component),
  };
});

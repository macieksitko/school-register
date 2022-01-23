import { TEACHER, ADMIN, STUDENT } from "./user-roles";

export const ATTENDANCE = "/attendance";
export const PROFILE = "/profile";
export const MARK_SHEET = "/mark-sheet";
export const HOME = "/home";
export const USER_LIST = "/user-list";

export const getRoutesForRole = (role) => {
  let defaultRoutes = [PROFILE, HOME];

  switch (role) {
    case TEACHER:
      return [...defaultRoutes, MARK_SHEET];
    case ADMIN:
      return [...defaultRoutes, USER_LIST];
    case STUDENT:
      return [...defaultRoutes, ATTENDANCE];
    default:
      return defaultRoutes;
  }
};

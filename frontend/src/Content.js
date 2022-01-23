import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import appInfo from "./app-info";
import routes from "./app-routes";
import { SideNavOuterToolbar as SideNavBarLayout } from "./layouts";
import { Footer } from "./components";
import { HOME } from "./app-routes";
import { useAuth } from "./contexts/auth";

export default function Content() {
  const { routes: userRoutes } = useAuth();

  return (
    <SideNavBarLayout title={appInfo.title}>
      <Switch>
        {routes
          .filter(({ path }) => userRoutes.includes(path))
          .map(({ path, component }) => (
            <Route exact key={path} path={path} component={component} />
          ))}
        <Redirect to={HOME} />
      </Switch>
      <Footer>
        Copyright © {new Date().getFullYear()} {appInfo.title} Inc.
        <br />
        All trademarks or registered trademarks are property of their respective owners.
      </Footer>
    </SideNavBarLayout>
  );
}

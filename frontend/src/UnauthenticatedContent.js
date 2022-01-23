import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { SingleCard } from "./layouts";
import { LoginForm } from "./components";
import { LOGIN } from "./app-routes";

export default function UnauthenticatedContent() {
  return (
    <Switch>
      <Route exact path={LOGIN}>
        <SingleCard title="School register" icon="key">
          <p>Please sign in to continue!</p>
          <LoginForm />
        </SingleCard>
      </Route>
      <Redirect to={LOGIN} />
    </Switch>
  );
}

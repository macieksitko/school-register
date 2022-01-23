import React, { useState, useRef, useCallback } from "react";
import Form, { Item, Label, ButtonItem, ButtonOptions, RequiredRule } from "devextreme-react/form";
import LoadIndicator from "devextreme-react/load-indicator";
import notify from "devextreme/ui/notify";
import { useAuth } from "../../contexts/auth";

import "./login-form.scss";

export default function LoginForm() {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const formData = useRef({});

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const { email, password } = formData.current;
      setLoading(true);

      const result = await signIn(email, password);
      if (!result?.access_token) {
        setLoading(false);
        notify("Wrong credentials", "error", 2000);
      } else {
        notify("Hi: " + result?.user?.username, "success", 2000);
      }
    },
    [signIn]
  );

  return (
    <form className={"login-form"} onSubmit={onSubmit}>
      <Form formData={formData.current} disabled={loading}>
        <Item dataField={"email"} editorType={"dxTextBox"} editorOptions={emailEditorOptions}>
          <RequiredRule message="Email is required" />
          <Label visible={false} />
        </Item>
        <Item dataField={"password"} editorType={"dxTextBox"} editorOptions={passwordEditorOptions}>
          <RequiredRule message="Password is required" />
          <Label visible={false} />
        </Item>
        <ButtonItem>
          <ButtonOptions width={"100%"} type={"default"} useSubmitBehavior={true}>
            <span className="dx-button-text">
              {loading ? (
                <LoadIndicator width={"24px"} height={"24px"} visible={true} />
              ) : (
                "Sign In"
              )}
            </span>
          </ButtonOptions>
        </ButtonItem>
      </Form>
    </form>
  );
}

const emailEditorOptions = { stylingMode: "filled", placeholder: "Email" };
const passwordEditorOptions = { stylingMode: "filled", placeholder: "Password", mode: "password" };

import "../assests/css/App.css";
// eslint-disable-next-line no-unused-vars
import React, { useEffect } from "react";
import AppRoutes from "./AppRoutes";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
  useIsAuthenticated,
} from "@azure/msal-react";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { UserProvider } from "../providers/UserContext";
import { loginRequest } from "../authConfig";
import { TokenProvider } from "../providers/TokenProvider";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

const App = () => {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const { i18n } = useTranslation();
  useEffect(() => {
    const handleRedirect = async () => {
      try {
        await instance.initialize();
        const response = await instance.handleRedirectPromise();
        if (response !== null) {
          const account = response.account;
          instance.setActiveAccount(account);
        } else {
          const currentAccount = instance.getActiveAccount();
          if (!currentAccount) {
            await instance.loginRedirect(loginRequest);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    handleRedirect();
  }, [instance]);

  return (
    <div>
      <AuthenticatedTemplate>
        {isAuthenticated && (
          <TokenProvider>
            <UserProvider>
              <FluentProvider
                theme={webLightTheme}
                className={classNames("fluentProvider", i18n.dir())}
              >
                <AppRoutes test-id="routes" />
              </FluentProvider>
            </UserProvider>
          </TokenProvider>
        )}
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <span> Signing you in...</span>
      </UnauthenticatedTemplate>
    </div>
  );
};

export default App;

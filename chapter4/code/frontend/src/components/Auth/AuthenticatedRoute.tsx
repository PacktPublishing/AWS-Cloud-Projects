import React from "react";
import {
  withAuthenticator,
  WithAuthenticatorProps,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

interface AuthenticatedRouteProps extends WithAuthenticatorProps {
  children: React.ReactNode;
}

const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({
  children,
}) => {
  return <>{children}</>;
};

export default withAuthenticator(AuthenticatedRoute, {
  hideSignUp: true,
});

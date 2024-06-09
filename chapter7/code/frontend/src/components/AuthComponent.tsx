import {
  withAuthenticator,
  WithAuthenticatorProps,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

interface AuthComponentProps extends WithAuthenticatorProps {
  children: React.ReactNode;
}

const AuthComponent: React.FC<AuthComponentProps> = ({ children }) => {
  return <>{children}</>;
};

export default withAuthenticator(AuthComponent, {
  hideSignUp: true,
});

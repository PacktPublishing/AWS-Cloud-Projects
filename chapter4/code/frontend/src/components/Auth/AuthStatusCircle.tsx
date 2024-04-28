import React from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { Typography, Tooltip } from "@mui/material";
import { fetchAuthSession } from "aws-amplify/auth";

const AuthStatusCircle: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [accessToken, setAccessToken] = React.useState("");

  async function fetchAccessToken() {
    try {
      const { accessToken } = (await fetchAuthSession()).tokens ?? {};
      setAccessToken(String(accessToken));
    } catch (err) {
      console.log(err);
      setAccessToken("");
    }
  }

  React.useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const user = await getCurrentUser();
        setIsAuthenticated(true);
        setUsername(user.username);
        fetchAccessToken();
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  const isAdminPage = location.pathname.includes("/admin");

  return (
    <>
      <div
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          backgroundColor: isAuthenticated ? "green" : "red",
        }}
      />

      {isAuthenticated ? (
        <>
          <Typography variant="body1" mr={2}>
            Status: Authenticated as{" "}
            <span style={{ fontWeight: "bold" }}>{username}</span>
          </Typography>
          {isAdminPage && (
            <Tooltip title={accessToken}>
              <Typography variant="body1" mr={2}>
                Access Token: {accessToken.slice(0, 10)}...
              </Typography>
            </Tooltip>
          )}
        </>
      ) : (
        <Typography variant="body1" mr={2}>
          Status: Not Authenticated
        </Typography>
      )}
    </>
  );
};

export default AuthStatusCircle;

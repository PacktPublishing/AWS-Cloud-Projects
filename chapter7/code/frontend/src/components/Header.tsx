import { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signOut, getCurrentUser } from "aws-amplify/auth";

const Header = () => {
  const navigate = useNavigate();
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    checkAuthState();
  }, []);



  const checkAuthState = async () => {
    try {
      await getCurrentUser();
      setIsSignedIn(true);
    } catch (error) {
      setIsSignedIn(false);
    }
  };

  async function handleSignOut() {
    try {
      await signOut();
      setIsSignedIn(false);
      navigate("/");
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

  const handleSignInOut = () => {
    if (isSignedIn) {
      handleSignOut();
    } else {
      navigate("/admin");
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Chapter 7 - Meety the Chatbot
        </Typography>
        <Button color="inherit" onClick={handleSignInOut}>
          {isSignedIn ? "Sign Out" : "Sign In"}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

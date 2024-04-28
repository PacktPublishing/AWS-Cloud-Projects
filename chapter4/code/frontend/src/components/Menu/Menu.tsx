import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { menuDetails } from "./menuDetails";
import { useNavigate } from "react-router-dom";
import AuthStatusCircle from "../Auth/AuthStatusCircle";

const Navbar = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        borderColor: "rgb(91,146,194)",
      }}
    >
      <AuthStatusCircle />
      <Tabs value={value} onChange={handleChange} centered>
        {menuDetails.map((obj) => (
          <Tab
            className="btn btn-primary"
            sx={{
              width: "50%",
              color: "rgb(91,146,194)",
              borderColor: "rgb(91,146,194)",
              border: 2,
            }}
            key={obj.id}
            label={obj.label}
            onClick={() => navigate(obj.route)}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default Navbar;

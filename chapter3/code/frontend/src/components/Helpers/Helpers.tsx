import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Paper, Link } from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

export const IconLink = () => {
  const navigate = useNavigate();

  return (
    <Link
      component="button"
      variant="body2"
      sx={{ float: "right" }}
      onClick={() => {
        navigate(-1);
      }}
    >
      <ArrowBackOutlinedIcon fontSize="large" color="primary" />
      <p>Return to previous page</p>
    </Link>
  );
};
//Item is not used anywhere

export const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

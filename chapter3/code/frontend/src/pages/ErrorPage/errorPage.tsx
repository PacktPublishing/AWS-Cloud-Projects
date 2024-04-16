import { Grid, Typography } from "@mui/material";
import { useRouteError } from "react-router-dom";
import { IconLink } from "../../components/Helpers/Helpers";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}></Grid>
      <Grid item xs={4} justifyContent="center">
        <Typography align="center" variant="h5">
          Page not found
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <IconLink />
      </Grid>
    </Grid>
  );
}

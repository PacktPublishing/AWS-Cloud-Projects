import MeetingCalendar from "../components/MeetingCalendar";
import ListPendingMeetings from "../components/ListPendingMeetings";
import { useState } from "react";
import {  Box, Typography } from "@mui/material";
const AdminPage = () => {
  const [meetingsUpdated, setMeetingsUpdated] = useState(false);

  const handleMeetingsUpdate = () => {
    setMeetingsUpdated(!meetingsUpdated);
  };

  return (
    <div>
      <Box mb={2}>
        <Typography variant="h4" gutterBottom>
          Meetings Calendar
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Here, you can manage meeting requests and view accepted meetings in the calendar.
        </Typography>
      </Box>
      <MeetingCalendar meetingsUpdated={meetingsUpdated} />
      <ListPendingMeetings onMeetingsUpdate={handleMeetingsUpdate} />
    </div>
  );
};

export default AdminPage;

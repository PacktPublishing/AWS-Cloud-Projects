import { useState, useEffect } from "react";
import { Meeting } from "../types/types";
import { API_URL } from "../configs/configs";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";

import WarningIcon from "@mui/icons-material/Warning";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { fetchAuthSession } from "aws-amplify/auth";
interface ListPendingMeetingsProps {
  onMeetingsUpdate: () => void;
}

const ListPendingMeetings = ({
  onMeetingsUpdate,
}: ListPendingMeetingsProps) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const { accessToken } = (await fetchAuthSession()).tokens ?? {};

      // Set the Authorization header with the access token
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
        const response = await axios.get(`${API_URL}/pending`,config);
        setMeetings(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching meetings:", error);
        setIsLoading(false);
      }
    };

    fetchMeetings();
  }, []);



  
  const handleApprove = async (meetingId: string) => {
    try {
      const { accessToken } = (await fetchAuthSession()).tokens ?? {};
      

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
      await axios.put(`${API_URL}/status`, {
        meetingId,
        newStatus: "approved",
      }, config);

      setMeetings((prevMeetings) =>
        prevMeetings.filter((meeting) => meeting.meetingId !== meetingId)
      );
      onMeetingsUpdate();
    } catch (error) {
      console.error("Error approving meeting:", error);
    }
  };

  const handleReject = async (meetingId: string) => {
    try {
      const { accessToken } = (await fetchAuthSession()).tokens ?? {};

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
      
    await axios.put(`${API_URL}/status`, {
        meetingId,
        newStatus: "rejected",
      },config);
    
      setMeetings((prevMeetings) =>
        prevMeetings.filter((meeting) => meeting.meetingId !== meetingId)
      );
      onMeetingsUpdate();
    } catch (error) {
      console.error("Error rejecting meeting:", error);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Pending Meetings
      </Typography>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Attendee</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {meetings.map((meeting) => (
                <TableRow key={meeting.meetingId}>
                  <TableCell>{meeting.date}</TableCell>
                  <TableCell>{meeting.startTime}</TableCell>
                  <TableCell>{meeting.endTime}</TableCell>
                  <TableCell>{meeting.duration}</TableCell>
                  <TableCell>{meeting.attendeeName}</TableCell>
                  <TableCell>{meeting.email}</TableCell>
                  <TableCell>{meeting.status}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleApprove(meeting.meetingId)}
                      color="primary"
                      aria-label="Approve"
                    >
                      <CheckIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleReject(meeting.meetingId)}
                      color="secondary"
                      aria-label="Reject"
                    >
                      <CloseIcon />
                    </IconButton>
                    {meeting.isConflict ? (
                      <Tooltip title="There is already a meeting scheduled for this time">
                        <IconButton color="warning" aria-label="Warning">
                          <WarningIcon />
                        </IconButton>
                      </Tooltip>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default ListPendingMeetings;

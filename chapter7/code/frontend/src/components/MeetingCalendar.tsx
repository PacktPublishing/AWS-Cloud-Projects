import { useState, useEffect } from "react";
import { Calendar, Views, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { CircularProgress, Typography } from "@mui/material";
import { Meeting, Event } from "../types/types";
import { API_URL } from "../configs/configs";
import { fetchAuthSession } from "aws-amplify/auth";
const localizer = momentLocalizer(moment);

interface MeetingCalendarProps {
  meetingsUpdated: boolean;
}

const MeetingCalendar = ({ meetingsUpdated }: MeetingCalendarProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [viewType, setViewType] = useState<View>("month");

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const { accessToken } = (await fetchAuthSession()).tokens ?? {};
      
        const startDate = getStartOfView(viewType, viewDate);
        const endDate = getEndOfView(viewType, viewDate);
        
        const response = await axios.get(`${API_URL}/meetings`, {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const approvedMeetings: Meeting[] = response.data;
        const formattedEvents: Event[] = approvedMeetings.map(
          (meeting: Meeting) => ({
            title: `Meeting with ${meeting.attendeeName}`,
            start: new Date(`${meeting.date}T${meeting.startTime}`),
            end: new Date(`${meeting.date}T${meeting.endTime}`),
          })
        );
        setEvents(formattedEvents);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching meetings:", error);
        setIsLoading(false);
      }
    };

    fetchMeetings();
  }, [viewType, viewDate, meetingsUpdated]);

  const getStartOfView = (viewType: View, date: Date) => {
    switch (viewType) {
      case "month":
        return moment(date).startOf("month").toDate();
      case "week":
        return moment(date).startOf("week").toDate();
      case "day":
        return moment(date).startOf("day").toDate();
      default:
        return date;
    }
  };

  const getEndOfView = (viewType: View, date: Date) => {
    switch (viewType) {
      case "month":
        return moment(date).endOf("month").toDate();
      case "week":
        return moment(date).endOf("week").toDate();
      case "day":
        return moment(date).endOf("day").toDate();
      default:
        return date;
    }
  };

  const handleViewChange = (view: View) => {
    setViewType(view);
  };

  const handleNavigate = (newDate: Date) => {
    setViewDate(newDate);
  };

  return (
    <div>
      
      <Typography variant="h4" gutterBottom>
        Meetings Calendar
      </Typography>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          onView={handleViewChange}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
};

export default MeetingCalendar;

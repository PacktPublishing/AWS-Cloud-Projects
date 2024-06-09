export type Meeting = {
  meetingId: string;
  startTime: string;
  endTime: string;
  duration: number;
  attendeeName: string;
  email: string;
  status: string;
  date: string;
  isConflict: boolean;
};

export type Event = {
  title: string;
  start: Date;
  end: Date;
};

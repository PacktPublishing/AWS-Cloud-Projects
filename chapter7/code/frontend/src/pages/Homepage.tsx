import React from "react";
import "./HomePage.css";
import Chatbot from "../components/Chatbot";
import { Typography, Container, Box } from "@mui/material";

const HomePage: React.FC = () => {
  return (
    <div className="home-container">
      <Container maxWidth="md" className="home-content">
        <Typography variant="h3" gutterBottom>
          Hello! Meet ... Meety!
        </Typography>
        <Box mt={4}>
          <img
            src="https://media.giphy.com/media/136WBMmq4SVDAk/giphy.gif"
            alt="Funny GIF"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Box>
        <Typography variant="body1" gutterBottom>
          Scheduling meetings can be a real hassle, with back-and-forth emails,
          conflicting schedules, and endless coordination.
        </Typography>
        <Typography variant="body1" gutterBottom>
          That's where Meety comes in! Our friendly chatbot is here to make your
          life easier by handling all your meeting scheduling needs. With Meety,
          you can quickly find available time slots, send meeting invites, and
          keep track of your appointments – all in one convenient place.
        </Typography>
      </Container>
      <Chatbot />
    </div>
  );
};

export default HomePage;

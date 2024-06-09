import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";
import axios from 'axios';
import { API_URL } from "../configs/configs";

import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";

interface Message {
  text: string;
  sender: "bot" | "user";
}

const Chatbot: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasOlderMessages, setHasOlderMessages] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);
  const lastMessageRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (listRef.current) {
      const isAtTop = listRef.current.scrollTop === 0;
      setHasOlderMessages(!isAtTop);

      listRef.current.scrollTop = listRef.current.scrollHeight;
    }

    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages([...messages, { text: message, sender: "user" }]);
        try {
          const response = await axios.post(`${API_URL}/chatbot`, { message });
          if (response.status === 200) {
            const botResponse = response.data.botResponse;
            setMessages([
              ...messages,
              { text: message, sender: "user" },
              { text: botResponse, sender: "bot" },
            ]);
          } else {
            console.error('Error:', response.status);
          }
        } catch (error) {
          console.error('Error:', error);
        }
    
        setMessage("");
      }
    };

  return (
    <>
      <Fab
        className="chatbot-icon"
        color="primary"
        aria-label="chat"
        size="large"
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
        }}
        onClick={handleOpen}
      >
        <ChatIcon fontSize="large" />
      </Fab>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>🐧 Chatbot</DialogTitle>
        <DialogContent>
          <List className="message-list" dense>
            {hasOlderMessages && (
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="textSecondary">
                      ⋯ Scroll for older messages
                    </Typography>
                  }
                />
              </ListItem>
            )}
          {messages.map((msg, index) => (
            <ListItem
              key={index}
              ref={index === messages.length - 1 ? lastMessageRef : null}
              className={msg.sender === "user" ? "user-message" : "bot-message"}
            >
              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    color={msg.sender === "bot" ? "primary" : "textPrimary"}
                  >
                    {msg.text}
                  </Typography>
                }
              />
            </ListItem>
          ))}
          </List>
          <form onSubmit={handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              label="Message"
              type="text"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button type="submit" variant="contained" color="primary">
              Send
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Chatbot;

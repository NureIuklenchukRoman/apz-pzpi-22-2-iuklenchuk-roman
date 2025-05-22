import { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import api from '../../services/api';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    // Set up polling for new messages
    const interval = setInterval(fetchMessages, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await api.get('/messages/');
      setMessages(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    setError('');

    try {
      await api.post('/messages/', { content: newMessage });
      setNewMessage('');
      fetchMessages(); // Refresh messages after sending
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Messages
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3, maxHeight: '60vh', overflow: 'auto' }}>
        <List>
          {messages.map((message, index) => (
            <div key={message.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar src={message.senderAvatar}>
                    {message.senderName.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography component="span" variant="subtitle1">
                      {message.senderName}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        sx={{ display: 'block' }}
                      >
                        {message.content}
                      </Typography>
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                      >
                        {formatTimestamp(message.timestamp)}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < messages.length - 1 && <Divider variant="inset" component="li" />}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Paper>

      <Paper component="form" onSubmit={handleSendMessage} sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={sending}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={sending || !newMessage.trim()}
            endIcon={<SendIcon />}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Messages; 
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatBubble from './components/ChatBubble';

const App = ({ showSendButton = true, showUploadButton = true, showClearButton = true }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const saveMessageToStorage = (messageObj) => {
    const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];
    localStorage.setItem('messages', JSON.stringify([...storedMessages, messageObj]));
  };

  const sendMessage = async () => {
    try {
      if (uploading) return;
      const newMessage = { text: message, sender: 'user', save: true };

      if (newMessage.save) {
        saveMessageToStorage(newMessage);
      }

      setMessages((prevMessages) => [...prevMessages, newMessage]);

      const response = await axios.post('/send_message', { message });
      if (response.data.hasOwnProperty('message')) {
        const apiMessage = { text: response.data.message, sender: 'system', save: true };

        if (apiMessage.save) {
          saveMessageToStorage(apiMessage);
        }

        setMessages((prevMessages) => [...prevMessages, apiMessage]);
      }

      setMessage('');
    } catch (error) {
      console.error(error);
      const errorMessage = { text: `Failed to send message: ${error}`, sender: 'system', save: true };

      if (errorMessage.save) {
        saveMessageToStorage(errorMessage);
      }

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  const handleFileUpload = async (e) => {
    try {
      setUploading(true);

      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = async (event) => {
        const pdfString = event.target.result;
        const fileMessage = { text: `Uploading file: ${file.name}`, sender: 'user', save: true };

        if (fileMessage.save) {
          saveMessageToStorage(fileMessage);
        }

        setMessages((prevMessages) => [...prevMessages, fileMessage]);

        const response = await axios.post('/send_message', {
          message: pdfString,
          filename: file.name,
        });

        if (response.data.hasOwnProperty('message')) {
          const apiMessage = { text: response.data.message, sender: 'system', save: true };

          if (apiMessage.save) {
            saveMessageToStorage(apiMessage);
          }

          setMessages((prevMessages) => [...prevMessages, apiMessage]);
        }

        setMessage('');
        setUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      const errorMessage = { text: `Failed to upload file: ${error}`, sender: 'system', save: true };

      if (errorMessage.save) {
        saveMessageToStorage(errorMessage);
      }

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
      setUploading(false);
    }
  };

  const clearChat = () => {
    localStorage.removeItem('messages');
    setMessages([]);
  };

  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];
    setMessages(storedMessages);
  }, []);

  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f5f5f5"
    >
      <Container maxWidth="sm">
        <Box
          height="calc(100vh - 200px)"
          bgcolor="#ffffff"
          borderRadius="4px"
          css={{ overflow: 'hidden' }}
        >
          <Box
            height="100%"
            overflow="auto"
            css={{
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#888',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#555',
              },
            }}
            ref={chatContainerRef}
          >
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="flex-end"
              padding="16px"
              borderRadius="4px"
            >
              <Typography variant="h4" align="center" mb={4}>
                ChatUI
              </Typography>
              {messages.map((message, index) => (
                <ChatBubble
                  key={index}
                  text={message.text}
                  sender={message.sender}
                  align={message.sender === 'user' ? 'right' : 'left'}
                />
              ))}
              {uploading && (
                <ChatBubble
                  text={`Uploading file...`}
                  sender="user"
                  align="right"
                />
              )}
            </Box>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" marginTop="16px">
          <TextField
            label="Type your message"
            variant="outlined"
            fullWidth
            size="small"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
            autoComplete="off"
          />
          {showSendButton && (
            <Button
              variant="contained"
              color="primary"
              onClick={sendMessage}
              disabled={!message || uploading}
              sx={{ ml: 1 }}
            >
              <SendIcon />
            </Button>
          )}
          {showUploadButton && (
            <Button
              variant="contained"
              component="label"
              disabled={uploading}
              sx={{ ml: 1 }}
            >
              <input type="file" hidden onChange={handleFileUpload} />
              <CloudUploadIcon />
            </Button>
          )}
          {showClearButton && (
            <Button
              variant="contained"
              color="secondary"
              onClick={clearChat}
              disabled={uploading}
              sx={{
                ml: 1,
                color: '#ffffff',
                backgroundColor: '#585859',
                '&:hover': {
                  backgroundColor: '#4d4d4d',
                },
              }}
            >
              <DeleteIcon />
            </Button>
          )}

          {uploading && <CircularProgress size={24} sx={{ ml: 1 }} />}
        </Box>
      </Container>
    </Box>
  );
};

export default App;

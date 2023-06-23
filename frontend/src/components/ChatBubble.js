import React from 'react';
import { Box, Typography } from '@mui/material';
import { AccountCircle, AndroidOutlined } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const BubbleContainer = styled(Box)(({ theme, isUserMessage }) => ({
  display: 'flex',
  marginBottom: '8px',
  flexDirection: isUserMessage ? 'row-reverse' : 'row',
}));

const BubbleIcon = styled(Box)(({ theme, isUserMessage }) => ({
  marginRight: isUserMessage ? '8px' : '0',
  marginLeft: isUserMessage ? '0' : '8px',
  alignSelf: 'center',
}));

const BubbleContent = styled(Box)(({ theme, isUserMessage }) => ({
  backgroundColor: isUserMessage ? '#F5F5F5' : '#DCF8C6',
  padding: '8px 16px',
  borderRadius: '4px',
  maxWidth: '70%',
  textAlign: isUserMessage ? 'right' : 'left',
  wordWrap: 'break-word',
}));

const ChatBubble = ({ text, sender }) => {
  const isUserMessage = sender === 'user';
  const bubbleIcon = isUserMessage ? <AccountCircle /> : <AndroidOutlined />;

  return (
    <BubbleContainer isUserMessage={isUserMessage}>
      <BubbleIcon isUserMessage={isUserMessage}>{bubbleIcon}</BubbleIcon>
      <BubbleContent isUserMessage={isUserMessage}>
        <Typography variant="body1">{text}</Typography>
      </BubbleContent>
    </BubbleContainer>
  );
};

export default ChatBubble;

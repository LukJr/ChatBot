import React from 'react';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser }) => {
  // Simple function to preserve line breaks
  const formattedText = message.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < message.split('\n').length - 1 && <br />}
    </React.Fragment>
  ));

  return (
    <div className={`p-4 rounded-lg mb-4 ${isUser ? 'bg-blue-100 ml-auto text-right' : 'bg-gray-100'}`} style={{ maxWidth: '80%' }}>
      <div className="font-bold mb-1">{isUser ? 'You' : 'Assistant'}</div>
      <div className="text-left text-black">
        {formattedText}
      </div>
    </div>
  );
};

export default ChatMessage; 
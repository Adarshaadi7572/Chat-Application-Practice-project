import React from 'react';
import { useNavigate } from 'react-router-dom';

function ConversationItem({conservation,lightTheme}){
  
  const Navigate = useNavigate();
  return (
    <div className='conversation-container' onClick={() => {Navigate('chat');}}> 
      <p className='con-icon'>{conservation.name[0]}</p>
      <p className='con-title'>{conservation.name}</p>
      <p className={`con-lastMessage ${lightTheme ? '' : 'text-white'}`}>{conservation.lastMessage}</p>
      <p className='con-timeStamp'>{conservation.timestamp}</p>
    </div>
  )
}
export default ConversationItem;
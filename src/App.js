import './App.css';
import React from 'react';
import gptLogo from './assets/chatgpt.svg';
import addBtn from './assets/add-30.png';
import msgIcon from './assets/message.svg';
import home from './assets/home.svg';
import saved from './assets/bookmark.svg';
import rocket from './assets/rocket.svg';
import sendBtn from './assets/send.svg';
import userIcon from './assets/user-icon.png';
import gptImgLogo from './assets/chatgptLogo.svg';
import deleteBtn from './assets/delete.svg';
// import { sendMsgToOpenApi } from './openai';
import { sendMsgToHandler } from './apiHandler';
import { useEffect, useRef, useState } from 'react';

function App() {

  const msgEnd = useRef(null);

  const [currentChatId, setCurrentChatId] = useState(null);
  const [chats, setChats] = useState({});

  // State to track if we're currently sending a message
  const [isLoading, setIsLoading] = useState(false);


  const [input, setInput] = useState("");

  useEffect(() => {
    if (msgEnd.current) {
      msgEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentChatId, chats]);

  useEffect(() => {
    // Load chats from local storage
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
  }, []);
  
  useEffect(() => {
    // Save chats to local storage
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);
  

  const handleSend = async () => {
    if (!currentChatId || isLoading) return; // No current chat selected
  
    const text = input;
    setInput("");
    setIsLoading(true);
  
    // Update the current chat's messages
    const updatedChats = { ...chats };
    updatedChats[currentChatId].messages.push({ text, isBot: false });  
    setChats(updatedChats);
  
    try {
      const res = await sendMsgToHandler(text);
      updatedChats[currentChatId].messages.push({ text: res, isBot: true });
      setChats(updatedChats);
    } catch (error) {
      console.error('Error:', error);
    }

    setIsLoading(false);
  };
  

  const handleEnter = async(e)=>{
    if(e.key === 'Enter') await handleSend();
  };

  const createNewChat = () => {
    const newChatId = Date.now().toString(); // Simple unique ID
    const newChat = {
      id: newChatId,
      title: `Chat ${Object.keys(chats).length + 1}`,
      messages: [{ text: "How can I help you today?", isBot: true }],
    };
    
    setChats({ ...chats, [newChatId]: newChat });
    setCurrentChatId(newChatId);

    // After state update, add the selected class to the new chat
    setTimeout(() => {
      addSelectedClass(newChatId);
    }, 0);

  };
  

  const deleteChat = (chatId) => {
    const updatedChats = { ...chats };
    delete updatedChats[chatId];
    setChats(updatedChats);
    
    // Set current chat to null or another chat
    if (currentChatId === chatId) {
      setCurrentChatId(null);
    }
  };
  
  function addSelectedClass(chatId) {
    // Remove 'selected' class from all elements
    document.querySelectorAll('.queryChat').forEach(chat => chat.classList.remove('selected'));
  
    // Add 'selected' class to the clicked element
    const selectedChat = document.querySelector(`.queryChat[data-id="${chatId}"]`);
    if (selectedChat) {
      selectedChat.classList.add('selected');
    }
  }

  return (
    <div className="App">
     <div className="sideBar">      
      <div className='upperSide'>
        <div className='upperSideTop'>
          <img src={gptLogo} alt='Logo' className='logo'/>
          <span className='brand'>ChatGPT</span>
        </div>
        <button className='midBtn' onClick={createNewChat}>
          <img src={addBtn} alt='new chat' className='addBtn'/>
          New Chat
        </button>
        <div className='upperSideBottom'>
        {Object.values(chats).map((chat) => (
          <div key={chat.id} data-id={chat.id} className="queryChat">
            <button key={chat.id} className='query' onClick={() => {addSelectedClass(chat.id); setCurrentChatId(chat.id)}}>
              <img src={msgIcon} alt='Query' />
              <span className="queryTitle">{chat.title}</span>
            </button>            
            <button onClick={() => deleteChat(chat.id)} className="deleteBtn">
              <img src={deleteBtn} alt='deleteBtn' />
            </button>
          </div>
        ))}
        </div>
      </div>
      <div className='lowerSide'>
        <div className='listItems'><img src={home} alt='Home' className='listItemsImg'/>Home</div>
        <div className='listItems'><img src={saved} alt='Saved' className='listItemsImg'/>Saved</div>
        <div className='listItems'><img src={rocket} alt='Update' className='listItemsImg'/>Update to pro</div>
      </div>
     </div>
     <div className="main">

      <div className='discussion'>
        {currentChatId && chats[currentChatId].messages.map((message, i) =>
          <div key={i} className={message.isBot?"chat bot":"chat"}>
            <img className='chatImg' src={message.isBot?gptImgLogo:userIcon} alt=''/>
            <p className='txt'>{message.text}</p>
          </div>
        )}
        <div ref={msgEnd}></div>
      </div>

      <div className='chatFooter'>
        <div className='inp'>
          <input type='text' 
          placeholder='Send a message' 
          value={input} on onKeyDown={handleEnter} 
          onChange={(e)=>{setInput(e.target.value)}}
          disable={isLoading}/>
          <button className='send' onClick={handleSend} disabled={isLoading}>
            {isLoading ? <span className='loading'>...</span> : <img className='sendImg' src={sendBtn} alt='Send'/>}
          </button>
        </div>
        <p>ChatGPT may produce inaccurate information about people, places or facts</p>
      </div>
      
     </div>
    </div>
  );
}

export default App;
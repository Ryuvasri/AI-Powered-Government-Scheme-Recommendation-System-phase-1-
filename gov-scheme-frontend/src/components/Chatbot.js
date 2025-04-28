import React, { useState } from "react";
import "./Chatbot.css";
import EducationQuestionnaire from './EducationQuestionnaire';
import ScholarshipDisplay from './ScholarshipDisplay'; 

const Chatbot = () => {
  const [selectedScheme, setSelectedScheme] = useState("");
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [questionnaireComplete, setQuestionnaireComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scholarshipData, setScholarshipData] = useState(null);

  const handleOptionSelect = (option) => {
    setSelectedScheme(option);
    const newMessages = [
      ...messages,
      { text: option, user: true },
    ];
    
    setMessages(newMessages);
    
    if (option === "Education") {
      setShowQuestionnaire(true);
      setMessages([
        ...newMessages,
        { text: "You selected Education. Please answer these questions to help us provide better recommendations:", user: false },
      ]);
    } else {
      setMessages([
        ...newMessages,
        { text: `You selected ${option}. Can you please specify what information you need?`, user: false },
      ]);
    }
  };

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleSendMessage = () => {
    if (userInput.trim() === "") return;

    let userMessage = userInput.trim();
    let botResponse = "";

    // Check if user manually typed a scheme name
    if (userMessage.toLowerCase() === "education") {
      setSelectedScheme("Education");
      setShowQuestionnaire(true);
      botResponse = "You selected Education. Please answer these questions to help us provide better recommendations:";
    } else if (userMessage.toLowerCase() === "healthcare") {
      setSelectedScheme("Healthcare");
      botResponse = "You selected Healthcare. Can you please specify what information you need?";
    } else if (!selectedScheme) {
      botResponse = "Please select a scheme first (Education/Healthcare).";
    } else if (selectedScheme === "Healthcare") {
      botResponse = `I will find more information about "${selectedScheme}" for you.`;
    } else if (selectedScheme === "Education" && !questionnaireComplete) {
      botResponse = "Please complete the education questionnaire first.";
    } else {
      botResponse = `Based on your answers, here's information about education schemes that might help you...`;
    }

    setMessages([...messages, { text: userMessage, user: true }, { text: botResponse, user: false }]);
    setUserInput("");
  };

  const handleQuestionnaireAnswer = (question, answer) => {
    setMessages(prev => [
      ...prev,
      { text: question, user: false }, // Show the question in chat
      { text: answer, user: true } // Show the answer in chat
    ]);
  };

  
  const handleQuestionnaireComplete = (answers, schemeResponse) => {
    setQuestionnaireComplete(true);
    setShowQuestionnaire(false);
    setIsLoading(true);
    
    // Show loading message
    setMessages(prev => [
      ...prev,
      { text: "Thank you for completing the questionnaire! Fetching recommendations...", user: false }
    ]);
    
    // Add a small delay to show loading state
    setTimeout(() => {
      // Store the API response data
      setScholarshipData(schemeResponse);
      
      // Add a simple completion message
      setMessages(prev => [
        ...prev,
        { 
          text: "Here are your scholarship recommendations based on your profile:", 
          user: false, 
          isScholarshipData: true  // Flag to identify this message
        }
      ]);
      setIsLoading(false);
    }, 1000);
  };


  return (
    <div className="chatbot-container">
      <div className="chatbot-body">
        <div className="chatbot-messages">
          {/* Greeting and Scheme Selection */}
          {!selectedScheme && messages.length === 0 && (
            <div className="message bot">
              <p>Hello! 👋 What scheme are you looking for?</p>
              <div className="chat-options">
                <button className="option-button" onClick={() => handleOptionSelect("Education")}>
                  Education
                </button>
                <button className="option-button" onClick={() => handleOptionSelect("Healthcare")}>
                  Healthcare
                </button>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.user ? "user" : "bot"}`}>
              {msg.isScholarshipData ? (
                <>
                  {msg.text}
                  <ScholarshipDisplay responseText={scholarshipData} />
                </>
              ) : (
                msg.text
              )}
            </div>
          ))}
          
          {/* Education Questionnaire */}
          {showQuestionnaire && (
            <div className="message bot">
              <EducationQuestionnaire 
                onAnswer={handleQuestionnaireAnswer}
                onComplete={handleQuestionnaireComplete}
              />
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="message bot">
              <div className="loading-spinner"></div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Input Box */}
      <div className="chatbot-input">
        <input
          type="text"
          value={userInput}
          onChange={handleUserInput}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>➤</button>
      </div>
    </div>
  );
};

export default Chatbot;

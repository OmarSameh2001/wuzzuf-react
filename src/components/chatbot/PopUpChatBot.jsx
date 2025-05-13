import { useState, useEffect, useContext } from "react"
import { X, Send, Bot, User, MessageSquare } from "lucide-react"
import { askChatBot, getQuota } from "../../services/ChatBot"
import { userContext } from "../../context/UserContext"
import ChatMessage from "./ChatMessage"
import { useQuery } from "@tanstack/react-query"

const PopupChatBot = () => {
  const { chatBot, setChatBot, user, isLight } = useContext(userContext)

  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }
  const {
    data: quota,
    error,
    isLoading: isLoadingQuota,
    refetch,
  } = useQuery({
    queryKey: ["quota", chatBot],
    queryFn:async () => {
      if(!user?.id || !chatBot) return []
      const response = await getQuota();
      return response;
    }
  });
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!input.trim()) return

    const question = input
    setInput("")
    setIsLoading(true)

    // Add user message immediately
    setMessages((prev) => [...prev, { question, response: "" }])

    try {
      const res = await askChatBot(question)
      const { answer } = res

      // Update the last message with the response
      setMessages((prev) => prev.map((msg, idx) => (idx === prev.length - 1 ? { ...msg, response: answer } : msg)))
      refetch()
    } catch (error) {
      console.error("Error:", error)
      const errorMessage = error.response?.data?.message || "An error occurred"

      // Update the last message with the error
      setMessages((prev) =>
        prev.map((msg, idx) => (idx === prev.length - 1 ? { ...msg, response: errorMessage } : msg)),
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ display: user?.id ? "block" : "none" }}>
      {/* Chat toggle button */}
      <button
        onClick={() => setChatBot(!chatBot)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          backgroundColor: "#882024",
          color: isLight ? isLight ? "white" : 'black' : "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          cursor: "pointer",
          zIndex: 999,
          transition: "transform 0.2s, background-color 0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat popup */}
      {chatBot && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "350px",
            height: "500px",
            backgroundColor: isLight ? "white" : 'black',
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
            overflow: "hidden",
            animation: "slideUp 0.3s ease-out",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px",
              borderBottom: isLight ? "1px solid #dc898c" : "1px solid #921d21",
              backgroundColor: "#882024",
              color: isLight ? "white" : 'black',
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Bot size={20} />
              <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: isLight ? "white" : 'black' }}>AI Assistant</h2>
            </div>
              <p style={{ margin: 0, fontSize: "12px", fontWeight: 400 }}>limit resets on <span style={{ fontSize: "11px" }}>{quota?.date}</span></p>
            </div>
            <button
              onClick={() => setChatBot(false)}
              style={{
                background: "none",
                border: "none",
                color: isLight ? "white" : 'black',
                cursor: "pointer",
                display: "flex",
                padding: "4px",
                borderRadius: "4px",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages area */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              backgroundColor: isLight ? "#f8fafc" : 'black',
            }}
            ref={(ref) => {
              if (ref) {
                ref.scrollTop = ref.scrollHeight;
              }
            }}
          >
            {messages.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: isLight ? "#64748b" : '#921d21',
                  textAlign: "center",
                  flexDirection: "column",
                }}
              >
                <p>Ask me anything to get started!</p>
                <p>{quota?.questions} Remaining messages</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  question={message.question}
                  response={message.response}
                  isLast={index === messages.length - 1 && isLoading}
                  quota={quota}
                />
              ))
            )}
          </div>

          {/* Input area */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              padding: "12px",
              borderTop: isLight ?"1px solid #dc898c" : '1px solid #921d21',
              backgroundColor: isLight ? "white" : 'black',
            }}
          >
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={handleInputChange}
              disabled={isLoading || quota?.questions === 0}
              style={{
                flex: 1,
                padding: "10px 12px",
                border: "1px solid #882024",
                borderRadius: "6px",
                marginRight: "8px",
                fontSize: "14px",
                outline: "none",
                backgroundColor: isLight ? "#f5f6f7" : '#515151d9',
                color: isLight ? "black" : 'white',
              }}
              // onFocus={(e) => (e.target.style.borderColor = "#dc898c")}
              // onBlur={(e) => (e.target.style.borderColor = "#dc898c")}
            />
            <button
              type="submit"
              disabled={isDisabled || isLoading || !input.trim() || quota?.questions === 0}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                padding: "8px 16px",
                backgroundColor: "#882024",
                color: isLight ? "white" : 'black',
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                opacity: isLoading || !input.trim() ? 0.7 : 1,
                transition: "background-color 0.2s",
              }}
              // onMouseOver={(e) => {
              //   if (!isLoading && input.trim() && !isDisabled) {
              //     e.currentTarget.style.backgroundColor = "#882024"
              //   }
              // }}
              // onMouseOut={(e) => {
              //   e.currentTarget.style.backgroundColor = "#dc898c"
              // }}
            >
              <Send size={16} />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* Inline styles for animations */}
      <style global='true' jsx="true">{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes bounce {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </div>
  )
}

export default PopupChatBot

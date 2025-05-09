import { useState, useEffect, useContext } from "react";
import { Bot, User } from "lucide-react";
import { userContext } from "../../context/UserContext";

const ChatMessage = ({ question, response, isLast = false, quota }) => {
  const [displayedResponse, setDisplayedResponse] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const {isLight} = useContext(userContext)
  useEffect(() => {
    if (isLast && response === "") {
      setIsTyping(true);
      return;
    }
    if (response && isLast) {
      setIsTyping(true);
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedResponse(response.substring(0, i));
        i++;
        if (i >= response.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 15);

      return () => clearInterval(interval);
    } else {
      setDisplayedResponse(response);
      setIsTyping(false);
    }
  }, [response, isLast]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        animation: "fadeIn 0.3s ease-in-out",
      }}
    >
      {/* User message */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          marginLeft: "auto",
          maxWidth: "80%",
        }}
      >
        <div
          style={{
            backgroundColor: "#882024",
            color: "white",
            padding: "12px",
            borderRadius: "12px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            height: "fit-content",
          }}
        >
          <p className="p-0 m-0">{question}</p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: isLight ? "#f1f5f9" : '#595959',
            flexShrink: 0,
            color: isLight ? "black" : "#c00007",
          }}
        >
          <User size={16} />
        </div>
      </div>

      {/* Bot response */}
      {(response || isLast) && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            marginRight: "auto",
            maxWidth: "80%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "#882024",
              color: isLight ? "white" : "black",
              flexShrink: 0,
            }}
          >
            <Bot size={16} />
          </div>
          <div>
            <div
              style={{
                backgroundColor: isLight ? "#f1f5f9" : '#595959',
                padding: "12px",
                borderRadius: "12px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                color: isLight ? 'black' : 'white'
              }}
            >
              {isTyping ? (
                <>
                  <p className="p-0 m-0">{displayedResponse}</p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      // marginTop: "4px",
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        style={{
                          width: "6px",
                          height: "6px",
                          backgroundColor: "currentColor",
                          borderRadius: "50%",
                          opacity: 0.6,
                          animation: `bounce 1.5s infinite ${i * 0.2}s`,
                          display: "inline-block",
                        }}
                      ></span>
                    ))}
                  </div>
                </>
              ) : (
                <p className="p-0 m-0">{response}</p>
              )}
            </div>
            <p style={{color: isLight ? 'black' : 'white', fontSize: '10px'}}>{quota?.questions} Remaining messages</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;

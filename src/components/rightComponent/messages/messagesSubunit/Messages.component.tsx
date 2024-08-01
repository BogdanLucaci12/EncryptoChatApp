import Spinner from "../../../helperComponent/Spinner.component";
import "../../conversation/scroll.css"
import { ReceiverMessage, SenderMessage } from "./Message.styles";
import { useSelectored } from "../../../../store/hooks";
import { Chat, MessageType, UserDetails } from "../../../../store/userSlice";
import { useEffect, useRef } from "react"
import { decryptData } from "../../../../utils/secureData";
const MessageContainer = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chat = useSelectored(state => state.user.chat)
  const currentUser = useSelectored(state => state.user.userDetails)
  const { id } = currentUser as UserDetails
  const { createdAt, messages } = chat as Chat
  const loading = useSelectored(state => state.user.loadingMessages)
  const firebaseStorageUrlPattern = /https:\/\/firebasestorage\.googleapis\.com\/[^\s]+/;
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="section backdrop-opacity-10 flex flex-col gap-3 p-3 overflow-auto " style={{ "height": "80%" }}>
      {
        loading ? <Spinner /> : (
          <div className="flex flex-col gap-3">
            <div className=" place-self-center bg-slate-200 rounded-md p-2">{createdAt}</div>
            <div className="flex flex-col gap-3">
              {messages &&
                messages.map((message: MessageType) => {
                  const decryptMessage = decryptData(message.text)
                  const isImageUrl = firebaseStorageUrlPattern.test(decryptMessage);
                  return message.senderId === id ? (
                    <SenderMessage
                      key={message.createdAt + message.text}>
                      {isImageUrl ? <img src={decryptMessage} alt="" /> : decryptMessage}
                      <p className="text-xs place-items-end">
                      {message.createdAt}
                  </p>
                    </SenderMessage>
                  ) : (
                    <ReceiverMessage
                      key={message.createdAt + decryptMessage}>
                      {isImageUrl ? <img src={decryptMessage} alt="" /> : decryptMessage}
                        <p className="text-xs place-items-end">
                          {message.createdAt}
                        </p>
                    </ReceiverMessage>
                  );
                })
              }
              <div ref={messagesEndRef} />
            </div>
          </div>
        )
      }
    </div>
  );
};

export default MessageContainer;
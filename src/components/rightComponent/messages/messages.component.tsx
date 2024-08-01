import FooterMessage from "./messagesSubunit/FooterMessage.component";
import HeaderMessage from "./messagesSubunit/HeaderMessage.component";
import MessageContainer from "./messagesSubunit/Messages.component";
const Messages = () => {
  return (
    <div className="w-2/3 h-full flex flex-col">
      <HeaderMessage />
      <MessageContainer />
      <FooterMessage />
    </div>
  );
};

export default Messages;
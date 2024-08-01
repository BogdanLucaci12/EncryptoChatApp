import Conversations from "./conversation/conversations.component";
import Messages from "./messages/messages.component";
import {useSelectored} from "../../store/hooks"
const RightComponent = () => {
  const partnerForChat=useSelectored(state=>state.user.chatPartnerRedux)
  return (
      <div className="w-11/12 bg-slate-100 flex pt-4 pl-5 relative">
        <Conversations />
      {
        partnerForChat && 
      <Messages /> 
      }  
    </div>
  );
};

export default RightComponent;
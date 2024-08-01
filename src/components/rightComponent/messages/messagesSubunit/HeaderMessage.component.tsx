import { useSelectored } from "../../../../store/hooks";
import { ChatPartnerRedux } from "../../../../store/userSlice";
import { AiOutlineUser } from "react-icons/ai";

const HeaderMessage = () => {
    const chatPartner=useSelectored(state=>state.user.chatPartnerRedux)
    const {profilePictures, displayName}=chatPartner as ChatPartnerRedux
  return (
      <div className=" flex justify-between items-center px-2" style={{ "height": "10%" }}>
          <div className="flex gap-3 flex-row items-center">
            {
                profilePictures ? 
              <img src={profilePictures} alt="" className="w-12 h-12 rounded-full" /> :
            <AiOutlineUser className="w-11 h-11" />
            }
              <p>{displayName}</p>
          </div>
          {/* <div className="flex flex-row gap-3">
              <p>Cauta in conversatie</p>
              <AiOutlineSearch className="w-7 h-7" />
          </div> */}
      </div>
  );
};

export default HeaderMessage;
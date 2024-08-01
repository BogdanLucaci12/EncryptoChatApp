import { useEffect, useState } from "react";
import { getUserDetails } from "../../../utils/firebase";
import { useDispatcher } from "../../../store/hooks";
import { setError, type UsersChatsType, type UserDetails } from "../../../store/userSlice";
import { decryptData } from "../../../utils/secureData";
import { AiOutlineUser } from "react-icons/ai";

type ConversationProps = {
    chat: UsersChatsType;
    clickEvent: (chatId: string, profilePictures: string, displayName: string, partnerId: string) => void;
};

const Conversation = ({ chat, clickEvent }: ConversationProps) => {
    const { lastMessage, receiverId, updatedAt, chatId, isSeen } = chat;
    const dispatch = useDispatcher();
    const [chatPartner, setChatPartner] = useState<UserDetails | null>(null);
    const [changeDate, setChangeDate] = useState<string>("");
    const [lastMes, setLastMes] = useState<string>("");

    useEffect(() => {
        const decryptedData = decryptData(lastMessage);
        if (decryptedData.length > 50) {
            setLastMes(decryptedData.substring(0, 100) + '...');
        } else {
            setLastMes(decryptedData);
        }
    }, [lastMessage]); 

    useEffect(() => {
        const pattern: RegExp = /\b\d{2}:\d{2}\b/;
        const match: RegExpMatchArray | null = updatedAt.match(pattern);
        if (match) {
            const hoursAndMinutes: string = match[0];
            setChangeDate(hoursAndMinutes);
        }
    }, [updatedAt]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userPartnerDetails = await getUserDetails(receiverId);
                if (typeof userPartnerDetails === "string") {
                    dispatch(setError({ error: userPartnerDetails }));
                } else {
                    setChatPartner(userPartnerDetails);
                }
            } catch (error) {
                dispatch(setError({ error: "Failed to fetch user details" }));
            }
        };
        fetchData();
    }, [receiverId, dispatch]);

    if (!chatPartner) {
        return null;
    }

    const { profilePictures, displayName, id } = chatPartner;

    return (
        <div
            className={`flex hover:bg-slate-300 cursor-pointer w-[23em] h-[4em] justify-center rounded-lg ${isSeen ? '' : 'bg-slate-200'}`}
            onClick={() => clickEvent(chatId, profilePictures, displayName, id)}
        >
            <div className="h-full flex">
                {
                    profilePictures ?  
                <img src={profilePictures} alt="" className="w-11 h-11 rounded-full self-center" /> :
                <AiOutlineUser className="w-11 h-11 cursor-pointer" />
                }
            </div>
            <div className="flex flex-col ml-2 items-center w-full">
                <div className="flex justify-between w-full">
                    <b>{displayName}</b>
                    <b>{changeDate}</b>
                </div>
                <div className="w-full flex">
                    <p>{lastMes}</p>
                </div>
            </div>
        </div>
    );
};

export default Conversation;

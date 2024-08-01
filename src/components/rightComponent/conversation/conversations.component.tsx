import Conversation from "./conversation.component";
import { AiOutlineSearch } from "react-icons/ai";
import "./scroll.css"
import NewConversationContainer from "./NewConversation.component";
import {  useState } from "react";
import { UserDetails, type UsersChatsType, setChat, setLoadingMessage } from "../../../store/userSlice";
import { getChat, updateSeen } from "../../../utils/firebase";
import { useDispatcher, useSelectored } from "../../../store/hooks";
import { setError, setChatPartnerRedux } from "../../../store/userSlice";
import Spinner from "../../helperComponent/Spinner.component";
const ConversationsContainer = () => {
    const dispatch = useDispatcher()

    const [open, setOpen] = useState(false)
    const chats = useSelectored(state => state.user.chats) || []
    const loadingConversations = useSelectored(state => state.user.loadingConversations)
    const userDetails=useSelectored(state=>state.user.userDetails)
    const {id}=userDetails as UserDetails
    const handleclickOnConversation = async (idForSpecificChat: string, profilePictures: string, displayName: string, partnerId:string)=>{
        dispatch(setLoadingMessage({loadingMessages:true}))
        const chat = await getChat(idForSpecificChat)
        await updateSeen(id, idForSpecificChat )
        if(typeof chat === 'string'){
            dispatch(setError({error:chat}))
            dispatch(setLoadingMessage({ loadingMessages: false }))
        }
        else {
            dispatch(setChat(chat))
            dispatch(setChatPartnerRedux({profilePictures:profilePictures, displayName:displayName, chatId:idForSpecificChat, partnerId:partnerId}))
            dispatch(setLoadingMessage({ loadingMessages: false }))
        }
    }

    return (
        <div className="w-1/3 relative">
            <div >
                <div className="flex flex-row justify-between">
                    <p className="text-xl font-bold">
                        Conversatii
                    </p>
                    <p className="flex gap-2 cursor-pointer" onClick={() => setOpen(!open)} >
                        Cauta utilizatorul
                        <AiOutlineSearch className="w-7 h-7 cursor-pointer" />
                    </p>
                </div>
            </div>
            <div className="flex flex-col justify-start items-center mt-2 gap-3 scroll-smooth overflow-auto max-h-[30em] section h-full">
                {loadingConversations ? (
                    <Spinner />
                ) : (
                        chats.length > 0 ? 
                        (
                            chats.map((chat: UsersChatsType) => (
                            <Conversation 
                            key={chat.chatId} 
                            chat={chat} 
                            clickEvent={(chatId, profilePictures, displayName, partnerId) => handleclickOnConversation(chatId, profilePictures, displayName, partnerId)}
                            />
                        ))
                    ) 
                    : (
                        <p>No conversations found</p>
                    )
                )}

            </div>
            {open && <NewConversationContainer setOpen={setOpen}/>}
        </div>
    );
};

export default ConversationsContainer;
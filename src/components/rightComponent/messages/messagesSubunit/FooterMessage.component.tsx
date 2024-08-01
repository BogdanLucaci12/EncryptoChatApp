import { Textarea } from "../../../ui/textarea";
import { AiOutlineSend } from "react-icons/ai";
import { AiTwotoneCamera } from "react-icons/ai";
import { ChangeEvent, type FormEvent, useState, KeyboardEvent, useRef, useEffect } from "react";
import { Button } from "../../../ui/button";
import { useSelectored, useDispatcher } from "../../../../store/hooks";
import { type ChatPartnerRedux, type UserDetails, type Chat, setChat, setError, setChats, setLoadingConversations } from "../../../../store/userSlice";
import { getChat, sendMessage, sendImageThroughChat, db } from "../../../../utils/firebase";
import { onSnapshot, doc } from "firebase/firestore"
const FooterMessage = () => {
    const dispatch = useDispatcher()
    const [disabled, setDisabled] = useState(false)
    const [message, setMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null)
    const userId = useSelectored(state => state.user.userDetails)
    const chatDetails = useSelectored(state => state.user.chatPartnerRedux)
    const loadingConversations = useSelectored(state => state.user.loadingConversations)
    const { id } = userId as UserDetails
    const { chatId, partnerId } = chatDetails as ChatPartnerRedux

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "UsersChats", id), (doc) => {
            try{
                const chats = doc.data();
                if (chats !== undefined) {
                    loadingConversations && dispatch(setLoadingConversations({ loadingConversations: false }))
                    dispatch(setChats(chats.chats));
                }
            }
            catch(error){
            }
        });
        return () => {
            unsubscribe()
        }
    }, [id, dispatch, loadingConversations]);

    useEffect(()=>{
        if(!chatId) return
        const unsubscribe2 = onSnapshot(doc(db, "Chats", chatId), (doc) => {
            try {
                const chat = doc.data() as Chat;
                if (chat !== undefined) {
                    dispatch(setChat(chat));
                }
            }
            catch (error) {
            }
        });
        return () => {
            unsubscribe2()
        }
    }, [chatId, dispatch])

    const handleSubmitMessage = async (event?: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>) => {
        if (event) event.preventDefault();
        if (message.trim() === "") {
            setDisabled(true);
        }
        else {
            setDisabled(true)
            const statusSendMessage = await sendMessage(id, chatId, message, partnerId)
            if (typeof statusSendMessage === "string") {
                if (statusSendMessage === "succes") {
                    setMessage("")
                }
                else {
                    dispatch(setError({ error: statusSendMessage }))
                    setDisabled(false)
                }
            }
        }
    }

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value;
        console.log(value)
        if (value.length >=0) {
            setMessage(value)
            setDisabled(false);
        }
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            setMessage("")
            handleSubmitMessage(event);
        }
    };

    const handleClickSendImage = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const result = await sendImageThroughChat(chatId, id, file);
            if (result === "uploadSucces") {
                const chat = await getChat(chatId)
                if (typeof chat === "string") {
                    dispatch(setError({ error: chat }))
                } else {
                    dispatch(setChat(chat))
                }
            }
        };
    }

    return (
        <div style={{ "height": "10%" }}>
            <form action=""
                className="flex flex-row px-1 justify-between items-center w-full gap-4"
                onSubmit={handleSubmitMessage}
            >
                <div onClick={handleClickSendImage}>
                    <AiTwotoneCamera className="w-7 h-7 cursor-pointer" />
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                </div>
                <div className="w-10/12">
                    <Textarea
                        className="w-full"
                        onChange={handleChange}
                        value={message}
                        onKeyDown={handleKeyDown}>
                    </Textarea>
                </div>
                <div>
                    <Button variant="outline" disabled={disabled}>
                        <AiOutlineSend className="w-7 h-7" />
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default FooterMessage
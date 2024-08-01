import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UserDetails={
        blocked?:string[];
        displayName:string;
        email:string;
        id:string;
        lastOnline:string;
        profilePictures:string;
}

export type UsersChatsType = {
    chatId: string;
    lastMessage: string;
    receiverId: string;
    updatedAt: string;
    isSeen:boolean;
}

export type MessageType = {
    createdAt: string;
    senderId: string;
    text:string
}

export type Chat = {
    createdAt: string;
    messages: MessageType[];
}

export type ChatPartnerRedux={
    profilePictures:string;
    displayName:string;
    chatId:string;
    partnerId:string;
}

type UserState={
    user:string;
    isLoading: boolean;
    userDetails:UserDetails | {};
    error:string;
    loadingConversations:boolean;
    chats: UsersChatsType[];
    chat:Chat | {},
    chatPartnerRedux: ChatPartnerRedux | {},
    loadingMessages:boolean;
}


const initialState:UserState = {
    user:"",
    isLoading:true,
    userDetails: {},
    error:"",
    loadingConversations:true,
    chats:[],
    chat:{},
    chatPartnerRedux:{},
    loadingMessages:false,
}

export const userSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        setCurrentUser(
            state, 
            action:PayloadAction<{user:string}>){
                state.user=action.payload.user
        },
        setIsLoading(state, 
            action:PayloadAction<{isLoading:boolean}>){
                state.isLoading=action.payload.isLoading
        },
        setUserDetails(state, action: PayloadAction<UserDetails>) {
            state.userDetails = action.payload;
        },
        resetUserDetails(state) {
            state.userDetails = {};
        },
        setError(state, action:PayloadAction<{error:string}>){
            state.error=action.payload.error
        },
        setLoadingConversations(state, action: PayloadAction<{ loadingConversations:boolean}>){
            state.loadingConversations = action.payload.loadingConversations
        },
        setChats(state, action: PayloadAction<UsersChatsType[]>) {
            state.chats = action.payload
        },
        resetChats(state) {
            state.chats = [];
        },
        setChat(state, action: PayloadAction<Chat>){
            state.chat = action.payload
        }, 
        resetChat(state) {
            state.chat = [];
        },
        setChatPartnerRedux(state, action: PayloadAction<ChatPartnerRedux>){
            state.chatPartnerRedux = action.payload
        },
        resetChatPartnerRedux(state) {
            state.chatPartnerRedux={}
        },
        setLoadingMessage(state, action: PayloadAction<{ loadingMessages:boolean}>){
            state.loadingMessages = action.payload.loadingMessages
        }
    }
})

export const { 
    setCurrentUser, 
    setUserDetails, 
    setIsLoading, 
    setError, 
    setLoadingConversations, 
    setChats, 
    setChat,
    setChatPartnerRedux, 
    setLoadingMessage,
    resetUserDetails,
    resetChat,
    resetChats,
    resetChatPartnerRedux
} = userSlice.actions
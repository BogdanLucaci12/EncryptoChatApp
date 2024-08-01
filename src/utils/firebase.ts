import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, Timestamp, doc, setDoc, getDoc, updateDoc, collection, getDocs, arrayUnion } from "firebase/firestore";
import { type UserDetails, type UsersChatsType, Chat } from "../store/userSlice";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { encryptedData, decryptData } from "./secureData";
const firebaseConfig = {
    apiKey: process.env.REACT_APP_Firebase_Key,
    authDomain: "chat-app-53a66.firebaseapp.com",
    projectId: "chat-app-53a66",
    storageBucket: "chat-app-53a66.appspot.com",
    messagingSenderId: "553510636427",
    appId: process.env.REACT_APP_Firebase_APP_ID,
    measurementId: "G-4GL0DDNCLE"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const storage = getStorage();

const timeRetriver = () => {
    const currentTimestamp = Timestamp.now();
    const dateObject = currentTimestamp.toDate();
    const formattedDate = dateObject.toLocaleString();
    return formattedDate
}

export const registerUserWithEmailAndPassword = async (email: string, password: string, name: string): Promise<UserDetails | string> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const result = await createDocumentFromAuth(user.uid, name, email)
        if (result === "dbCreated") {
            const userDetails = await getUserDetails(user.uid)
            createUserChats(user.uid)
            return userDetails;
        }
        return "No name generated"
    } catch (error) {
        if (error instanceof Error) {
            const errorMessage = error.message;
            return errorMessage; // Returnează un obiect cu mesajul de eroare
        }
        return "An unknown error occurred" // Returnează un obiect cu mesajul de eroare
    }
};

export const logIn = async (email: string, password: string): Promise<UserDetails | string> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userDetails = await getUserDetails(user.uid)
        return userDetails
    }
    catch (error) {
        if (error instanceof Error) {
            return error.message
        }
        return "An unknown error occurred"
    }
}

export const logInWithGooglePopup = async (): Promise<string | UserDetails> => {
    try {
        const result = await signInWithPopup(auth, provider)
        const user = result.user;
        if (user.email !== null) {
            const dbCreatedForGoogleSignIn = await createDocumentFromAuth(user.uid, user.displayName, user.email)
            if (typeof dbCreatedForGoogleSignIn === "string") {
                const userDetails = await getUserDetails(user.uid)
                await createUserChats(user.uid)
                return userDetails
            }
            else {
                return "An unknown error occurred"
            }
        } else {
            return "error in Google LogIn"
        }
    }
    catch (error) {
        if (error instanceof Error) {
            return error.message
        }
        else {
            return "An unknown error occurred"
        }
    }
}


export const createDocumentFromAuth = async (uid: string, displayName: string | null, email: string): Promise<string> => {
    const collectionUser = doc(db, 'Users', uid);
    const docSnap = await getDoc(collectionUser);
    if (!docSnap.exists()) {
        const formattedDate = timeRetriver()
        await setDoc(collectionUser, {
            displayName: displayName,
            id: uid,
            profilePictures: "",
            lastOnline: formattedDate,
            blocked: [],
            email: encryptedData(email)
        })
        return "dbCreated"
    }
    return "dbExists"
}



export const getUserNameFromAuth = async (uid: string): Promise<string> => {
    const collectionUser = doc(db, 'Users', uid);
    const docSnap = await getDoc(collectionUser);
    if (docSnap.exists()) {
        return docSnap.data().displayName;
    }
    return "noDisplayName"
}

export const getUserDetails = async (uid: string): Promise<UserDetails | string> => {
    const collectionUser = doc(db, 'Users', uid);
    const docSnap = await getDoc(collectionUser);
    if (docSnap.exists()) {
        return docSnap.data() as UserDetails;
    }
    return "noUserId"
}

export const createUserChats = async (uid: string) => {
    const collectionUserChats = doc(db, 'UsersChats', uid);
    const checkCollectionUserChats = await getDoc(collectionUserChats);
    if (!checkCollectionUserChats.exists()) {
        await setDoc(collectionUserChats, {
            chats: []
        })
    }
}

export const logOut = async () => { signOut(auth) }

export const checkUserStatus = async (): Promise<UserDetails | string> => {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const uid = user.uid;
                const userDetails = await getUserDetails(uid)
                resolve(userDetails);
            }
            else {
                resolve("noUserAuthenticated")
            }
        });
    });
}

export const updateProfilePicture = async (uid: string, url: string) => {
    const updateProfilePicture = doc(db, 'Users', uid);
    await updateDoc(updateProfilePicture, {
        profilePictures: url
    });
}
export const uploadProfilePicture = async (userUid: string, file: File): Promise<string> => {
    const metadata = {
        contentType: 'image/jpeg'
    };
    const storageRef = ref(storage, 'profilePictures/' + userUid);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
            () => { },
            (error) => {
                reject(error);
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    await updateProfilePicture(userUid, downloadURL);
                    resolve("uploadSucces");
                } catch (error) {
                    reject(error);
                }
            }
        );
    });
};

export const searchUser = async (email: string): Promise<UserDetails | string> => {
    const emailsCollection = collection(db, "Users");
    const querySnapshot = await getDocs(emailsCollection);
    for (const doc of querySnapshot.docs) {
        const retrieveEmail = doc.data().email;
        const decryptedEmail = decryptData(retrieveEmail);
        if (decryptedEmail === email) {
            return doc.data() as UserDetails;
        }
    }
    return "No Email Found";
};

export const createNewChat = async (idSenderChatPartner: string, idCurrentUser: string): Promise<string | boolean> => {
    const currentUserChatsRef = doc(db, 'UsersChats', idCurrentUser);
    const userPartnerRef = doc(db, 'UsersChats', idSenderChatPartner);
    const docRef = doc(db, 'UsersChats', idCurrentUser);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
        const chats = docSnapshot.data().chats;
        const idAllreadyExistsInYourChat = chats.some((chat: UsersChatsType) => chat.receiverId === idSenderChatPartner);
        if (idAllreadyExistsInYourChat) {
            return true;
        }
        else {
            const chatRef = collection(db, "Chats");
            try {
                const newChatRef = doc(chatRef)
                await setDoc(newChatRef, {
                    createdAt: timeRetriver(),
                    messages: []
                })
                await updateDoc(currentUserChatsRef, {
                    chats: arrayUnion({
                        chatId: newChatRef.id,
                        lastMessage: "",
                        receiverId: idSenderChatPartner,
                        updatedAt: timeRetriver(),
                        isSeen: false
                    })
                })
                await updateDoc(userPartnerRef, {
                    chats: arrayUnion({
                        chatId: newChatRef.id,
                        lastMessage: "",
                        receiverId: idCurrentUser,
                        updatedAt: timeRetriver(),
                        isSeen: true
                    })
                })
                return "newChatCreated"
            }
            catch (error) {
                if (error instanceof Error) {
                    return error.message
                }
                else {
                    return "unknown error"
                }
            }
        }
    }
    else {
        return "snapshotDoesntExist"
    }
}

export const currentUserChatsRetriever = async (id: string): Promise<UsersChatsType[] | string> => {
    const userChatsDoc = doc(db, "UsersChats", id)
    try {
        const chatSnapshot = await getDoc(userChatsDoc);
        if (chatSnapshot.exists()) {
            return chatSnapshot.data().chats as UsersChatsType[];
        } else {
            return "Find some one to chat";
        }
    }
    catch (error) {
        if (error instanceof Error) {
            return error.message
        }
        else {
            return "unknown error"
        }
    }
}

export const getChat = async (id: string): Promise<Chat | string> => {
    const chatRef = doc(db, "Chats", id)
    const getChat = await getDoc(chatRef)
    if (getChat.exists()) {
        const chat = getChat.data()
        return chat as Chat
    }
    else {
        return "No chat found"
    }
}

type UpdateUserChatsType = {
    id: string | undefined;
    message: string;
    idChat: string;
    idPartner: string | undefined
}

export const updateUserChats = async ({ id, message, idChat, idPartner }: UpdateUserChatsType): Promise<string | undefined> => {
    if (id) {
        let docUserChats = doc(db, "UsersChats", id)
        const getDocFromCollectionUserChats = await getDoc(docUserChats)
        if (getDocFromCollectionUserChats.exists()) {
            const chatsArrayFromUsersChats = getDocFromCollectionUserChats.data().chats
            const chatIndex = chatsArrayFromUsersChats.findIndex((c: UsersChatsType) => c.chatId === idChat)
            chatsArrayFromUsersChats[chatIndex].lastMessage = message;
            chatsArrayFromUsersChats[chatIndex].updatedAt = timeRetriver();
            chatsArrayFromUsersChats[chatIndex].isSeen = true;
            await updateDoc(docUserChats, {
                chats: chatsArrayFromUsersChats
            })
            return "ok"
        } 
    }
        else if (idPartner) {
            const docUserChats = doc(db, "UsersChats", idPartner)
            const getDocFromCollectionUserChats = await getDoc(docUserChats)
            if (getDocFromCollectionUserChats.exists()) {
                const chatsArrayFromUsersChats = getDocFromCollectionUserChats.data().chats
                const chatIndex = chatsArrayFromUsersChats.findIndex((c: UsersChatsType) => c.chatId === idChat)
                chatsArrayFromUsersChats[chatIndex].lastMessage = message;
                chatsArrayFromUsersChats[chatIndex].updatedAt = timeRetriver();
                chatsArrayFromUsersChats[chatIndex].isSeen = false;
                await updateDoc(docUserChats, {
                    chats: chatsArrayFromUsersChats
                })
            }
            return "ok"
        }
     else {
        return "Eror update UsersChats"
    }
}
export const sendMessage = async (idSender: string, idChat: string, message: string, partnerId: string): Promise<string> => {
    if (!idSender || !idChat || !message || !partnerId) return "All fields are required"
    const docRef = doc(db, "Chats", idChat)
    const encryptedMessage = encryptedData(message)
    try {
        await updateDoc(docRef, {
            messages: arrayUnion({
                createdAt: timeRetriver(),
                senderId: idSender,
                text: encryptedMessage
            })
        })
        updateUserChats({ id: idSender, message: encryptedMessage, idChat: idChat, idPartner: undefined });
        updateUserChats({ id: undefined, message: encryptedMessage, idChat: idChat, idPartner: partnerId });
        
        return "succes"
    }
    catch (err) {
        if (err instanceof Error) {
            return err.message
        }
    }
    return "unknown error"
}

export const sendImageThroughChat = async (chatId: string, idSender: string, file: File): Promise<string> => {
    const metadata = {
        contentType: 'image/jpeg'
    };
    const storageRef = ref(storage, `chats:${chatId}/` + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
            () => { },
            (error) => {
                reject(error);
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    const docRef = doc(db, "Chats", chatId)
                    await updateDoc(docRef, {
                        messages: arrayUnion({
                            createdAt: timeRetriver(),
                            senderId: idSender,
                            text: encryptedData(downloadURL)
                        })
                    })
                    resolve("uploadSucces");
                } catch (error) {
                    reject(error);
                }
            }
        );
    });
}

export const updateSeen = async (id: string, idChat: string) => {
    const docUserChats = doc(db, "UsersChats", id)
    const getDocFromCollectionUserChats = await getDoc(docUserChats)
    if (getDocFromCollectionUserChats.exists()) {
        const chatsArrayFromUsersChats = getDocFromCollectionUserChats.data().chats
        const chatIndex = chatsArrayFromUsersChats.findIndex((c: UsersChatsType) => c.chatId === idChat)
        chatsArrayFromUsersChats[chatIndex].isSeen = true;
        await updateDoc(docUserChats, {
            chats: chatsArrayFromUsersChats
        })
    } else {
        return "Eror update UsersChats"
    }
}
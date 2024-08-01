import { SearchContainer } from "../../helperComponent/container.styles";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { AiOutlineSend } from "react-icons/ai";
import { useEffect, type FormEvent } from "react";
import { createNewChat, searchUser } from "../../../utils/firebase"
import { useState } from "react";
import { useSelectored, useDispatcher } from "../../../store/hooks";
import { setError, type UserDetails } from "../../../store/userSlice"
import Spinner from "../../helperComponent/Spinner.component";
import { useRef } from "react";

type NewConversationContainerProps = {
    setOpen: (open: boolean) => void
}
const userDetails = {
    blocked: [],
    displayName: "",
    email: "",
    id: "",
    lastOnline: "",
    profilePictures: "",
}

const NewConversationContainer = ({ setOpen }: NewConversationContainerProps) => {
    const dispatch = useDispatcher()
    const [chatPartner, setChatPartner] = useState<UserDetails>(userDetails)
    const currentUserDetails = useSelectored(state => state.user.userDetails)
    const [loadingPartnerClick, setLoadingPartnerClick] = useState(false)
    const [loadingSearch, setLoadingSearch] = useState(false)
    const { id } = currentUserDetails as UserDetails
    const containerRef = useRef<HTMLDivElement>(null)

    const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoadingSearch(true)
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData);
        const { search } = data;
        if (typeof search === "string") {
            if (search === "") {
                dispatch(setError({ error: "Email field is empty" }))
                return setLoadingSearch(false)
            }
            const result = await searchUser(search)
            if (typeof result === "string") {
                dispatch(setError({ error: result }))
                return setLoadingSearch(false)
            }
            else {
                setChatPartner(result)
                return setLoadingSearch(false)
            }
        }
    }
    const handleClickOnPartener = async (idSenderChatPartner: string, idCurrentUser: string) => {
        setLoadingPartnerClick(true)
        if (idSenderChatPartner === idCurrentUser) {
            dispatch(setError({ error: "This user it's yourself" }))
            return setLoadingPartnerClick(false)
        }
        const result = await createNewChat(idSenderChatPartner, idCurrentUser)
        if (typeof result === "string" && result === "newChatCreated") {
            return setLoadingPartnerClick(false)
        }
        else if (typeof result === "string") {
            dispatch(setError({ error: result }))
            return setLoadingPartnerClick(false)
        }
        else if (typeof result === "boolean") {
            dispatch(setError({ error: "You allready have a chat with this user" }))
            return setLoadingPartnerClick(false)
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [containerRef, setOpen]);

    return (
        <SearchContainer ref={containerRef} >
            <form action="" className="w-full flex flex-row justify-center" onSubmit={handleSearch}>
                <Input type="text" name="search" placeholder="Cauta email-ul persoanei dorite" className="w-9/12 border-2 border-slate-400" />
                <Button variant="outline">
                    {loadingSearch ? <Spinner /> :
                        <AiOutlineSend className="w-7 h-7" />
                    }
                </Button>
            </form>
            <div className="flex flex-col justify-start items-start w-full ">
                {
                    loadingPartnerClick ? <Spinner />:
                <p
                    onClick={() => handleClickOnPartener(chatPartner.id, id)}
                    className="cursor-pointer p-2  hover:bg-slate-200 w-full last:rounded-b-lg">
                    {chatPartner.displayName}
                </p>
                }
            </div>
        </SearchContainer>
    );
};

export default NewConversationContainer;
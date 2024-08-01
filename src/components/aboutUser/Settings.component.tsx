import { logOut } from "../../utils/firebase";
import { useDispatcher } from "../../store/hooks";
import { setCurrentUser, resetUserDetails, resetChat, resetChats, resetChatPartnerRedux } from "../../store/userSlice";
import { Button } from "../ui/button";
import { useRef, useEffect } from "react";
import { AiOutlineUser } from "react-icons/ai";

type SettingsProps={
    profilePictures:string,
    displayName:string,
    setOpen: (open: boolean) => void
}

const Settings = ({profilePictures, displayName, setOpen}:SettingsProps) => {
    const dispatch=useDispatcher()
    const containerRef = useRef<HTMLDivElement>(null)
    
    const disconnect = () => {
        dispatch(setCurrentUser({ user: "" }))
        dispatch(resetUserDetails())
        dispatch(resetChat())
        dispatch(resetChats())
        dispatch(resetChatPartnerRedux())
        logOut()
       
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
    }, [containerRef]);

    return (
        <div 
        className="absolute w-[15em] h-[15em] outline  outline-1  z-10 bottom-14 left-1 rounded-sm backdrop-blur-sm shadow-2xl  items-center flex flex-col gap-4 py-2"
        ref={containerRef}>
            <div className="gap-6 flex flex-col items-center">
                {
                    profilePictures ? 
                    <img src={profilePictures} alt="" className="h-[5em] w-[5em] rounded-full" /> :
                        <AiOutlineUser className="w-11 h-11" />
                }
                <p className="font-semibold tracking-tight">{displayName}</p>
            </div>
            <div>
                <p className="font-semibold tracking-tight">
                    Profilul utilizatorului
                </p>
            </div>
            <Button onClick={disconnect}>LogOut</Button>
        </div>
    );
};

export default Settings;
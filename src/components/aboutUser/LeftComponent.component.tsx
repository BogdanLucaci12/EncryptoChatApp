import { AiOutlineUser } from "react-icons/ai";
import { AiFillSetting } from "react-icons/ai";
import { useDispatcher, useSelectored } from "../../store/hooks";
import { setUserDetails, type UserDetails } from "../../store/userSlice";
import { useRef, useState } from "react";
import { uploadProfilePicture } from "../../utils/firebase";
import { getUserDetails } from "../../utils/firebase";
import logo from "../../assets/logo.png"
import Spinner from "../helperComponent/Spinner.component";
import Settings from "./Settings.component";
const LeftComponent = () => {
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false)

  const dispatch = useDispatcher()
  const userDetails = useSelectored(state => state.user.userDetails)
  const { profilePictures, id, displayName } = userDetails as UserDetails;
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true)
    const file = event.target.files?.[0];
    if (file) {
      const result = await uploadProfilePicture(id, file);
      if (result === "uploadSucces") {
        const userDetails = await getUserDetails(id)
        if (typeof userDetails === "object") {
          dispatch(setUserDetails(userDetails))
          setLoading(false)
        }
      }
    }
  };

  return (
    <div className="w-1/12 grid justify-center content-between p-1 border-5 items-center relative">
      <div className="items-center w-full flex flex-col gap-3">
        <img src={logo} alt="" className="h-10 w-10 place-items-center rounded-full " />
        <p className="font-medium">EncryptoChat</p>
        <p className="font-thin">Criptat integral</p>
      </div>
      <div className="grid justify-center content-between gap-3">
        <div className="grid justify-center content-between ">
          {
            open ? <Settings
              displayName={displayName}
              profilePictures={profilePictures}
              setOpen={setOpen}
            /> : <AiFillSetting className="w-7 h-7 cursor-pointer" onClick={() => setOpen(true)} />
          }

        </div>
        <div className="border-3 rounded-full bg-gray-200" onClick={handleClick}>
          {
            loading ? <Spinner /> :
              profilePictures ? (
                <img src={profilePictures} alt="Profile" className="w-11 h-11 cursor-pointer rounded-full" />
              ) : (
                <AiOutlineUser className="w-11 h-11 cursor-pointer" />
              )}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
      </div>

    </div>
  );
};

export default LeftComponent;
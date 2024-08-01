import { useEffect } from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type MessageString = {
    subject: string | undefined;
}

const ErrorMessageContainer = ({ subject }: MessageString) => {
    console.log(subject)
    const notify = () => toast.error(subject, {
        position: "bottom-center",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
    });
    useEffect(() => {
        if (subject !== undefined && subject !=="") {
            notify();
        }
    }, [subject]);
    return (
        <ToastContainer />
    )
}
export default ErrorMessageContainer
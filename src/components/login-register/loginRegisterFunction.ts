import { 
    logIn, 
    registerUserWithEmailAndPassword } from "../../utils/firebase";
import { FormEvent } from "react";
import { UserDetails } from "@/src/store/userSlice";
type RegisterType = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string
}

type LogInType = {
    email: string;
    password: string;
}

type FormEventCustom=FormEvent<HTMLFormElement> 

export const handleRegister = async (event: FormEvent<HTMLFormElement>): Promise<UserDetails | string> => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    const { email, password, confirmPassword, name } = data as RegisterType;

    if (!email) return 'Email field is empty';
    if (!name) return 'Name field is empty';
    if (!password) return 'Password field is empty';
    if (!confirmPassword) return 'Confirm Password field is empty';
    if (password !== confirmPassword) return 'Passwords do not match';

    return await registerUserWithEmailAndPassword(email, password, name);
}

export const handleLogIn=async (event:FormEventCustom):Promise<UserDetails | string>=>{
    event.preventDefault();
    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData)
    const extractedData = data as LogInType
    const user=await logIn(extractedData.email, extractedData.password)
    return user
}
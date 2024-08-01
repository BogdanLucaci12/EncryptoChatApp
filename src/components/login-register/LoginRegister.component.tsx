import { useRef,  type FormEvent } from "react"
import { Button } from "../ui/button"
import { Loader2 } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../ui/tabs"
import {
    handleLogIn,
    handleRegister
} from "./loginRegisterFunction"
import { useDispatcher, useSelectored } from "../../store/hooks"
import { setCurrentUser, setUserDetails, setIsLoading, setError } from "../../store/userSlice"
import { FaGoogle } from "react-icons/fa";
import { logInWithGooglePopup } from "../../utils/firebase"


const LoginRegisterContainer = () => {
    const form = useRef<HTMLFormElement>(null)
    const dispatch = useDispatcher()
    const isLoading = useSelectored(state => state.user.isLoading)

    const submitLogIn = async (event: FormEvent<HTMLFormElement>) => {
        dispatch(setIsLoading({ isLoading: true }))
        const result = await handleLogIn(event);
        if (typeof result === "object" ) {
            dispatch(setCurrentUser({ user: result.displayName }));
            dispatch(setUserDetails(result));
            dispatch(setIsLoading({ isLoading: false }))
            form.current?.reset();
        } else if (typeof result === 'string' ) {
            dispatch(setError({error:result}));
            dispatch(setIsLoading({ isLoading: false }))
        }
    };

    const submitRegister = async (event: FormEvent<HTMLFormElement>) => {
        dispatch(setIsLoading({ isLoading: true }))
        const result = await handleRegister(event)
        if (typeof result === "object") {
            dispatch(setCurrentUser({ user: result.displayName }));
            dispatch(setUserDetails(result));
            dispatch(setIsLoading({ isLoading: false }))

            form.current?.reset();
        } else if (typeof result === 'string') {
            dispatch(setError({error:result}))
            dispatch(setIsLoading({ isLoading: false }))
        }
    }

    const handleLogInWithGoogle = async () => {
        dispatch(setIsLoading({ isLoading: true }))
        const result = await logInWithGooglePopup()
        if(typeof result ==="object"){
            dispatch(setUserDetails(result));
            dispatch(setCurrentUser({ user: result.displayName }));
            dispatch(setIsLoading({ isLoading: false }))
        }
        else {
            dispatch(setError({ error: result }));
            dispatch(setIsLoading({ isLoading: false }))

        }
    }

    return (
        <Tabs defaultValue="account" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">Log-In</TabsTrigger>
                <TabsTrigger value="password">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
                <form onSubmit={submitLogIn} ref={form}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Account</CardTitle>
                            <CardDescription>
                                If you have an account you can log-in
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="text" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-row justify-between w-full">
                            {
                                isLoading ? (<Button disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </Button>) : <Button>Log-in</Button>
                            }
                            {
                                isLoading ? (<Button disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </Button>) : <Button
                                    onClick={handleLogInWithGoogle}
                                    ><FaGoogle className="" /></Button>
                            }
                        </CardFooter>
                    </Card>
                </form>
            </TabsContent>
            <TabsContent value="password">
                <form onSubmit={submitRegister}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Register</CardTitle>
                            <CardDescription>
                                Here you can register
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="current">Name</Label>
                                <Input id="name" type="text" name="name" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" name="email" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" name="password" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="confirmPassword">Current password</Label>
                                <Input id="currconfirmPasswordent" type="password" name="confirmPassword" />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-row justify-between w-full">
                            {
                                isLoading ? (<Button disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </Button>) : <Button>Register</Button>
                            }
                            {
                                isLoading ? (<Button disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </Button>) : <Button
                                    onClick={handleLogInWithGoogle}
                                    ><FaGoogle className=""/></Button>
                            }

                          
                        </CardFooter>
                    </Card>
                </form>
            </TabsContent>
           

        </Tabs>
    )
}

export default LoginRegisterContainer
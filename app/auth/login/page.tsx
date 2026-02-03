import Loading from "@/components/Loading";
import LoginPage from "@/components/login/page"
import { Suspense } from "react";



export default function Login()
{
    return (
        <Suspense fallback={<Loading/>}>
            <LoginPage></LoginPage>
        </Suspense>
    )
}
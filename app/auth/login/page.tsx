import Loading from "@/app/(root)/loading";
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
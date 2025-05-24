import { useEffect } from "react"
import { useRefreshMutation } from "./authApiSlice"
import { useSelector } from "react-redux"
import { selectCurrentToken } from "./authSlice"
import { Outlet } from "react-router-dom"

const PersistLogin = () => {

    const token = useSelector(selectCurrentToken)


    const [refresh, { isUninitialized, isLoading, isError, isSuccess, error }] = useRefreshMutation()

    useEffect(() => {


        console.log("Checking token ============= >:", token)
        const verifyRefresh = async () => {
            try {
                const result = await refresh({}).unwrap()
                console.log("Refresh successful:", result)
            } catch (err) {
                console.error("Refresh failed:", err)
            }
        }


        if (!token) {
            console.log("TOKEN NOT FOUND, REFRESHING...")
            verifyRefresh()
        } else {
            console.log("TOKEN FOUND, NO NEED TO REFRESH")
        }
    }, [refresh])


    let content
    if (isLoading) {
        content = <p>Loading...</p>
    }
    else if (token) {
        content = <Outlet />
    }
    else if (isError) {
        console.log("Error occurred during token refresh:", error);
        // Extract error message from the error object
        let errorMessage = "Failed to refresh token";
        if (error && "data" in error && typeof error.data === "object" && error.data && "message" in error.data) {
            errorMessage = (error.data as { message?: string }).message || errorMessage;
        } else if (error && "message" in error) {
            errorMessage = (error as { message?: string }).message || errorMessage;
        }
        content = <p>Error: {errorMessage}</p>;
    }
    else if (isSuccess) {
        content = <Outlet />
    }
    else if (isUninitialized) {
        content = <p>Initializing...</p>
    }
    else {
        content = <p>Token is valid</p>
    }

    return content
}

export default PersistLogin

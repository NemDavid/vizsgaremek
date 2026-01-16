import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { authStatusRequest } from "../../axios/axiosClient"
import { useNavigate } from "@tanstack/react-router"
import { Spinner } from "../../ui/spinner"

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const nav = useNavigate()

    const { data: User, isLoading } = useQuery({
        queryKey: ["auth-status"],
        queryFn: authStatusRequest,
        retry: 0,
        refetchOnWindowFocus: false,
    })

    useEffect(() => {
        if (!isLoading && User?.status !== 200) {
            nav({ to: "/" })
        }
    }, [isLoading, User, nav])

    if (isLoading) return <Spinner />
    if (User?.status !== 200) return null

    return <>{children}</>
}

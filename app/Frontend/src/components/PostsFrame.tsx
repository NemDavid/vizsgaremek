import { PostAccord } from "./post-according"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PostCreate } from "./Post-Create";
import { getPosts } from "./axios/axiosClient";
import { useQuery } from "@tanstack/react-query";

export function PostsFrame() {
    const {data: posts, isLoading} = useQuery({
        queryKey: ['Posts'],
        queryFn: () => getPosts(),
        refetchOnWindowFocus: false,
    })
    if(isLoading){
        return;
    }
    return (
    <ScrollArea className="w-full z-1">
        <main className="flex-1 h-[calc(100vh-200px)] overflow-y-auto flex justify-center">
            <div className="w-full max-w-xl flex flex-col gap-8 py-6">
            <PostCreate/>
            {posts?.map((ps)=> (
                <PostAccord post={ps}/>
            ))}
            </div>
        </main>
    </ScrollArea>
    )
}


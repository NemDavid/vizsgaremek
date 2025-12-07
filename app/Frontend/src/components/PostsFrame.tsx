import { PostAccord } from "./post-according"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PostCreate } from "./Post-Create";
import { getPosts } from "./axios/axiosClient";
import { useQuery } from "@tanstack/react-query";

export function PostsFrame() {
    const { data: posts, isLoading } = useQuery({
        queryKey: ['Posts'],
        queryFn: () => getPosts(),
        refetchOnWindowFocus: false,
        retry:0,
    })
    if (isLoading) {
        return;
    }//bg-radial from-rose-500 to-red-950
    return (
        <ScrollArea className="w-full h-full ">
            <main className="flex-1 h-[calc(100vh-99px)] overflow-y-auto flex justify-center">
                <div className="w-full max-w-xl flex flex-col gap-8 py-6">
                    <PostCreate />
                    {posts?.slice().reverse().map((ps) => (
                        <PostAccord key={ps.ID.toString()} post={ps} />
                    ))}
                </div>
            </main>
        </ScrollArea>
    )
}


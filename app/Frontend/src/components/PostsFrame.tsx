import { PostAccord } from "./post-according"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PostCreate } from "./Post-Create";
import { getPosts, getPostsAll } from "./axios/axiosClient";
import { useQuery } from "@tanstack/react-query";
import { useInfiniteQuery } from '@tanstack/react-query'
import React, { useRef, useState } from "react";
import { Spinner } from "./ui/spinner";
import { GhostPost } from "./GhostPost";

export function PostsFrame2() {
    const { data: posts, isLoading } = useQuery({
        queryKey: ['Posts'],
        queryFn: () => getPostsAll(),
        refetchOnWindowFocus: false,
        retry: 0,
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


export function PostsFrame() {
    const [pagePer] = useState(7);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const {
        data: posts,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ['Posts'],
        queryFn: ({ pageParam = 0 }) =>
            getPosts({ page: pageParam, perPage: pagePer }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        refetchOnWindowFocus: false,
        retry: 0,
    });

    const handleScroll = () => {
        
        const el = scrollRef.current;
        if (!el) return;
        
        const scrollTop = el.scrollTop;
        const scrollHeight = el.scrollHeight;
        const clientHeight = el.clientHeight;
        
        const scrolledPercent = (scrollTop + clientHeight) / scrollHeight * 100;
        if (scrolledPercent > 78 && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    if (status === 'error') return <p className="flex justify-center">More baj van</p>;

    return (
        <ScrollArea className="w-full h-full" >
            <main className="flex-1 h-[calc(100vh-99px)] overflow-y-auto flex justify-center"
                ref={scrollRef}
                onScroll={handleScroll}
            >
                <div className="w-full max-w-xl flex flex-col gap-8 py-6" >
                    <PostCreate />
                    {!posts ? (
                        <>
                            <GhostPost />
                            <GhostPost />
                            <GhostPost />
                        </>
                    ) : (
                        /* 2️⃣ posztok renderelése */
                        posts.pages.map((page, i) => (
                            <React.Fragment key={i}>
                                {page.data.map((post: any) => (
                                    <PostAccord key={post.ID} post={post} />
                                ))}
                            </React.Fragment>
                        ))
                    )}

                    {hasNextPage && <>
                        <GhostPost />
                        <GhostPost />
                        <GhostPost />
                    </>}
                </div>
            </main>
        </ScrollArea>
    );
}
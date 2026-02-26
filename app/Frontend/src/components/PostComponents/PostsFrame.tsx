import { PostAccord } from "./post-according"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PostCreate } from "./Post-Create";
import { getPosts } from "../axios/axiosClient";
import { useInfiniteQuery } from '@tanstack/react-query'
import React, { useRef, useState } from "react";
import { GhostPost } from "../custom/GhostPost";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";



export function PostsFrame() {
    const [pagePer] = useState(7);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const {
        data: posts,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        refetch: Ujra
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


    return (
        <ScrollArea className="m-1! max-w-full h-full bg-white rounded-3xl">
            {status === "error" ?
                <>
                    <Card className='bg-red-200  rounded-xl p-4 m-20'>
                        <CardHeader>
                            <CardTitle>Hiba</CardTitle>
                        </CardHeader>
                        <CardContent className='flex gap-4 flex-wrap'>
                            <p className="flex justify-center">Hiba történt! Töltsd újra az oldalt, vagy próbáld később.</p>
                            <Button onClick={() => Ujra()}>Oldal újra Töltése</Button>
                        </CardContent>
                    </Card>
                </>
                :
                <>
                    <main className="flex-1 h-[calc(100vh-90px)] overflow-y-auto flex justify-center"
                        ref={scrollRef}
                        onScroll={handleScroll}
                    >
                        <div className="w-full max-w-xl flex flex-col gap-8 py-6">
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
                            <div className="p-6"></div>
                        </div>
                    </main>
                </>

            }
        </ScrollArea>
    );
}
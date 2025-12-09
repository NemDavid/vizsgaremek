import { PostAccord } from "./post-according"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PostCreate } from "./Post-Create";
import { getPosts, getPostsAll } from "./axios/axiosClient";
import { useQuery } from "@tanstack/react-query";
import { useInfiniteQuery } from '@tanstack/react-query'
import React, { useState } from "react";
import { Spinner } from "./ui/spinner";

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

{/* <ScrollArea className="w-full h-full ">
    <main className="flex-1 h-[calc(100vh-99px)] overflow-y-auto flex justify-center">
        <div className="w-full max-w-xl flex flex-col gap-8 py-6">
            <PostCreate />
            {posts?.page.map((ps, i) => (
                <PostAccord key={i} post={ps} />
            ))}
        </div>
        <div>
            <button
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetching}
            >
                {isFetchingNextPage
                    ? 'Loading more...'
                    : hasNextPage
                        ? 'Load More'
                        : 'Nothing more to load'}
            </button>
        </div>
        <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
    </main>
</ScrollArea> */}

export function PostsFrame1() {
    const [pagePer] = useState(5);

    const { data: posts, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status,
    } = useInfiniteQuery({
        queryKey: ['Posts'],
        queryFn: ({ pageParam: page }) => getPosts({ page, perPage: pagePer }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
        refetchOnWindowFocus: false,
        retry: 0,
    })
    console.log(posts);

    return status === 'pending' ? (<p>Loading...</p>) : status === 'error' ? (<p>Error: {error.message}</p>) :
        (
            <ScrollArea className="w-full h-full ">
                <main className="flex-1 h-[calc(100vh-99px)] overflow-y-auto flex justify-center">
                    <div className="w-full max-w-xl flex flex-col gap-8 py-6">
                        <PostCreate />
                        {posts?.pages.map((ps, i) => (
                            // <PostAccord key={i} post={ps} />
                            <p key={i}>asd</p>
                        ))}
                        <div>
                            <button
                                onClick={() => fetchNextPage()}
                                disabled={!hasNextPage || isFetching}
                            >
                                {isFetchingNextPage
                                    ? 'Loading more...'
                                    : hasNextPage
                                        ? 'Load More'
                                        : 'Nothing more to load'}
                            </button>
                        </div>
                        <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
                    </div>
                </main>
            </ScrollArea>
        )
}

{/* <>
    {posts.pages.map((group, i) => (
        <React.Fragment key={i}>
            {group.data.map((project: any) => (
                <p key={project.ID}>1</p>
            ))}
        </React.Fragment>
    ))}
    <div>
        <button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetching}
        >
            {isFetchingNextPage
                ? 'Loading more...'
                : hasNextPage
                    ? 'Load More'
                    : 'Nothing more to load'}
        </button>
    </div>
    <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
</> */}

export function PostsFrame() {
    const [pagePer] = useState(7);

    const {
        data: posts,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
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
    console.log(posts)
    if (status === 'pending') return <Spinner/>;
    if (status === 'error') return <p className="flex justify-center">More baj van</p>;

    return (
        <ScrollArea className="w-full h-full">
            <main className="flex-1 h-[calc(100vh-99px)] overflow-y-auto flex justify-center">
                <div className="w-full max-w-xl flex flex-col gap-8 py-6">
                    <PostCreate />

                    {posts.pages.map((page, i) => (
                        <React.Fragment key={i}>
                            {page.data.map((post:any) => (
                                <PostAccord key={post.ID} post={post} />
                            ))}
                        </React.Fragment>
                    ))}

                    <button
                        onClick={() => fetchNextPage()}
                        disabled={!hasNextPage || isFetching}
                    >
                        {isFetchingNextPage
                            ? <Spinner/>
                            : hasNextPage
                                ? 'Load More'
                                : 'Nothing more to load'}
                    </button>

                    {isFetching && !isFetchingNextPage && <p>Fetching...</p>}
                </div>
            </main>
        </ScrollArea>
    );
}
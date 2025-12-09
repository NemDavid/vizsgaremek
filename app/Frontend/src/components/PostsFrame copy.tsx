// import React, { useState } from "react";
// import { getPosts } from "./axios/axiosClient";
// import { useInfiniteQuery } from "@tanstack/react-query";
// import { Spinner } from "./ui/spinner";
// import InfiniteScroll from "react-infinite-scroll-component";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// export function PostsFrame() {
//   const [perPage] = useState<number>(15);

//   const {
//     data,
//     isLoading,
//     isError,
//     isFetching,
//     isFetchingNextPage,
//     fetchNextPage,
//     hasNextPage,
//   } = useInfiniteQuery({
//     queryKey: ["posts", perPage],
//     queryFn: ({ pageParam = 1 }) => getPosts({ page: pageParam, perPage }),
//     getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
//   });

//   if (isLoading) return <p>Loading...</p>;
//   if (isError) return <span>Error...</span>;

//   return (
//     <div>
//       <h1>Infinite Loading</h1>
//       <InfiniteScroll
//         dataLength={data?.pages.flatMap((p) => p.data).length || 0}
//         next={() => fetchNextPage()}
//         hasMore={!!hasNextPage}
//         loader={<Spinner />}
//         endMessage={<p style={{ textAlign: "center" }}>No more posts</p>}
//       >
//         {data?.pages.map((page) =>
//           page.data.map((project) => (
//             <p
//               key={project.id}
//               style={{
//                 border: "1px solid gray",
//                 borderRadius: "5px",
//                 padding: "1rem",
//                 marginBottom: "1rem",
//                 background: `hsla(${project.id * 30}, 60%, 80%, 1)`,
//               }}
//             >
//               {project.name}
//             </p>
//           ))
//         )}
//       </InfiniteScroll>

//       {isFetching && !isFetchingNextPage ? "Background Updating..." : null}

//       <hr />
//       <ReactQueryDevtools initialIsOpen={false} />
//     </div>
//   );
// }

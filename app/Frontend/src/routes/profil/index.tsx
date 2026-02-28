import { GetusersByname } from "@/components/axios/axiosClient"
import { AuthGuard } from "@/components/custom/AuthGuard"
import { AvatarFrame } from "@/components/custom/AvatarFrame"
import { DefaultUIFrame } from "@/components/custom/DefaultUIFrame"
import { Loader } from "@/components/Loader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useMemo, useState } from "react"
import { z } from "zod"

export const Route = createFileRoute("/profil/")({
  validateSearch: z.object({
    page: z.coerce.number().int().min(1).catch(1),
    q: z.string().catch(""),
    pageSize: z.coerce.number().int().min(1).catch(12),
  }),
  component: () => (
    <AuthGuard>
      <RouteComponent />
    </AuthGuard>
  ),
})

function getPageItems(page: number, totalPages: number) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)

  const items: (number | "…")[] = []
  const showLeftEllipsis = page > 3
  const showRightEllipsis = page < totalPages - 2

  items.push(1)
  if (showLeftEllipsis) items.push("…")

  const start = Math.max(2, page - 1)
  const end = Math.min(totalPages - 1, page + 1)

  for (let p = start; p <= end; p++) items.push(p)

  if (showRightEllipsis) items.push("…")
  items.push(totalPages)

  const out: (number | "…")[] = []
  for (const x of items) {
    if (x === "…" && out[out.length - 1] === "…") continue
    out.push(x)
  }

  return out
}

function RouteComponent() {
  const { page, q, pageSize } = Route.useSearch()
  const navigate = Route.useNavigate()

  const [search, setSearch] = useState(q ?? "")
  const [debounced, setDebounced] = useState(q ?? "")

  // debounce
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 300)
    return () => clearTimeout(t)
  }, [search])

  // URL sync q
  useEffect(() => {
    navigate({
      to: "/profil",
      search: (prev) => ({
        ...prev,
        q: debounced,
        page: 1,
      }),
      replace: true,
    })
  }, [debounced, navigate])

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["GetUsers", debounced, page, pageSize],
    queryFn: () =>
      GetusersByname({
        q: debounced,
        page,
        pageSize,
      }),
    enabled: debounced.length >= 3,
    retry: 0,
    refetchOnWindowFocus: false,
    staleTime: 10_000,
    gcTime: 5 * 60_000,
  })

  const items = data?.data.items ?? []
  const total = data?.data.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const goPage = (p: number) => {
    navigate({
      to: "/profil",
      search: (prev) => ({ ...prev, page: p }),
    })
  }

  const pageItems = useMemo(
    () => getPageItems(page, totalPages),
    [page, totalPages]
  )
  return (
    <DefaultUIFrame className="p-6">
      {/* fontos: a gyerek töltse ki a DefaultUIFrame belső magasságát */}
      <div className="h-full min-h-0 flex flex-col bg-red-900 rounded-xl">
        {/* kereső fixen felül */}
        <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-md shrink-0">
          <Input
            type="text"
            placeholder="Felhasználó név"
            className="h-8 bg-rose-200"
            value={search}
            onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
          />
        </div>

        {/* scrollozható rész: itt nem fog rámenni a footerre */}
        <div className="mt-3 flex-1 min-h-0 overflow-y-auto pb-28">
          <div className="flex flex-wrap">
            {isLoading || isFetching ? (
              <Loader />
            ) : (
              <>
                {items.map((e: any) => (
                  <div
                    key={e.ID}
                    className="flex items-center gap-3 p-3 m-2 bg-rose-100 rounded-xl"
                  >
                    <AvatarFrame userid={e.ID} userData={e} className="rounded-xl" />
                    <Button onClick={()=>navigate({to:"/profil/$profilId", params:{profilId:e.ID}})}>Open</Button>
                  </div>
                ))}

                {debounced.length >= 3 && items.length === 0 && (
                  <div className="mt-4 text-sm opacity-70 bg-rose-100 p-2 rounded-xl">
                    Nincs találat.
                  </div>
                )}
              </>
            )}
          </div>

          {/* Pagination is bent van a scrollban, de a pb-28 miatt nem takarja a footer */}
          {debounced.length >= 3 && totalPages > 1 && (
            <div className="bg-red-200 p-3 rounded-xl m-2">
              <Pagination className="mt-2">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (page > 1) goPage(page - 1)
                      }}
                      className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {pageItems.map((it, idx) => (
                    <PaginationItem key={`${it}-${idx}`}>
                      {it === "…" ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          href="#"
                          isActive={it === page}
                          onClick={(e) => {
                            e.preventDefault()
                            goPage(it)
                          }}
                        >
                          {it}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (page < totalPages) goPage(page + 1)
                      }}
                      className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </DefaultUIFrame>
  )

}

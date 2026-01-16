// GhostPost.tsx
import { Card, CardContent } from "@/components/ui/card";

export function GhostPost() {
    return (
        <Card className="relative rounded-2xl border shadow-md bg-red-50 overflow-hidden min-h-[220px]">

            {/* fentről lefelé mozgó csík */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-x-0 -top-full h-1/2 bg-gradient-to-b from-red-50/0 via-red-100/80 to-red-50/0 animate-[ghostStripe_1.3s_linear_infinite]" />
            </div>

            <CardContent className="p-0">
                {/* felső rész */}
                <div className="flex items-center gap-3 bg-red-50 w-full px-4 py-3 border-b animate-pulse">
                    <div className="h-10 w-10 rounded-full bg-red-200" />
                    <div className="h-4 w-2/3 rounded bg-red-200" />
                </div>

                {/* tartalom skeleton */}
                <div className="bg-red-100 px-4 py-3 animate-pulse">
                    <div className="space-y-2">
                        <div className="h-3 w-full rounded bg-red-200" />
                        <div className="h-3 w-5/6 rounded bg-red-200" />
                        <div className="h-3 w-4/6 rounded bg-red-200" />
                    </div>

                    <div className="mt-4 h-32 w-full rounded-lg bg-red-200" />
                </div>
            </CardContent>
        </Card>
    );
}

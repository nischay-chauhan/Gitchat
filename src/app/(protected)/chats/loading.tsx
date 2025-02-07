import { Skeleton } from "@/components/ui/skeleton"

export default function ChatsLoading() {
  return (
    <div className="flex h-full gap-4">
      {/* Sidebar */}
      <div className="w-64 border-r p-4 space-y-4">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        ))}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 space-y-4 p-4">
        <Skeleton className="h-8 w-[200px]" />
        
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-20 w-[400px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 
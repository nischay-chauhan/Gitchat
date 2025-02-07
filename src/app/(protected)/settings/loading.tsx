import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-[150px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>

      
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-4 p-4 border rounded-lg">
          <Skeleton className="h-6 w-[200px]" />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[250px]" />
              </div>
              <Skeleton className="h-8 w-[100px]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 
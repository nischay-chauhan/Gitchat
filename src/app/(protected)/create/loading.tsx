import { Skeleton } from "@/components/ui/skeleton"

export default function CreateProjectLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto p-6">
      <div className="w-full space-y-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-40 w-40 rounded-full mx-auto" />
          <Skeleton className="h-8 w-[250px] mx-auto" />
          <Skeleton className="h-4 w-[300px] mx-auto" />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[140px]" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full mt-6" />
        </div>
      </div>
    </div>
  )
} 
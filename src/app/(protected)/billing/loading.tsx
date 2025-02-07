import { Skeleton } from "@/components/ui/skeleton"

export default function BillingLoading() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-[150px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>

      {/* Current Plan */}
      <div className="p-6 border rounded-lg space-y-4">
        <Skeleton className="h-6 w-[120px]" />
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-[150px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
          <Skeleton className="h-10 w-[120px]" />
        </div>
      </div>

      {/* Billing History */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-[150px]" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
              <Skeleton className="h-4 w-[100px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 
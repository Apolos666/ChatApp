import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

interface RoomsTableSkeletonProps {
    columnsCount: number
    rowsCount?: number
}

export const RoomsTableSkeleton = ({ columnsCount, rowsCount = 10 }: RoomsTableSkeletonProps) => {
    return (
        <>
            {Array.from({ length: rowsCount }).map((_, index) => (
                <TableRow key={index}>
                    {Array.from({ length: columnsCount }).map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                            {cellIndex === 0 ? (                        // Checkbox cell
                                <Skeleton className="h-4 w-4" />
                            ) : cellIndex === columnsCount - 1 ? (      // Actions cell
                                <div className="flex justify-center">
                                    <Skeleton className="h-4 w-8" />
                                </div>
                            ) : (                                       // Other cells
                                <Skeleton className="h-6 w-full" />
                            )}
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    )
}
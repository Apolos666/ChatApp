import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Table } from "@tanstack/react-table";

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
}

export function DataTablePagination<TData>({
    table,
}: DataTablePaginationProps<TData>) {
    return (
        <div className="flex items-center gap-4">
            
            <Pagination>
                <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            table.previousPage();
                        }}
                        className={
                            !table.getCanPreviousPage()
                                ? "pointer-events-none opacity-50"
                                : undefined
                        }
                    />
                </PaginationItem>

                {table.getPageCount() > 5 ? (
                    <>
                        {/* First two pages always visible */}
                        <PaginationItem>
                            <PaginationLink
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    table.setPageIndex(0);
                                }}
                                isActive={
                                    table.getState().pagination.pageIndex === 0
                                }
                            >
                                1
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    table.setPageIndex(1);
                                }}
                                isActive={
                                    table.getState().pagination.pageIndex === 1
                                }
                            >
                                2
                            </PaginationLink>
                        </PaginationItem>

                        {/* Show ellipsis */}
                        {table.getState().pagination.pageIndex === 0 && (
                            <PaginationItem>
                                <PaginationLink
                                    href="#"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    ...
                                </PaginationLink>
                            </PaginationItem>
                        )}

                        {/* Show page 3 and 4 when on page 2 or 3 */}
                        {(table.getState().pagination.pageIndex === 1 ||
                            table.getState().pagination.pageIndex === 2) && (
                            <>
                                <PaginationItem>
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            table.setPageIndex(2);
                                        }}
                                        isActive={
                                            table.getState().pagination
                                                .pageIndex === 2
                                        }
                                    >
                                        3
                                    </PaginationLink>
                                </PaginationItem>
                                {table.getState().pagination.pageIndex ===
                                    2 && (
                                    <PaginationItem>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                table.setPageIndex(3);
                                            }}
                                        >
                                            4
                                        </PaginationLink>
                                    </PaginationItem>
                                )}
                                <PaginationItem>
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        ...
                                    </PaginationLink>
                                </PaginationItem>
                            </>
                        )}

                        {/* Middle pages, show ellipsis both sides */}
                        {table.getState().pagination.pageIndex >= 3 &&
                            table.getState().pagination.pageIndex <=
                                table.getPageCount() - 4 && (
                                <>
                                    <PaginationItem>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => e.preventDefault()}
                                        >
                                            ...
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                table.setPageIndex(
                                                    table.getState().pagination
                                                        .pageIndex - 1
                                                );
                                            }}
                                        >
                                            {
                                                table.getState().pagination
                                                    .pageIndex
                                            }
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink
                                            href="#"
                                            isActive={true}
                                            onClick={(e) => e.preventDefault()}
                                        >
                                            {table.getState().pagination
                                                .pageIndex + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                table.setPageIndex(
                                                    table.getState().pagination
                                                        .pageIndex + 1
                                                );
                                            }}
                                        >
                                            {table.getState().pagination
                                                .pageIndex + 2}
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => e.preventDefault()}
                                        >
                                            ...
                                        </PaginationLink>
                                    </PaginationItem>
                                </>
                            )}

                        {/* Last pages handling */}
                        {table.getState().pagination.pageIndex ===
                            table.getPageCount() - 3 && (
                            <>
                                <PaginationItem>
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        ...
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            table.setPageIndex(
                                                table.getPageCount() - 4
                                            );
                                        }}
                                    >
                                        {table.getPageCount() - 3}
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            table.setPageIndex(
                                                table.getPageCount() - 3
                                            );
                                        }}
                                        isActive={true}
                                    >
                                        {table.getPageCount() - 2}
                                    </PaginationLink>
                                </PaginationItem>
                            </>
                        )}

                        {/* When on page last - 1 */}
                        {table.getState().pagination.pageIndex ===
                            table.getPageCount() - 2 && (
                            <>
                                <PaginationItem>
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        ...
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            table.setPageIndex(
                                                table.getPageCount() - 3
                                            );
                                        }}
                                    >
                                        {table.getPageCount() - 2}
                                    </PaginationLink>
                                </PaginationItem>
                            </>
                        )}

                        {/* When on page last */}
                        {table.getState().pagination.pageIndex ===
                            table.getPageCount() - 1 && (
                            <>
                                <PaginationItem>
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        ...
                                    </PaginationLink>
                                </PaginationItem>
                            </>
                        )}

                        {/* Last two pages always visible */}
                        <PaginationItem>
                            <PaginationLink
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    table.setPageIndex(
                                        table.getPageCount() - 2
                                    );
                                }}
                                isActive={
                                    table.getState().pagination.pageIndex ===
                                    table.getPageCount() - 2
                                }
                            >
                                {table.getPageCount() - 1}
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    table.setPageIndex(
                                        table.getPageCount() - 1
                                    );
                                }}
                                isActive={
                                    table.getState().pagination.pageIndex ===
                                    table.getPageCount() - 1
                                }
                            >
                                {table.getPageCount()}
                            </PaginationLink>
                        </PaginationItem>
                    </>
                ) : (
                    // Original pagination for 5 or fewer pages
                    Array.from(
                        { length: table.getPageCount() },
                        (_, i) => i + 1
                    ).map((page) => (
                        <PaginationItem key={page}>
                            <PaginationLink
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    table.setPageIndex(page - 1);
                                }}
                                isActive={
                                    table.getState().pagination.pageIndex ===
                                    page - 1
                                }
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    ))
                )}

                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            table.nextPage();
                        }}
                        className={
                            !table.getCanNextPage()
                                ? "pointer-events-none opacity-50"
                                : undefined
                        }
                    />
                </PaginationItem>
            </PaginationContent>
            </Pagination>
        </div>
    );
}

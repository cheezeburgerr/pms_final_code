import { Link } from "@inertiajs/react";
import { IconCheck, IconChevronDown, IconChevronLeft, IconChevronRight, IconChevronUp, IconChevronsLeft, IconChevronsRight, IconEye } from "@tabler/icons-react";
import React from "react";
import { useTable, usePagination, useGlobalFilter, useSortBy } from "react-table";
import TextInput from "./TextInput";
import SecondaryButton from "./SecondaryButton";

// A simple default filter UI for search
function GlobalFilter({ globalFilter, setGlobalFilter }) {
    return (
        <span>
            <TextInput
                value={globalFilter || ""}
                onChange={(e) => setGlobalFilter(e.target.value || undefined)}
                placeholder="Search"
                style={{
                    fontSize: '1.1rem',
                    margin: '0.5rem',
                }}
            />
        </span>
    );
}

function Table({ columns, data }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        page, // Instead of using rows, we'll use page
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize, globalFilter },
        setGlobalFilter,
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 }, // Pass our default page index here
        },
        useGlobalFilter, // useGlobalFilter!
        useSortBy, // useSortBy!

        usePagination // usePagination!
    );

    // Render the UI for your table
    return (
        <>

            <div className="border dark:border-zinc-800 rounded-lg mb-4 dark:bg-zinc-900 bg-zinc-50 ">
                <div className=" flex justify-end">


                    <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
                </div>
                {rows.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full" {...getTableProps()} border="1">
                        <thead className="text-sm font-semibold">
                            {headerGroups.map((headerGroup) => (
                                <tr className="border-b dark:border-zinc-700" {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                                    {headerGroup.headers.map((column) => (
                                        <th className="text-start" {...column.getHeaderProps(column.getSortByToggleProps())} key={column.id}>
                                            <div className="flex gap-2 px-4 p-2 items-center">
                                                {column.render("Header")}
                                                <span>
                                                    {column.isSorted ? (column.isSortedDesc ? <IconChevronDown size={16} stroke={3} /> : <IconChevronUp size={16} stroke={3} />) : ''}
                                                </span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="text-xs md:text-sm" {...getTableBodyProps()}>
                            {page.map((row, i) => {
                                prepareRow(row);
                                return (
                                    <tr
                                        className="p-6 hover:dark:bg-zinc-900 hover:bg-zinc-200 border-b dark:border-zinc-700"
                                        {...row.getRowProps()}
                                        key={row.id}
                                    >
                                        {row.cells.map((cell) => {
                                            return (
                                                <td
                                                    className="hover:dark:bg-zinc-800 hover:bg-zinc-300 px-4 p-4"
                                                    {...cell.getCellProps()}
                                                    key={cell.id}
                                                >
                                                    <p className="flex">{cell.render("Cell")}</p>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    </div>
                ) : (
                    <div className="p-4 text-center text-gray-500">No records found</div>
                )}
            </div>
            {/* Pagination Controls */}
            <div className="pagination flex gap-2 justify-end">
                {/* <span>
          Go to page:{" "}
          <TextInput
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "50px" }}
          />
        </span>{" "} */}
                <select
                    className="w-32 border-zinc-300 shadow-sm dark:border-zinc-700 rounded-md dark:bg-zinc-800"
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                    }}
                >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
                <div className="flex items-center gap-x-4">
                    <span>
                        Page{" "}
                        <strong>
                            {pageIndex + 1} of {pageOptions.length}
                        </strong>{" "}
                    </span>
                    <div>
                        <SecondaryButton onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                            <IconChevronsLeft size={16} />
                        </SecondaryButton>{" "}
                        <SecondaryButton onClick={() => previousPage()} disabled={!canPreviousPage}>
                            <IconChevronLeft size={16} />
                        </SecondaryButton>{" "}
                        <SecondaryButton onClick={() => nextPage()} disabled={!canNextPage}>
                            <IconChevronRight size={16} />
                        </SecondaryButton>{" "}
                        <SecondaryButton onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                            <IconChevronsRight size={16} />
                        </SecondaryButton>{" "}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Table;

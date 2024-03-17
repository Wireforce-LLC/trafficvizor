import ViewSpinner from "@/components/ViewSpinner";
import { flexRender, useReactTable } from "@tanstack/react-table";
import { useState } from "react";
import _ from "lodash";
import {
  createColumnHelper,
  getCoreRowModel,
  TableState,
  Updater,
} from "@tanstack/table-core";
import { TableKit } from "@/app/kits/TableKit";
import {Case, If, Switch, Then} from "react-if";
import ViewErrored from "@/components/ViewErrored";
import Link from "next/link";
import { $modal } from "@/components/Modal";
import ViewRouter from "@/components/ViewRouter";
import camelCase from 'camelcase';
import {$networkKit} from "@/app/kits/NetworkKit";
import ShadowContainer from "@/components/ShadowContainer";

type Record = {
  name: string;
  path: string;
};

function ModalContent({props}: {props: any}) {
  return <If condition={_.get(props, "router", undefined)}>
    <Then>
      <ViewRouter routerName={_.get(props, "router", undefined)}/>
    </Then>
  </If>
}

export default function TableRouters() {
  const { component, openModalWithProps } = $modal(
      "Router view",
      props => <ModalContent props={props}/>
  )

  const {value: routers, forceUpdate} = $networkKit.liveGetData<any[]>(
      `system/routers`,
      "GET",
      undefined,
      (data) => _.get(data, "data.data", []),
      {
        onDone() {
          setState("RENDERED");
        },
        onStart() {
          setState("FETCHING");
        },
        onError() {
        }
      },
  );

  const [state, setState] = useState<TableKit.TableState>("CREATED");

  const columnHelper = createColumnHelper<Record>(); //Pass User type as the generic TData type
  const table = useReactTable({
    data: routers || [],
    getCoreRowModel: getCoreRowModel(),
    onStateChange(updater: Updater<TableState>): void {},
    renderFallbackValue: undefined,
    state: undefined,
    columns: [
      columnHelper.accessor("name", {
        header: () => "Name",
        enableColumnFilter: true,
        cell: (info) => {
          const name: string | null =
              (routers||[])[info.row.index] || null;

          return (
              <div className="space-x-2 flex flex-row w-full items-center justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-indigo-500 animate-pulse">
                  <path fillRule="evenodd"
                        d="M9.58 1.077a.75.75 0 0 1 .405.82L9.165 6h4.085a.75.75 0 0 1 .567 1.241l-6.5 7.5a.75.75 0 0 1-1.302-.638L6.835 10H2.75a.75.75 0 0 1-.567-1.241l6.5-7.5a.75.75 0 0 1 .897-.182Z"
                        clipRule="evenodd"/>
                </svg>

                <div className="flex flex-col">
                  <span>{camelCase(name || "-")}</span>
                  <span className="text-gray-500 italic">
                    <span>ID: </span>
                    <span>{name}</span>
                  </span>
                </div>
              </div>
          );
        },
      }),

      columnHelper.accessor("path", {
        header: () => "Path",
        enableColumnFilter: true,
        cell: (info) => {
          const path: string | null =
              (routers||[])[info.row.index] || null;

          const host = localStorage.getItem('host')

          return (
              <div className="space-x-1 flex flex-row items-center justify-start">
              <p className="text-gray-500 hover:text-gray-800">
                {host + "/router/" + path || "-"}
              </p>
            </div>
          );
        },
      }),
    ],
  });

  return {
    element: () => <ShadowContainer>
          <Switch>
            <Case condition={state == "RENDERED"}>
              <table className="table table-fixed text-xs h-full w-full">
                <thead className="text-xs border-b border-gray-200 table-header text-left text-gray-700 uppercase">
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="text-left">
                      {headerGroup.headers.map((header) => (
                          <th
                              key={header.id}
                              className="p-2"
                              scope="col"
                              colSpan={header.colSpan}
                              style={{ width: `${header.getSize()}px` }}
                          >
                            {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext(),
                                )}
                          </th>
                      ))}
                    </tr>
                ))}
                </thead>
                <tbody className="divide-gray-100 divide-y">
                {table.getRowModel().rows.map((row, index) => (
                    <tr
                        key={row.id}
                        className='cursor-pointer hover:bg-gray-50'
                    >
                      {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="p-2" onClick={() =>
                              openModalWithProps({ router: (routers||[])[index] })
                          }>
                            {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                            )}
                          </td>
                      ))}
                    </tr>
                ))}
                </tbody>
                <tfoot>
                {table.getFooterGroups().map((footerGroup) => (
                    <tr key={footerGroup.id}>
                      {footerGroup.headers.map((header) => (
                          <th key={header.id}>
                            {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.footer,
                                    header.getContext(),
                                )}
                          </th>
                      ))}
                    </tr>
                ))}
                </tfoot>
              </table>
            </Case>

            <Case condition={state == "FETCHING"}>
              <div className="p-4">
                <ViewSpinner
                    text="We upload all information about created requests to existing routers"
                    safePadding
                />
              </div>
            </Case>

            <Case condition={state == "ERRORED"}>
              <div className="p-4">
                <ViewErrored
                    text="We bring our changes. Failed to load information. Network error"
                    safePadding
                />
              </div>
            </Case>
          </Switch>
        </ShadowContainer>,
    modalComponent: component,
  }
}

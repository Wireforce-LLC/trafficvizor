import ViewSpinner from "@/components/ViewSpinner";
import { flexRender, useReactTable } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import axios from "axios";
import _ from "lodash";
import {
  createColumnHelper,
  getCoreRowModel,
  TableState,
  Updater,
} from "@tanstack/table-core";
import moment from "moment/moment";
import { TableKit } from "@/app/kits/TableKit";
import {Case, If, Switch, Then} from "react-if";
import SharedIconApple from "@/components/SharedIconApple";
import SharedIconCloudflare from "@/components/SharedIconCloudflare";
import SharedIconGoogle from "@/components/SharedIconGoogle";
import SharedIconMTS from "@/components/SharedIconMTS";
import ViewErrored from "@/components/ViewErrored";
import { $pluginKit } from "@/app/kits/PluginKit";
import Link from "next/link";
import { $modal } from "@/components/Modal";
import JsonView from "@uiw/react-json-view";
import ViewRouter from "@/components/ViewRouter";
import camelCase from 'camelcase';

type Record = {
  name: string;
  path: string;
};

export default function TableRouters() {
  const { component, openModalWithProps } = $modal("Router view", (props) => {
    return <ViewRouter routerName={_.get(props, "router", undefined)}/>
  });

  const [routers, setRouters] = useState<Record[]>([]);
  const [state, setState] = useState<TableKit.TableState>("CREATED");

  useEffect(() => {
    setState("FETCHING");

    $pluginKit.getConfigs().then((config) => {
      const baseUrl = _.get(config, "main.network.trafficLightUri");
      const params = new URLSearchParams();

      axios
        .get(`${baseUrl}/system/routers`, {
          headers: {
            Authorization: _.get(config, "main.network.trafficLightAuthHeader"),
          },
          params,
        })
        .then((data) => {
          setRouters(
            _.get(data.data, "data", null)?.map((i) => {
              return {
                name: i,
                path: `${baseUrl}/router/${i}`,
              };
            }),
          );
          setState("RENDERED");
        })
        .catch((e) => setState("ERRORED"));
    });
  }, []);

  const columnHelper = createColumnHelper<Record>(); //Pass User type as the generic TData type
  const table = useReactTable({
    data: routers,
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
            _.get(routers[info.row.index], "name") || null;

          return (
              <div className="space-x-2 flex flex-row items-center justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-indigo-500 animate-pulse">
                  <path fillRule="evenodd"
                        d="M9.58 1.077a.75.75 0 0 1 .405.82L9.165 6h4.085a.75.75 0 0 1 .567 1.241l-6.5 7.5a.75.75 0 0 1-1.302-.638L6.835 10H2.75a.75.75 0 0 1-.567-1.241l6.5-7.5a.75.75 0 0 1 .897-.182Z"
                        clipRule="evenodd"/>
                </svg>

                <span>{camelCase(name || "-")}</span>
                <span className="text-gray-500 italic">{name}</span>
              </div>
          );
        },
      }),

      columnHelper.accessor("path", {
        header: () => "Path",
        enableColumnFilter: true,
        cell: (info) => {
          const path: string | null =
              _.get(routers[info.row.index], "path") || null;

          return (
              <div className="space-x-1 flex flex-row items-center justify-start">
              <Link
                className="text-blue-500 hover:text-blue-800"
                href={path || "/#"}
                target={"_blank"}
              >
                {path || "-"}
              </Link>
            </div>
          );
        },
      }),
    ],
  });

  return (
    <div>
      {component}

      <div className="border border-gray-200 rounded-md overflow-x-auto">
        <Switch>
          <Case condition={state == "RENDERED"}>
            <table className="table table-fixed text-xs h-full w-full">
              <thead className="text-xs table-header text-left text-gray-700 uppercase">
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
              <tbody>
                {table.getRowModel().rows.map((row, index) => (
                  <tr
                    key={row.id}
                    onClick={() =>
                      openModalWithProps({ router: routers[index].name })
                    }
                    className={`border-b border-gray-200 cursor-pointer hover:bg-orange-50 ${!(index % 2) ? "bg-gray-100" : "bg-white"}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-2">
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
      </div>
    </div>
  );
}

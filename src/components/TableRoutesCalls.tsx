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
import { Case, If, Switch } from "react-if";
import SharedIconApple from "@/components/SharedIconApple";
import SharedIconCloudflare from "@/components/SharedIconCloudflare";
import SharedIconGoogle from "@/components/SharedIconGoogle";
import SharedIconMTS from "@/components/SharedIconMTS";
import ViewErrored from "@/components/ViewErrored";
import { $pluginKit } from "@/app/kits/PluginKit";
import { $networkKit } from "@/app/kits/NetworkKit";
import * as queryString from "querystring";
import { BSON, EJSON, ObjectId } from "bson";
import { $modal } from "@/components/Modal";

interface Props {
  readonly onItemSelected: (row: any) => void;
}

type Record = {
  _if: boolean;
  clickAt: string;
  path: string;
  country: string;
  asnDomain: string;
  ua: string;
  group: string;
};

export default function TableRoutesCalls({ onItemSelected }: Props) {
  const [state, setState] = useState<TableKit.TableState>("FETCHING");

  const [startTime, setStartTime] = useState(
    moment().startOf("month").toISOString(),
  );
  const [endTime, setEndTime] = useState(moment().endOf("month").toISOString());
  const [limit, setLimit] = useState(512);
  const [sort, setSort] = useState<"abc" | "cba">("cba");
  const [path, setPath] = useState<string>();
  const [showNoIndex, setShowNoIndex] = useState<boolean>(false);
  const [metaGroup, setMetaGroup] = useState<string | undefined>(undefined);

  const { component, toggle, openModalWithProps } = $modal("Filter", (props) => (
    <div className="space-y-2">
      <div className="space-y-4 px-4 py-2">
        <div>
          <label
              htmlFor="path"
              className="w-full block text-sm text-gray-600 mb-2 font-regular"
          >
            Path
          </label>
          <input
              id="path"
              onChange={(e) => setPath(e.target.value)}
              className="py-2 w-full font-semibold bg-gray-50 text-xs border border-gray-200 rounded px-3"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 bg-gray-100 rounded-lg px-3 py-3">
          <div className="w-full bg-lime-50 shadow-lg shadow-lime-100 border-lime-500 border px-2 py-2 rounded-lg">
            <label
                htmlFor="sort"
                className="w-full block text-sm text-lime-500 font-semibold mb-2 font-regular"
            >
              Sort records by
            </label>
            <select
                id="sort"
                onChange={(e) =>
                    setSort(e.target.value.toLowerCase() as "cba" | "abc")
                }
                className="py-2 w-full font-semibold bg-lime-200 text-xs border border-lime-300 rounded px-3"
            >
              <option disabled>Sort type</option>
              <option value="abc">ABC (from 0 to 9)</option>
              <option value="cba">CBA (from 9 to 0)</option>
            </select>
          </div>

          <div  className="w-full bg-lime-50 shadow-lg shadow-lime-100 border-lime-500 border px-2 py-2 rounded-lg">
            <label
                htmlFor="limit"
                className="w-full block text-sm text-gray-600 mb-2 font-regular"
            >
              Limit
            </label>

            <input
                id="limit"
                className="py-2 w-full font-semibold bg-lime-200 text-xs border border-lime-300 rounded px-3"
                type="number"
                onChange={(e) => {
                  setLimit(e.target.value)
                }}
            />
          </div>

          <div>
            <label
                htmlFor="timeRange"
                className="w-full block text-sm text-gray-600 mb-2 font-regular"
            >
              Time range
            </label>

            <div className="flex flex-row space-x-2">
              <input
                  onChange={(e) => {
                    setStartTime(moment(e.target.value).toISOString());
                  }}
                  className="py-2 font-semibold bg-gray-50 text-xs border border-gray-200 rounded px-3"
                  type="date"
              />

              <input
                  onChange={(e) => {
                    setEndTime(moment(e.target.value).toISOString());
                  }}
                  className="py-2 font-semibold bg-gray-50 text-xs border border-gray-200 rounded px-3"
                  type="date"
              />
            </div>
          </div>
        </div>

        <hr/>

        <div>
          <label
              htmlFor="index"
              className="w-full block text-sm text-gray-600 mb-2 font-regular"
          >
            Show no-index
          </label>

          <select
              id="index"
              onChange={(e) =>
                  setShowNoIndex(e.target.value.toLowerCase() === "true")
              }
              className="py-2 w-full font-semibold bg-gray-50 text-xs border border-gray-200 rounded px-3"
          >
            <option disabled>Show noindex</option>
            <option value="true">Yes</option>
            <option value="false" selected>No</option>
          </select>

          <p className="text-gray-400 text-xs mt-2">
            If you specify meta.noindex: true in the router configuration, then such requests will not fall into
            galvanic injections, but they can be obtained through filtering
          </p>
        </div>

        <div>
          <label
              htmlFor="metaGroup"
              className="w-full block text-sm text-gray-600 mb-2 font-regular"
          >
            Meta group
          </label>
          <input
              id="metaGroup"
              value={metaGroup}
              onChange={(e) => setMetaGroup(e.target.value)}
              className="py-2 w-full font-semibold bg-gray-50 text-xs border border-gray-200 rounded px-3"
          />
          <p className="text-gray-400 text-xs mt-2">
            If you specify meta,group in the router configuration, you can group all requests into a specific group
          </p>
        </div>
      </div>

      <div className="bg-gray-50 w-full p-4">
        <button
            onClick={() => toggle(false)}
            className="w-full hover:outline hover:outline-1 hover:outline-lime-500 active:bg-lime-600 outline-offset-1 py-2 text-white font-semibold text-sm text-md bg-lime-500 rounded-md">
          Apply filters
        </button>
      </div>
    </div>
  ));

  const params = queryString.stringify({
    sort,
    limit,
    startTime,
    endTime,
  });

  useEffect(() => {
    forceUpdate();
  }, [metaGroup, showNoIndex, limit, sort, path, startTime, endTime]);

  const {value: requests, forceUpdate} = $networkKit.liveGetData<any[]>(
      `dataset/select?${params}`,
      "POST",
    _.pickBy(
      {
        path,
        "meta.group": metaGroup,
        "meta.noindex": {
          $ne: !showNoIndex,
        },
      },
      _.identity,
    ),
    (data) => _.get(data, "data.data", []),
    {
      onDone() {
        setState("RENDERED");
      },
      onStart() {
        setState("FETCHING");
      },
    },
  );

  const columnHelper = createColumnHelper<Record>(); //Pass User type as the generic TData type
  const table = useReactTable({
    data: requests || [],
    getCoreRowModel: getCoreRowModel(),
    onStateChange(updater: Updater<TableState>): void {},
    renderFallbackValue: undefined,
    state: undefined,
    columns: [
      columnHelper.accessor("_if", {
        enableHiding: true,
        enableResizing: true,
        size: 35,
        header: () => "Gate",
        cell: (info) => {
          return info.getValue() ? (
            <div className="flex items-center justify-between">
              <div className="bg-lime-500 rounded-full w-3 h-3"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4 fill-lime-500 text-lime-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                />
              </svg>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="bg-red-400 rounded-full w-3 h-3"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 fill-red-400 text-red-400"
              >
                <path
                  fillRule="evenodd"
                  d="M9.53 2.47a.75.75 0 0 1 0 1.06L4.81 8.25H15a6.75 6.75 0 0 1 0 13.5h-3a.75.75 0 0 1 0-1.5h3a5.25 5.25 0 1 0 0-10.5H4.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          );
        },
      }),

      columnHelper.accessor("group", {
        enableHiding: true,
        enableResizing: true,
        size: 60,
        header: () => "Group",
        cell: (info) => {
          const groupName = _.get(
              (requests || [])[info.row.index],
              "meta.group",
              null,
          )

          return <div className="flex items-center justify-start space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-orange-500">
              <path
                  d="M3 3.5A1.5 1.5 0 0 1 4.5 2h1.879a1.5 1.5 0 0 1 1.06.44l1.122 1.12A1.5 1.5 0 0 0 9.62 4H11.5A1.5 1.5 0 0 1 13 5.5v1H3v-3ZM3.081 8a1.5 1.5 0 0 0-1.423 1.974l1 3A1.5 1.5 0 0 0 4.081 14h7.838a1.5 1.5 0 0 0 1.423-1.026l1-3A1.5 1.5 0 0 0 12.919 8H3.081Z"/>
            </svg>

            <span className="text-orange-500 font-semibold">{groupName || "-"}</span>

          </div>
        },
      }),

      columnHelper.accessor("clickAt", {
        header: () => "Click at",
        size: 80,
        enableColumnFilter: true,
        cell: (info) => (
            <div
                className={`space-x-2 ${moment(info.getValue()).diff(moment(), "days") == 0 ? "font-semibold text-indigo-500" : ""}`}
            >
              <span>{moment(info.getValue()).format("DD.MM.YYYY")}</span>
              <span className="text-gray-500">
              {moment(info.getValue()).format("HH:mm:ss")}
            </span>
            </div>
        ),
      }),

      columnHelper.accessor("asnDomain", {
        header: () => "ASN Domain",
        enableColumnFilter: true,
        size: 50,
        cell: (info) => {
          const asnDomain =
            _.get(
              (requests || [])[info.row.index],
              "remoteClientInfo.as_domain",
              null,
            ) || _.get((requests || [])[info.row.index], "as_domain", null);

          return (
            <div className="space-x-1 flex flex-row items-center justify-start">
              <Switch>
                <Case condition={asnDomain === "apple.com"}>
                  <SharedIconApple size={10} />
                </Case>
                <Case condition={asnDomain === "cloudflare.com"}>
                  <SharedIconCloudflare size={10} />
                </Case>
                <Case condition={asnDomain === "google.com"}>
                  <SharedIconGoogle size={10} />
                </Case>
                <Case
                  condition={
                    String(asnDomain).includes("mgts") ||
                    String(asnDomain).includes("mts")
                  }
                >
                  <SharedIconMTS size={10} />
                </Case>
              </Switch>
              <span>{asnDomain}</span>
            </div>
          );
        },
      }),

      columnHelper.accessor("country", {
        header: () => "Country",
        size: 80,
        cell: (info) => {
          const countryName =
            _.get(
              (requests || [])[info.row.index],
              "remoteClientInfo.country_name",
              null,
            ) ||
            _.get((requests || [])[info.row.index], "country_name", null) ||
            _.get((requests || [])[info.row.index], "country", null);

          const countryISO =
            _.get(
              (requests || [])[info.row.index],
              "remoteClientInfo.country",
              null,
            ) || _.get((requests || [])[info.row.index], "country", null);

          return (
            <span className="flex items-center justify-start space-x-2">
              <img
                width={19}
                src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${countryISO}.svg`}
                alt=""
              />

              <span>{countryName}</span>
            </span>
          );
        },
      }),

      columnHelper.accessor("path", {
        header: () => "Path",
        size: 100,
        cell: (info) => (
          <span className="flex items-center justify-start space-x-2">
            <span>{info.renderValue()}</span>
          </span>
        ),
      }),

      columnHelper.accessor("ua", {
        header: () => "UA",
        enableColumnFilter: true,
        cell: (info) => {
          const ua =
            _.get((requests || [])[info.row.index], "ua.ua", null) ||
            _.get((requests || [])[info.row.index], "headers.user-agent", null);

          return (
            <div className="space-x-1 flex flex-row items-center justify-start">
              <span>{_.take(decodeURIComponent(ua ? ua : ""), 32)}...</span>
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
            <div className="px-2 py-2 flex flex-row justify-between space-x-2 border-b border-gray-200">
              <button
                onClick={() => openModalWithProps({})}
                className="rounded-lg p-2 bg-lime-50 border border-lime-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 fill-lime-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.792 2.938A49.069 49.069 0 0 1 12 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 0 1 1.541 1.836v1.044a3 3 0 0 1-.879 2.121l-6.182 6.182a1.5 1.5 0 0 0-.439 1.061v2.927a3 3 0 0 1-1.658 2.684l-1.757.878A.75.75 0 0 1 9.75 21v-5.818a1.5 1.5 0 0 0-.44-1.06L3.13 7.938a3 3 0 0 1-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

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
                    onClick={() => {
                      onItemSelected?.((requests || [])[index] || {});
                    }}
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
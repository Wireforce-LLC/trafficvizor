import {$pluginKit} from "@/app/kits/PluginKit";
import axios from "axios";
import _ from "lodash";
import {useEffect, useState} from "react";
import {If, Then} from "react-if";
import JsonView from "@uiw/react-json-view";
import clm from 'country-locale-map';
import {$networkKit} from "@/app/kits/NetworkKit";
import Link from "next/link";
import moment from "moment";
import camelcase from "camelcase";
import humanizeString from 'humanize-string';

interface Props {
  readonly routerName?: string
}

export default function ViewRouter({routerName} : Props) {
  const [host, setHost] = useState<undefined|null|string>("")
  const {value: modalData, forceUpdate} = $networkKit.liveGetData<any[]>(
      `system/router/raw/${routerName}`,
      "GET",
      undefined,
      (data) => _.get(data, "data.data", []),
      {
        dependencies: [routerName]
      }
  );

  useEffect(() => {
    forceUpdate()
    setHost(localStorage.getItem('host'))
  }, [routerName]);

  const tools = {
    ip: _.get(_.find(_.get(modalData, 'if.tools', []), i => {
      return _.get(_.flatten(_.toPairs(i)), '0', undefined) == 'IP'
    }), 'IP', undefined)
  }

  return <div className="p-4 min-h-64 space-y-3">
    <If condition={_.isObject(modalData)}>
      <Then>
        <div className="grid gap-2 grid-cols-2 w-full">
          <div className='px-4 col-span-2 py-2 bg-gray-50 text-xs flex flex-row items-center gap-2 rounded-xl w-full'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path fill-rule="evenodd"
                    d="M8.914 6.025a.75.75 0 0 1 1.06 0 3.5 3.5 0 0 1 0 4.95l-2 2a3.5 3.5 0 0 1-5.396-4.402.75.75 0 0 1 1.251.827 2 2 0 0 0 3.085 2.514l2-2a2 2 0 0 0 0-2.828.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"/>
              <path fill-rule="evenodd"
                    d="M7.086 9.975a.75.75 0 0 1-1.06 0 3.5 3.5 0 0 1 0-4.95l2-2a3.5 3.5 0 0 1 5.396 4.402.75.75 0 0 1-1.251-.827 2 2 0 0 0-3.085-2.514l-2 2a2 2 0 0 0 0 2.828.75.75 0 0 1 0 1.06Z"
                    clipRule="evenodd"/>
            </svg>

            <Link target="_blank" href={host + "/router/" + routerName} className="text-blue-500">
              {host}/router/{routerName}
            </Link>
          </div>

          <div className='px-4 py-2 bg-gray-50 text-xs flex flex-row items-center gap-2 rounded-xl w-full'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path fill-rule="evenodd"
                    d="M8.914 6.025a.75.75 0 0 1 1.06 0 3.5 3.5 0 0 1 0 4.95l-2 2a3.5 3.5 0 0 1-5.396-4.402.75.75 0 0 1 1.251.827 2 2 0 0 0 3.085 2.514l2-2a2 2 0 0 0 0-2.828.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"/>
              <path fill-rule="evenodd"
                    d="M7.086 9.975a.75.75 0 0 1-1.06 0 3.5 3.5 0 0 1 0-4.95l2-2a3.5 3.5 0 0 1 5.396 4.402.75.75 0 0 1-1.251-.827 2 2 0 0 0-3.085-2.514l-2 2a2 2 0 0 0 0 2.828.75.75 0 0 1 0 1.06Z"
                    clipRule="evenodd"/>
            </svg>

            <Link href={"#"} className="text-blue-500">{routerName}</Link>
          </div>

          <div className='px-4 py-2 bg-gray-50 text-xs flex flex-row items-center gap-2 rounded-xl w-full'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h2.879a1.5 1.5 0 0 1 1.06.44l1.122 1.12A1.5 1.5 0 0 0 9.62 4H12.5A1.5 1.5 0 0 1 14 5.5v1.401a2.986 2.986 0 0 0-1.5-.401h-9c-.546 0-1.059.146-1.5.401V3.5ZM2 9.5v3A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5v-3A1.5 1.5 0 0 0 12.5 8h-9A1.5 1.5 0 0 0 2 9.5Z"/>
            </svg>

            <span className="text-gray-500">{_.get(modalData, 'meta.group', "-")}</span>
          </div>

        </div>

        <If condition={!_.isEmpty(_.get(tools.ip, 'country', []))}>
          <Then>
            <div>
              <p className="text-gray-500 text-xs mb-1">Allowed countries</p>
              <div className="grid gap-2 grid-cols-4 w-full">
                {
                  _.get(tools.ip, 'country', []).map((i: any) => {
                    const country = clm.getCountryByAlpha2(i)

                    if (!_.isObject(country)) {
                      return undefined
                    }

                    return <div
                        className='px-4 py-2 bg-gray-50 text-xs flex flex-row items-center gap-2 rounded-xl w-full'>
                      <span className="text-md">{country?.emoji}</span>

                      <div>
                        <p className="text-gray-600 text-xs">{country?.name}</p>
                      </div>
                    </div>
                  })
                }
              </div>
            </div>
          </Then>
        </If>

        <If condition={!_.isEmpty(_.get(modalData, 'if.filters', []))}>
          <Then>
            <div>
              <p className="text-gray-500 text-xs mb-1">Filters</p>
              <div className="grid gap-2 grid-cols-4 w-full">
                {
                  _.get(modalData, 'if.filters', []).map((filter: string) => {
                    return <div
                        className='px-4 py-2 bg-gray-50 text-xs flex flex-row items-center gap-2 rounded-xl w-full'>
                        <span className="text-gray-600 text-xs">{humanizeString(filter)}</span>
                    </div>
                  })
                }
              </div>
            </div>
          </Then>
        </If>

        <div className="bg-gray-50 px-2 py-2 h-96 rounded-xl overflow-y-auto overflow-x-hidden">
          <JsonView
              collapsed={2}
              displayDataTypes={false}
              title="Overview"
              value={modalData}
          />
        </div>
      </Then>
    </If>
  </div>
}
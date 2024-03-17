import RootLayout from "@/app/layout";
import Navbar, {PluginNavbar} from "@/components/Navbar";
import {lazy, useEffect} from "react";
import AnalyticCardAllTraffic from "@/components/AnalyticCardAllTraffic";
import ClassicLayout from "@/components/ClassicLayout";
import axios from "axios";
import {$networkKit} from "@/app/kits/NetworkKit";
import _ from "lodash";
import ShadowContainer from "@/components/ShadowContainer";
import {Else, If, Then} from "react-if";
import ViewSpinner from "@/components/ViewSpinner";


export default function Routers() {
  const { value, isLoading } = $networkKit.liveGetData(
    '/system/routers?type=nested',
    'GET',
    undefined,
    (data) => _.get(data,'data.data')
  )

  return <ClassicLayout modalComponents={[]} name="Folders">
    <ShadowContainer className="divide-gray-200 divide-y">
      <If condition={isLoading}>
        <Then>
          <ViewSpinner safePadding text="Loading information about grouped routers"/>
        </Then>
        <Else>
          {_.toPairs(Object(value || {})).map(i => (
              <div className="w-full cursor-pointer hover:bg-gray-50 items-center space-x-3 flex flex-row px-3 py-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 flex-shrink-0 fill-amber-300">
                  <path
                      d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z"/>
                </svg>

                <div className="flex flex-col w-full">
                  <span className="text-md font-semibold">{i[0] || "Uncategorized"}</span>
                  <div className="flex flex-row space-x-1">
                    {Object(i[1]).map((i: any) => {
                      return <span className="text-gray-500">{_.get(i, 'meta.name')}</span>
                    })}
                  </div>
                </div>
              </div>
          ))}
        </Else>
      </If>
    </ShadowContainer>

  </ClassicLayout>
}
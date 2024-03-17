import {lazy, useEffect} from "react";
import {$modal} from "@/components/Modal";
import JsonView from '@uiw/react-json-view';
import AnalyticCardAllTraffic from "@/components/AnalyticCardAllTraffic";
import ClassicLayout from "@/components/ClassicLayout";
import AnalyticCardThenTraffic from "@/components/AnalyticCardThenTraffic";
import {NextSeo} from "next-seo";
import ConnectModal from "@/components/ConnectModal";
import Input from "@/components/Input";
import TableRoutesCallsPackage from "@/components/TableRoutesCalls"
import Link from "next/link";
import {If, Then} from "react-if";
import _ from "lodash";
import moment from "moment/moment";
import ShadowContainer from "@/components/ShadowContainer";

export default function Requests() {
  const {component: componentOverview, openModalWithProps: openModalOverviewWithProps} = $modal(
    "Request overview",
    props => <div className="p-4 space-y-2 w-full">
      <div className="grid gap-2 grid-cols-2 w-full">
        <div className='px-4 py-2 bg-gray-50 text-xs flex flex-row items-center gap-2 rounded-xl w-full'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
            <path fill-rule="evenodd"
                  d="M8.914 6.025a.75.75 0 0 1 1.06 0 3.5 3.5 0 0 1 0 4.95l-2 2a3.5 3.5 0 0 1-5.396-4.402.75.75 0 0 1 1.251.827 2 2 0 0 0 3.085 2.514l2-2a2 2 0 0 0 0-2.828.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"/>
            <path fill-rule="evenodd"
                  d="M7.086 9.975a.75.75 0 0 1-1.06 0 3.5 3.5 0 0 1 0-4.95l2-2a3.5 3.5 0 0 1 5.396 4.402.75.75 0 0 1-1.251-.827 2 2 0 0 0-3.085-2.514l-2 2a2 2 0 0 0 0 2.828.75.75 0 0 1 0 1.06Z"
                  clipRule="evenodd"/>
          </svg>

          <Link href={"#"} className="text-blue-500">{props?.http?.httpPath}</Link>
        </div>

        <div className='px-4 py-2 bg-gray-50 text-xs flex flex-row items-center gap-2 rounded-xl w-full'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
            <path fill-rule="evenodd"
                  d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8Zm7.75-4.25a.75.75 0 0 0-1.5 0V8c0 .414.336.75.75.75h3.25a.75.75 0 0 0 0-1.5h-2.5v-3.5Z"
                  clipRule="evenodd"/>
          </svg>


          <p className="text-gray-500">
            <span className="text-gray-800">{moment(props.clickAt).format("MMMM Do YYYY, h:mm:ss a")}</span>
            <span className="text-gray-500 px-2 italic">{moment(props.clickAt).fromNow()}</span>
          </p>
        </div>

        <If condition={!_.isEmpty(_.get(props, 'ua.ua'))}>
          <Then>
            <div className='px-4 py-2 bg-gray-50 text-xs flex flex-row items-center gap-2 rounded-xl w-full'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path
                    d="M8.5 4.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10.9 12.006c.11.542-.348.994-.9.994H2c-.553 0-1.01-.452-.902-.994a5.002 5.002 0 0 1 9.803 0ZM14.002 12h-1.59a2.556 2.556 0 0 0-.04-.29 6.476 6.476 0 0 0-1.167-2.603 3.002 3.002 0 0 1 3.633 1.911c.18.522-.283.982-.836.982ZM12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
              </svg>

              <p className="text-gray-800">{decodeURI(_.get(props, 'ua.ua'))}</p>
            </div>
          </Then>
        </If>

        <If condition={!_.isEmpty(_.get(props, 'remoteClientInfo.as_name'))}>
          <Then>
            <div className='px-4 py-2 bg-gray-50 text-xs flex flex-row items-center gap-2 rounded-xl w-full'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd"
                      d="M14.188 7.063a8.75 8.75 0 0 0-12.374 0 .75.75 0 0 1-1.061-1.06c4.003-4.004 10.493-4.004 14.496 0a.75.75 0 1 1-1.061 1.06Zm-2.121 2.121a5.75 5.75 0 0 0-8.132 0 .75.75 0 0 1-1.06-1.06 7.25 7.25 0 0 1 10.252 0 .75.75 0 0 1-1.06 1.06Zm-2.122 2.122a2.75 2.75 0 0 0-3.889 0 .75.75 0 1 1-1.06-1.061 4.25 4.25 0 0 1 6.01 0 .75.75 0 0 1-1.06 1.06Zm-2.828 1.06a1.25 1.25 0 0 1 1.768 0 .75.75 0 0 1 0 1.06l-.355.355a.75.75 0 0 1-1.06 0l-.354-.354a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"/>
              </svg>


              <p className="text-gray-800">{decodeURI(_.get(props, 'remoteClientInfo.as_name'))}</p>
            </div>
          </Then>
        </If>
      </div>

      <div className="bg-gray-50 px-2 py-2 h-96 rounded-xl overflow-y-auto overflow-x-hidden">
        <JsonView collapsed={1} displayDataTypes={false} title="Overview" value={props}/>
      </div>
    </div>
  )

  const mainTableUnpacked = TableRoutesCallsPackage({
    onItemSelected: (row) => {
      openModalOverviewWithProps(row)
    }
  })

  // ConnectModal()
  return <ClassicLayout modalComponents={[ConnectModal(), componentOverview, mainTableUnpacked.modalComponent]}
                        name="Requests">

    <div className="grid gap-4 grid-cols-0 md:grid-cols-3 lg:grid-cols-4">
      <AnalyticCardAllTraffic/>
      <AnalyticCardThenTraffic/>

      <ShadowContainer className="h-28"/>
      <ShadowContainer className="h-28"/>
    </div>

    {mainTableUnpacked.element}
  </ClassicLayout>
}
import RootLayout from "@/app/layout";
import Navbar, {PluginNavbar} from "@/components/Navbar";
import {lazy} from "react";
import {$modal} from "@/components/Modal";
import JsonView from '@uiw/react-json-view';
import AnalyticCardAllTraffic from "@/components/AnalyticCardAllTraffic";
import Navigator from "@/components/Navigator";
import ClassicLayout from "@/components/ClassicLayout";
import AnalyticCardThenTraffic from "@/components/AnalyticCardThenTraffic";

const TableRoutesCalls = lazy(() => import("@/components/TableRoutesCalls"))
const AnalyticCard = lazy(() => import("@/components/AnalyticCard"))
const ViewSpinner = lazy(() => import("@/components/ViewSpinner"))

export default function Requests() {
  const {component, openModalWithProps} = $modal(
    "Request overview",
    props => (
        <div className="p-4">
          <JsonView collapsed={2} displayDataTypes={false} title="Overview" value={props}/>
        </div>
    )
  )

  return <ClassicLayout modalComponents={[component]} name="Requests">
    <div className="grid gap-4 grid-cols-0 md:grid-cols-3 lg:grid-cols-4">
      <AnalyticCardAllTraffic/>
      <AnalyticCardThenTraffic/>
      <div className="bg-gray-50 h-32 rounded px-6 py-4"></div>
      <div className="bg-gray-50 h-32 rounded px-6 py-4"></div>
    </div>

    <TableRoutesCalls onItemSelected={row => {
      openModalWithProps(row)
    }}/>
  </ClassicLayout>
}
import RootLayout from "@/app/layout";
import Navbar, {PluginNavbar} from "@/components/Navbar";
import {lazy} from "react";
import AnalyticCardAllTraffic from "@/components/AnalyticCardAllTraffic";
import ClassicLayout from "@/components/ClassicLayout";

const TableRouters = lazy(() => import("@/components/TableRouters"))

export default function Routers() {
  return <ClassicLayout modalComponents={[]} name="Routers">
    <TableRouters/>
  </ClassicLayout>
}
import {Fragment, ReactNode} from "react";
import RootLayout from "@/app/layout";
import { PluginNavbar } from "@/components/Navbar";
import Navigator, { Route } from "@/components/Navigator";
import AnalyticCardAllTraffic from "@/components/AnalyticCardAllTraffic";
import { useRouter } from "next/router";
import {NextSeo} from "next-seo";

interface Props {
  readonly children?: ReactNode;
  readonly modalComponents?: ReactNode[];
  readonly navigator?: Route[];
  readonly name?: string;
}

export default function ClassicLayout({
  children,
  name,
  navigator,
  modalComponents,
}: Props) {
  const router = useRouter();

  return (
    <RootLayout>
      <PluginNavbar activeHref={router.pathname} />

      <NextSeo
          title={"TrafficVizor | " + name}
      />

      {modalComponents?.map(modal => <Fragment children={modal}/>)}

      <div className="mx-auto container">
        <div className="my-12 block space-y-4">
          <Navigator
            routes={
              navigator || [
                { name: "Home", path: "/" },
                { name: String(name), path: router.pathname },
              ]
            }
          />

          {children}
        </div>
      </div>
    </RootLayout>
  );
}

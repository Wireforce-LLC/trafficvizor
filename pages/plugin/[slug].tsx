import RootLayout from "@/app/layout";
import Navbar, {PluginNavbar} from "@/components/Navbar";
import {Fragment, lazy, useEffect, useState} from "react";
import {$pluginKit} from "@/app/kits/PluginKit";
import {useRouter} from "next/router";
import _ from "lodash";

export default function Slug() {
  const [component, setComponent] = useState<any>()
  const router = useRouter()

  useEffect(() => {

    $pluginKit.getAllUiPlugins().then(plugins => {
      console.log(router.query)
      const item = _.find(plugins, {
        id: router.query.slug
      })

      if (item.filePath) {
        setComponent(() => lazy(() => import(item.filePath)))
      }
    })
  }, []);

  return <RootLayout>
    <PluginNavbar activeHref={'/'}/>

    <Fragment>
      Lorem ipsum dolor.
    </Fragment>
  </RootLayout>
}
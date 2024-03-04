import RootLayout from "@/app/layout";
import Navbar, {PluginNavbar} from "@/components/Navbar";
import {Fragment, lazy, Suspense, useEffect, useState} from "react";
import {$pluginKit} from "@/app/kits/PluginKit";
import {useRouter} from "next/router";
import _ from "lodash";
import ViewSpinner from "@/components/ViewSpinner";
import PluginView from "@/components/PluginView";
import dynamic from 'next/dynamic';
import ViewErrored from "@/components/ViewErrored";

export default function Slug() {
  const [pluginName, setPluginName] = useState<string|undefined>()
  const [activeHref, setActiveHref] = useState<string>('/')
  const [component, setComponent] = useState<any>(undefined)

  const router = useRouter()

  useEffect(() => {
    setActiveHref(`/plugin/${pluginName}`)

    $pluginKit.getAllUiPlugins().then(plugins => {
      const item = _.find(plugins, {
        id: pluginName
      })

      if (item?.id) {
        $pluginKit
          .getPluginLinks(item.id)
          .then(component => {
            setComponent(component)
          })
      }
    })
  }, [pluginName]);

  useEffect(() => {
    setPluginName(window.location.pathname.replace('/plugin/', ''))
  }, []);

  return <RootLayout>
    <PluginNavbar activeHref={activeHref}/>

    <Fragment>
      <Suspense fallback={<ViewSpinner text="Loading plugin"/>}>
        {typeof component == 'object' ? component.component : <ViewErrored text="Error"/>}
      </Suspense>
    </Fragment>
  </RootLayout>
}
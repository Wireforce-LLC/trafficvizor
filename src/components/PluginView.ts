"use server";

import { $pluginKit } from "@/app/kits/PluginKit";
import _ from "lodash";
import { lazy, useEffect, useState } from "react";
import { useRouter } from "next/router";

export default async function PluginView({
  pluginName,
}: {
  pluginName: string;
}) {
  const [component, setComponent] = useState<any>();
  const router = useRouter();

  // useEffect(() => {
  //   $pluginKit.getAllUiPlugins().then(plugins => {
  //     const item = _.find(plugins, {
  //       id: pluginName
  //     })
  //
  //     console.log('DATA', item)
  //
  //     if (item?.filePath) {
  //       setComponent(
  //           JSON.stringify(item?.filePath)
  //       )
  //       // setComponent(() => )
  //     }
  //   })
  // }, [pluginName]);

  return component;
}

import AnalyticCard from "@/components/AnalyticCard";
import { $pluginKit } from "@/app/kits/PluginKit";
import _ from "lodash";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { $clockKit } from "@/app/kits/ClockKit";
import { $networkKit } from "@/app/kits/NetworkKit";

export default function AnalyticCardThenTraffic() {
  const { value } = $networkKit.liveGetData<number>(
    "dataset/count",
    "POST",
    {
      _if: true,
    },
    (data) => _.get(data, "data.data.count", Infinity),
  );

  return (
    <AnalyticCard
      text="Volume of successfully passed traffic"
      value={Intl.NumberFormat("en").format(value || Infinity)}
      icon={
        <div className="w-4 h-4 mr-2 relative">
          <div className="rounded-full w-4 h-4 absolute bg-lime-500 animate-ping"></div>
          <div className="rounded-full w-4 h-4 absolute bg-lime-500"></div>
        </div>
      }
    />
  );
}

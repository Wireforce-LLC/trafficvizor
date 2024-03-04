import AnalyticCard from "@/components/AnalyticCard";
import { $pluginKit } from "@/app/kits/PluginKit";
import _ from "lodash";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { $clockKit } from "@/app/kits/ClockKit";
import { $networkKit } from "@/app/kits/NetworkKit";
import queryString from "querystring";
import moment from "moment/moment";

export default function AnalyticCardAllTraffic() {
  const params = queryString.stringify({
    startTime: moment().startOf('day').toISOString(),
    endTime: moment().endOf('day').toISOString(),
  });

  const { value: valueAllDuration } = $networkKit.liveGetData<number>(
    "dataset/count",
    "POST",
    {},
    (data) => _.get(data, "data.data.count", Infinity),
  );

  const { value: valueTodayDuration } = $networkKit.liveGetData<number>(
    `dataset/count?${params}`,
    "POST",
    {},
    (data) => _.get(data, "data.data.count", Infinity),
  );

  return (
    <AnalyticCard
      text="Number of today and all requests in the system"
      value={Intl.NumberFormat("en").format(valueTodayDuration || Infinity)}
      subValue={Intl.NumberFormat("en").format(valueAllDuration || Infinity)}
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
          />
        </svg>
      }
    />
  );
}

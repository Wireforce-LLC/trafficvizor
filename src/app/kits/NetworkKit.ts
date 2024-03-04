import {useEffect, useState} from "react";
import {$pluginKit} from "@/app/kits/PluginKit";
import _ from "lodash";
import axios from "axios";
import {$clockKit} from "@/app/kits/ClockKit";

export class NetworkKit {
  liveGetData<T>(
      path: string,
      method: 'GET'|'POST' = 'GET',
      data = {},
      getData: (it: any) => any,
      options = {
        onDone() {

        },
        onStart() {

        }
      }
  ) {
    const [value, setValue] = useState<T|undefined>()
    const [ticker, setTick] = useState<number>(0)

    const updateData = async (resolve: (value: T) => void) => {
      $pluginKit.getConfigs().then((config: any) => {
        const baseUrl = _.get(config, 'main.network.trafficLightUri')
        const params = new URLSearchParams();

        if (method == 'POST') {
          axios.post(`${baseUrl}/${path}`, data, {
            headers: {
              'Authorization': _.get(config, 'main.network.trafficLightAuthHeader')
            },
            params
          })
              .then(data => {
                resolve(getData(data))
              })
        } else {
          axios.get(`${baseUrl}/${path}`, {
            headers: {
              'Authorization': _.get(config, 'main.network.trafficLightAuthHeader')
            },
            params
          })
              .then(data => {
                resolve(getData(data))
              })
        }
      })
    }

    useEffect(() => {
      options?.onStart?.()
    }, []);

    useEffect(() => {
      updateData(i => {
        setValue(i)
        options?.onDone?.()
      })

    }, [$clockKit.getTicker(5), ticker]);

    return {
      value,
      forceUpdate() {
        setTick(ticker + 1)
      }
    }
  }
}

export const $networkKit = new NetworkKit()
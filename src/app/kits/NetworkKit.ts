import {useCallback, useEffect, useState} from "react";
import {$pluginKit} from "@/app/kits/PluginKit";
import _ from "lodash";
import axios from "axios";
import {$clockKit} from "@/app/kits/ClockKit";

const basic = require('basic-authorization-header');

export class NetworkKit {
  liveGetData<T>(
      path: string,
      method: 'GET'|'POST' = 'GET',
      data = {},
      getData: (it: any) => any,
      options: {
        dependencies?: any[],
        onDone?: CallableFunction,
        onStart?: CallableFunction,
        onError?: CallableFunction,
      } = {
        dependencies: [],
        onDone() {

        },
        onStart() {

        },
        onError() {

        }
      }
  ) {
    const [value, setValue] = useState<T|undefined>()
    const [ticker, setTick] = useState<number>(0)
    const [enabled, setEnabled] = useState(true)

    const updateData = (resolve: (value: T) => void, reject: (() => void)|undefined) => {
      $pluginKit.getConfigs().then((config: any) => {
        const baseUrl = localStorage.getItem("host") || _.get(config, 'main.network.trafficLightUri')
        const auth = basic(localStorage.getItem("username"), sessionStorage.getItem("password"))
        const params = new URLSearchParams();

        if (method == 'POST') {
          axios.post(`${baseUrl}/${path}`, data, {
            headers: {
              'Authorization': auth || _.get(config, 'main.network.trafficLightAuthHeader')
            },
            params
          })
              .then(data => {
                resolve(getData(data))
              })
              .catch(e => {
                if (e.code == "ERR_NETWORK") {
                  if (reject) {
                    reject()
                  }
                }
                console.error(e)
                options?.onError?.()
              })
        } else {
          axios.get(`${baseUrl}/${path}`, {
            headers: {
              'Authorization': auth || _.get(config, 'main.network.trafficLightAuthHeader')
            },
            params
          })
              .then(data => {
                resolve(getData(data))
              })
              .catch(e => {
                if (e.code == "ERR_NETWORK") {
                  if (reject) {
                    reject()
                  }
                }
                console.error(e)
                options?.onError?.()
              })
        }
      })
    }

    useEffect(() => {
      options?.onStart?.()
    }, []);

    useEffect(() => {
      if (enabled) {
        updateData(
          (i) => {
            setValue(i)
            options?.onDone?.()
          },
          () => {
            setEnabled(false)
          }
        )
      }
    }, [$clockKit.getTicker(5), ticker, enabled].concat(options.dependencies || []));

    return {
      value,
      forceUpdate() {
        setTick(ticker + 1)
      }
    }
  }
}

export const $networkKit = new NetworkKit()
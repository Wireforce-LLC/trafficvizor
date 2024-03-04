import {$pluginKit} from "@/app/kits/PluginKit";
import axios from "axios";
import _ from "lodash";
import {useEffect, useState} from "react";
import {If, Then} from "react-if";
import JsonView from "@uiw/react-json-view";
import clm from 'country-locale-map';

interface Props {
  readonly routerName?: string
}

export default function ViewRouter({routerName} : Props) {
  const [modalData, setModalData] = useState(undefined);

  useEffect(() => {
    if (!_.isString(routerName)) {
      return
    }

    $pluginKit.getConfigs().then((config) => {
      const baseUrl = _.get(config, "main.network.trafficLightUri");
      const params = new URLSearchParams();

      axios
          .get(
              `${baseUrl}/system/router/raw/${routerName}`,
              {
                headers: {
                  Authorization: _.get(
                      config,
                      "main.network.trafficLightAuthHeader",
                  ),
                },
                params,
              },
          )
          .then((data) => {
            setModalData(_.get(data, 'data.data', undefined));
          });
    });
  }, [routerName]);

  const tools = {
    ip: _.get(_.find(_.get(modalData, 'if.tools', []), i => {
      return _.get(_.flatten(_.toPairs(i)), '0', undefined) == 'IP'
    }), 'IP', undefined)
  }

  return <div className="p-4">
    <If condition={_.isObject(modalData)}>
      <Then>
        <p className="text-gray-500 font-semibold text-xs mb-2">Tools</p>
        <div className="grid gap-3 grid-cols-4">
          {
            _.get(tools.ip, 'country', []).map(i => {
              const country = clm.getCountryByAlpha2(i)

              if (!_.isObject(country)) {
                return undefined
              }

              return <div
                  className="bg-lime-50 hover:shadow-md hover:scale-95 cursor-pointer hover:shadow-lime-50 transition-all border border-lime-200 space-y-2 flex items-center justify-center flex-col rounded-lg px-4 py-2">
                <span className="h-6 w-6 text-2xl">{country?.emoji}</span>

                <div>
                  <p className="text-lime-600 font-semibold text-sm">{country?.name}</p>
                </div>
              </div>
            })
          }
        </div>

        <JsonView
            collapsed={2}
            displayDataTypes={false}
            title="Overview"
            value={modalData}
        />
      </Then>
    </If>
  </div>
}
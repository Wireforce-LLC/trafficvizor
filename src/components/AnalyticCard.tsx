import { ReactNode, useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import { Case, Switch } from "react-if";
import _ from "lodash";
import ShadowContainer from "@/components/ShadowContainer";

interface Props {
  readonly value?: string;
  readonly subValue?: string;
  readonly text: string;
  readonly icon?: ReactNode;
  readonly fetcher?: () => Promise<string>;
}

export default function AnalyticCard({ value, subValue, icon, text, fetcher }: Props) {
  const [valueText, setValueText] = useState<string | undefined>(undefined);
  const [state, setState] = useState("READY");

  useEffect(() => {
    if (fetcher) {
      fetcher()
        .then((value1) => {
          setValueText(value1);
          setState("FETCHED");
        })
        .catch(() => setValueText(undefined));
    } else {
      setState("FETCHED");
    }
  }, [fetcher]);

  return (
      <ShadowContainer className="h-28">
        <Switch>
          <Case condition={state === "FETCHED"}>
            <div className="w-full px-6">
              <h3 className="text-3xl space-x-2 flex flex-row justify-start items-center">
                <span>{icon}</span>
                <div className="flex items-end justify-start space-x-2">
                  <span className="text-gray-900 font-bold">{valueText || value}</span>
                  {!_.isEmpty(subValue) ? <span
                      className="text-blue-800 font-regular text-sm font-semibold bg-blue-200 px-2 py-0.5 rounded">{subValue}</span> : undefined}
                </div>
              </h3>
              <p className="text-gray-600 font-regular max-w-52 text-sm">{text}</p>
            </div>
          </Case>
          <Case condition={state === "READY"}>
            <div className="flex flex-col justify-center items-center w-full h-full">
              <Spinner/>
            </div>
          </Case>
        </Switch>
      </ShadowContainer>

      // <div className="border space-y-2 h-32 border-gray-200 rounded px-6 py-4 shadow-lg shadow-gray-100">
      //
      // </div>
  );
}

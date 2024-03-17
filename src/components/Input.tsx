import {Else, If, Then} from "react-if";
import _ from "lodash";

interface Props {
  readonly label?: string
  readonly options?: string[]
  readonly type?: string
  readonly placeholder?: string
  readonly value: string
  readonly setValue: (it: string) => void
}

export default function Input(props: Props) {
  return <div className="w-full">
    <If condition={props.label}>
      <Then>
        <label className='text-xs text-gray-500 mb-2'>{props.label}</label>
      </Then>
    </If>

    <If condition={_.isArray(props.options)}>
      <Then>
        <select
            value={props.value}
            onChange={(e) => props.setValue(e.target.value)}
            className="py-2 outline-none w-full font-normal bg-gray-50 text-sm border border-gray-200 rounded-md px-3"
        >
          {props.options?.map(i =>
              <option value={i}>{i}</option>
          )}
        </select>
      </Then>
      <Else>
        <input
            value={props.value}
            type={props.type}
            placeholder={props.placeholder}
            onChange={(e) => props.setValue(e.target.value)}
            className="py-2 outline-none w-full font-normal bg-gray-50 text-sm border border-gray-200 rounded-md px-3"
        />
      </Else>
    </If>

  </div>
}
interface Props {
  readonly onClick?: () => void,
  readonly text: string,
}

export default function Button(props: Props) {
  return <button
      onClick={props.onClick || (() => {})}
      className="w-full hover:outline hover:outline-1 hover:outline-lime-500 active:bg-lime-600 outline-offset-1 py-2 text-white font-semibold text-sm text-md bg-lime-500 rounded-md">
    {props.text}
  </button>
}
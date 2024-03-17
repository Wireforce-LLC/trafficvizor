import {ReactNode} from "react";

interface Props {
  readonly children?: ReactNode;
  readonly className?: string;
}

export default function ShadowContainer({ children, className }: Props) {
  return (
    <section className={
      "bg-white overflow-hidden flex-col flex items-center justify-center border-gray-200 border roudned-sm w-full drop-shadow-sm rounded-lg text-xs " +
      className
    }>
      {children}
    </section>
  );
}

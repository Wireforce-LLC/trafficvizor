import { lazy } from "react";

const Spinner = lazy(() => import("@/components/Spinner"));

interface Props {
  readonly text: string;
  readonly safePadding?: boolean;
  readonly safeMargin?: boolean;
}

export default function ViewSpinner({ text, safePadding, safeMargin }: Props) {
  return (
    <div
      className={`w-full flex space-y-3 rounded-md items-center flex-col justify-center ${safePadding ? "py-8" : ""} ${safeMargin ? "m-4" : ""}`}
    >
      <Spinner />
      <span className="text-sm text-gray-600 text-center max-w-7xl">
        {text}
      </span>
    </div>
  );
}

import {Fragment, ReactNode, Suspense, useEffect, useState} from "react";
import { If, Then } from "react-if";
import ViewSpinner from "@/components/ViewSpinner";

interface Props {
  readonly children?: ReactNode;
  readonly title?: string;
  readonly onClose?: () => void;
  readonly props?: object;
}

export default function Modal({ children, title, props, onClose }: Props) {
  return (
    <div className="w-full z-50 flex justify-center items-start sm:items-center overflow-hidden bg-black bg-opacity-65 h-full fixed top-0 left-0 right-0 bottom-0">
      <div className="overflow-y-auto max-h-screen bg-white border border-gray-600 h-full sm:h-fit shadow-lg sm:rounded-lg min-w-64 lg:mx-12 w-full md:w-2/3 lg:w-2/4">
        <header className="select-none flex border-b border-gray-200 flex-row justify-between p-2 items-center">
          <h2 className="text-md font-semibold ml-2">
            {title || "Modal window"}
          </h2>

          <button
            role="button"
            onClick={() => onClose?.apply(null)}
            className="rounded bg-gray-100 hover:bg-gray-200 h-6 w-6 flex justify-center items-center cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </header>

        <div>{children}</div>
      </div>
    </div>
  );
}

export const $modal = (
  title: string | undefined = undefined,
  children: (props: object) => ReactNode,
) => {
  const [onShow, setOnShow] = useState(false);
  const [props, setProps] = useState({});

  const [fragment, setFragment] = useState<ReactNode>(<></>)

  useEffect(() => {
    setFragment(children?.(props))
  }, [props]);

  return {
    toggle(value: boolean | undefined = undefined) {
      if (value == undefined) {
        setOnShow(!onShow);
        return;
      }

      setOnShow(value);
    },

    openModalWithProps(props: object) {
      setProps(props);
      setOnShow(true);
    },

    component: <If condition={onShow}>
      <Then>
        <Modal title={title} onClose={() => setOnShow(false)}>
          <Suspense fallback={<ViewSpinner text=""/>}>
            {onShow ? fragment : undefined}
          </Suspense>
        </Modal>
      </Then>
    </If>,
  };
};

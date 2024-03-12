import {Fragment, ReactNode, StrictMode, Suspense, useEffect, useState} from "react";
import { If, Then } from "react-if";
import ViewSpinner from "@/components/ViewSpinner";

interface Options {
  readonly isCanBeClosed?: boolean
}

interface Props {
  readonly children?: ReactNode;
  readonly title?: string;
  readonly onClose?: () => void;
  readonly props?: object;
  readonly options?: Options;
}

export default function Modal({ children, options, title, props, onClose }: Props) {
  return (
      <StrictMode>
        <div className="w-full z-50 flex justify-center items-start sm:items-center overflow-hidden bg-black backdrop-blur-sm bg-opacity-65 h-full fixed top-0 left-0 right-0 bottom-0">
          <div
              className="overflow-y-auto max-h-screen bg-white border border-gray-600 h-full sm:h-fit shadow-lg sm:rounded-xl min-w-64 lg:mx-12 w-full md:w-2/3 lg:w-2/4">
            <header className="select-none flex border-b border-gray-200 flex-row justify-between p-2 items-center">
              <h2 className="text-md font-semibold ml-2">
                {title || "Modal window"}
              </h2>

              <If condition={options?.isCanBeClosed !== false}>
                <Then>
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
                </Then>
              </If>
            </header>

            <div>
              <Fragment>
                {children}
              </Fragment>
            </div>
          </div>
        </div>
      </StrictMode>
  );
}

export const $modal = (
    title: string | undefined = undefined,
    children: ReactNode|((props: any) => ReactNode),
    options: Options | undefined = undefined
) => {
  const [onShow, setOnShow] = useState(false);
  const [props, setProps] = useState({});

  const [fragment, setFragment] = useState<ReactNode>(<></>)

  useEffect(() => {
    if (typeof children == 'function') {
      setFragment(children(props))
    } else {
      setFragment(children)
    }
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

    component:
      <If condition={onShow}>
        <Then>
          <Modal options={options} title={title} onClose={() => setOnShow(false)}>
            {fragment}
          </Modal>
        </Then>
      </If>

    // component: <If condition={onShow}>
    //   <Then>
    //     <Modal options={options} title={title} onClose={() => setOnShow(false)}>
    //       <Suspense fallback={<ViewSpinner text=""/>}>
    //         {onShow ? children?.(props) : undefined}
    //       </Suspense>
    //     </Modal>
    //   </Then>
    // </If>,
  };
};

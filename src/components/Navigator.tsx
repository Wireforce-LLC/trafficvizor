import Link from "next/link";

export type Route = {
  readonly name: string;
  readonly path: string;
};

interface Props {
  readonly routes: Route[];
}

export default function Navigator({ routes }: Props) {
  return (
    <div className="bg-white flex items-center justify-center space-x-2 border-gray-200 border roudned-sm w-fit py-2 px-4 drop-shadow-sm rounded-lg text-xs">
      {routes.map((i, index) => {
        if (index + 1 == routes.length) {
          return <span>{i.name}</span>;
        } else {
          return (
            <>
              <Link href={i.path} shallow>
                <span className="cursor-pointer font-semibold select-none">
                  {i.name}
                </span>
              </Link>
              <span className="cursor-pointer text-gray-300 font-semibold select-none">
                /
              </span>
            </>
          );
        }
      })}

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-3 h-3"
      >
        <path
          fill-rule="evenodd"
          d="M13.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L11.69 12 4.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
          clipRule="evenodd"
        />
        <path
          fill-rule="evenodd"
          d="M19.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06L17.69 12l-6.97-6.97a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}

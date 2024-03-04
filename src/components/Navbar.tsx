import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { $pluginKit } from "@/app/kits/PluginKit";
import _ from "lodash";

interface Props {
  readonly activeHref: string;
  readonly appendItems?: {
    label: string;
    href: string;
    isActive: () => boolean;
  };
}

export default function Navbar({ activeHref, appendItems }: Props) {
  const [items, setItems] = useState(
    [
      {
        label: "Requests",
        href: "/requests",
        isActive: () => activeHref == "/requests",
      },
      {
        label: "Routers",
        href: "/routers",
        isActive: () => activeHref == "/routers",
      },
    ].concat(appendItems || []),
  );

  return (
    <nav className="w-full h-12 border-b border-b-gray-300">
      <div className="mx-auto h-full container flex flex-row">
        <div className="flex space-x-3 select-none justify-center text-sm font-semibold items-center border-b-transparent h-full w-fit px-4 border-b-2">
          <div className="flex space-x-1 justify-center items-center">
            <div className="bg-red-500 rounded-full w-3 h-3"></div>
            <div className="bg-orange-500 rounded-full w-3 h-3 animate-pulse"></div>
            <div className="bg-green-500 rounded-full w-3 h-3"></div>
          </div>

          <span>
            <span>Traffic</span>
            <span className="font-bold">Vizor</span>
          </span>
        </div>

        {items.map((item) => (
          <Link key={item.href} shallow href={item.href}>
            <div
              className={`flex cursor-pointer justify-center text-sm font-semibold items-center h-full w-fit px-4 border-b-2 ${item.isActive() ? "border-b-orange-500" : "border-b-transparent"}`}
            >
              {item.label}
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function PluginNavbar({ activeHref }: { activeHref: string }) {
  const [component, setComponent] = useState<ReactNode>(
    <nav className="w-full h-12 border-b border-b-gray-300">
      <div className="mx-auto h-full container flex flex-row">
        <div className="flex space-x-3 select-none justify-center text-sm font-semibold items-center border-b-transparent h-full w-fit px-4 border-b-2">
          <div className="flex space-x-1 justify-center items-center">
            <div className="bg-red-500 rounded-full w-3 h-3"></div>
            <div className="bg-orange-500 rounded-full w-3 h-3 animate-pulse"></div>
            <div className="bg-green-500 rounded-full w-3 h-3"></div>
          </div>

          <span>
            <span>Traffic</span>
            <span className="font-bold">Vizor</span>
          </span>
        </div>
      </div>
    </nav>,
  );

  useEffect(() => {
    $pluginKit.getAllUiPlugins().then((plugins) => {
      setComponent(
        <Navbar
          activeHref={activeHref}
          appendItems={_.take<any>(
            plugins?.map((i: any) => ({
              href: `/plugin/${i.id}`,
              label: i.options.menuName,
              isActive: () => activeHref == `/plugin/${i.id}`,
            })) || [],
            6,
          )}
        />,
      );
    });
  }, [activeHref]);

  return component;
}

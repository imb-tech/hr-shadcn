import { Building2, MapPinned, ScrollText, UsersIcon } from "lucide-react";

export default function Tabbar() {
  return (
    <div className="flex items-center gap-2">
      {links?.map((link, i) => (
        <a key={i} href={link.to}>
          <div className="bg-gray-400/15 text-gray-300 font-extralight flex items-center gap-2 py-1.5 px-3 rounded-lg">
            <span>{link.icon}</span>
            <span>{link.title}</span>
          </div>
        </a>
      ))}
    </div>
  );
}

export const links = [
  {
    to: "#office",
    icon: <Building2 size={16} />,
    title: "Ofis",
  },
  {
    to: "#hr",
    icon: <UsersIcon size={16} />,
    title: "Hodimlar",
  },
  {
    to: "#map",
    icon: <MapPinned size={16} />,
    title: "Joylashuvlar",
  },
  {
    to: "#requests",
    icon: <ScrollText size={16} />,
    title: "So'rovlar",
  },
];

import { Chip } from "@heroui/react";

export default function MapStat() {
  return (
    <div className="p-3  items-center gap-1 hidden">
      <Chip className="rounded-md">Hodimlar: 24</Chip>
      <Chip className="rounded-md">Kelgan: 21</Chip>
      <Chip className="rounded-md">Kelmagan: 3</Chip>
    </div>
  );
}

export default function YearsTableHeader() {
  return (
    <div className="grid grid-cols-4  font-medium gap-3 dark:bg-zinc-800 bg-gray-200 p-3 text-foreground-500 rounded-t-lg">
      <p className="text-sm">Yil</p>
      <p className="text-sm">Kechikishlar soni</p>
      <p className="text-sm">Kech kelish davomiyligi</p>
      <p className="text-sm">Jarimalar</p>
    </div>
  );
}

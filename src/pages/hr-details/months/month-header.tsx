export default function MonthTableHeader() {
  return (
    <div className="grid grid-cols-4 mt-3  gap-3 dark:bg-muted/80 bg-gray-300/90 p-3 text-foreground-500 rounded-t-lg">
      <p className="text-sm">Oy</p>
      <p className="text-sm">Kechikishlar soni</p>
      <p className="text-sm">Kech kelish davomiyligi</p>
      <p className="text-sm">Jarimalar</p>
    </div>
  );
}

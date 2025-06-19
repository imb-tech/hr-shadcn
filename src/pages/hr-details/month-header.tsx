export default function MonthTableHeader() {
  return (
    <div className="grid grid-cols-4 gap-3 bg-foreground-100 p-3 text-foreground-500 rounded-t-lg">
      <p className="text-sm">Oy</p>
      <p className="text-sm">Kechikishlar soni</p>
      <p className="text-sm">Kech kelish davomiyligi</p>
      <p className="text-sm">Jarimalar</p>
    </div>
  );
}

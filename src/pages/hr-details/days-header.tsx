export default function DaysTableHeader() {
  return (
    <div className="grid grid-cols-7 gap-3 bg-foreground-100 p-3 text-foreground-500 rounded-t-lg">
      <p className="text-sm">Kun</p>
      <p className="text-sm">Kelish vaqt</p>
      <p className="text-sm">Kechikish</p>
      <p className="text-sm">Ish vaqti</p>
      <p className="text-sm">Ketish vaqti</p>
      <p className="text-sm">Erta ketish</p>
      <p className="text-sm">Status</p>
    </div>
  );
}

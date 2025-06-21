export default function DaysTableHeader() {
  return (
    <div className="grid grid-cols-6 gap-3 mt-3 dark:bg-stone-900 bg-stone-200 p-3 text-foreground-500 rounded-t-lg">
      <p className="text-sm">Kun</p>
      <p className="text-sm">Ish vaqti</p>
      <p className="text-sm">Kelish vaqt</p>
      <p className="text-sm">Kechikish</p>
      <p className="text-sm">Ketish vaqti</p>
      <p className="text-sm">Erta ketish</p>
    </div>
  );
}

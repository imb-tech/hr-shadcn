export default function OfficeDetailTableHeader() {
  return (
    <div className="grid grid-cols-6 gap-3">
      <p className="font-semibold text-primary-600 text-sm">Lavozim</p>
      <p className="font-semibold text-primary-600 text-sm">
        Vaqtida kelganlar
      </p>
      <p className="font-semibold text-primary-600 text-sm">Kech qolganlar</p>
      <p className="font-semibold text-primary-600 text-sm">
        Kelmaganlar {"/ Sababli"}
      </p>
      <p className="font-semibold text-primary-600 text-sm">
        Kelmaganlar {"/ Sababsiz"}
      </p>
      <p className="font-semibold text-primary-600 text-sm">Jami ishchilar</p>
    </div>
  );
}

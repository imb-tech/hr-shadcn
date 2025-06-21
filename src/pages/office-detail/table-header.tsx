export default function OfficeDetailTableHeader() {
  return (
    <div className="grid grid-cols-6 gap-3 w-full text-start text-primary ">
      <p className="font-semibold  text-sm ">Lavozim</p>
      <p className="font-semibold  text-sm">
        Vaqtida kelganlar
      </p>
      <p className="font-semibold  text-sm">Kech qolganlar</p>
      <p className="font-semibold  text-sm">
        Kelmaganlar {"/ Sababli"}
      </p>
      <p className="font-semibold  text-sm">
        Kelmaganlar {"/ Sababsiz"}
      </p>
      <p className="font-semibold  text-sm">Jami ishchilar</p>
    </div>
  );
}

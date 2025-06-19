export default function OfficeInfoRow({ data }: { data: CompanyStats }) {
  return (
    <div className="grid grid-cols-6 py-2 gap-3">
      <p className="font-light">{data.role || 0}</p>
      <p className="font-light">{data.in_time || 0}</p>
      <p className="font-light">{data.late || 0}</p>
      <p className="font-light">{data.excused || 0}</p>
      <p className="font-light">{data.absent || 0}</p>
      <p className="font-light">{data.total || 0}</p>
    </div>
  );
}

export default function OfficeInfoRow({ data }: { data: CompanyStats }) {
  return (
    <div className="grid grid-cols-6  gap-14 w-full text-[16px] text-start">
      <p className="font-medium">{data.role || 0}</p>
      <p className="font-medium">{data.in_time || 0}</p>
      <p className="font-medium">{data.late || 0}</p>
      <p className="font-medium">{data.excused || 0}</p>
      <p className="font-medium">{data.absent || 0}</p>
      <p className="font-medium">{data.total || 0}</p>
    </div>
  );
}

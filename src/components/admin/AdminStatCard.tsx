interface Props {
  title: string;
  value: string;
}

function AdminStatCard({
  title,
  value,
}: Props) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow">

      <p className="text-gray-500">
        {title}
      </p>

      <h2 className="text-3xl font-bold mt-2">
        {value}
      </h2>

    </div>
  );
}

export default AdminStatCard;
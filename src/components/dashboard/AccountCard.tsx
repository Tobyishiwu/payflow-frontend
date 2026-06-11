interface AccountCardProps {
  title: string;
  amount: string;
}

function AccountCard({
  title,
  amount,
}: AccountCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <h3 className="text-gray-500 text-sm">
        {title}
      </h3>

      <p className="text-3xl font-bold mt-3 text-[#0F2D52]">
        {amount}
      </p>
    </div>
  );
}

export default AccountCard;
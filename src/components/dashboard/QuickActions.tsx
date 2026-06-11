function QuickActions() {
  const actions = [
    "Transfer",
    "Savings",
    "Pay Bills",
    "Loans",
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <h2 className="font-semibold text-lg mb-4">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => (
          <button
            key={action}
            className="bg-[#0F2D52] text-white rounded-xl py-4"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;
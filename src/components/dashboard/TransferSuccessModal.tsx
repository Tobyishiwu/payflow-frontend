interface Props {
  open: boolean;
  amount: string;
  reference: string;
  description: string;
  onClose: () => void;
}

function TransferSuccessModal({
  open,
  amount,
  reference,
  description,
  onClose,
}: Props) {

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

      <div className="bg-white rounded-2xl p-8 w-[500px]">

        <h2 className="text-2xl font-bold text-green-600 mb-6">
          Transfer Successful
        </h2>

        <div className="space-y-3">

          <p>
            <strong>Amount:</strong> ₦
            {Number(amount).toLocaleString()}
          </p>

          <p>
            <strong>Reference:</strong>
            {" "}
            {reference}
          </p>

          <p>
            <strong>Description:</strong>
            {" "}
            {description}
          </p>

        </div>

        <button
          onClick={onClose}
          className="mt-6 bg-[#0F2D52] text-white px-4 py-2 rounded-lg"
        >
          Done
        </button>

      </div>

    </div>
  );
}

export default TransferSuccessModal;
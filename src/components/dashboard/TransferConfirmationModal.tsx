import { useState } from "react";

interface TransferConfirmationModalProps {
  recipientName: string;
  accountNumber: string;
  amount: string;
  description: string;
  onConfirm: (
    transactionPin: string
  ) => void;
  onClose: () => void;
}

function TransferConfirmationModal({
  recipientName,
  accountNumber,
  amount,
  description,
  onConfirm,
  onClose,
}: TransferConfirmationModalProps) {
  const [
    transactionPin,
    setTransactionPin,
  ] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">

        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-[#0F2D52]">
            Confirm Transfer
          </h2>

          <p className="text-gray-500 mt-2">
            Please verify the details below.
          </p>
        </div>

        <div className="p-6 space-y-5">

          <div>
            <p className="text-gray-500">
              Recipient
            </p>

            <p className="font-semibold">
              {recipientName}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Account Number
            </p>

            <p className="font-semibold">
              {accountNumber}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Amount
            </p>

            <p className="text-2xl font-bold text-[#0F2D52]">
              ₦{Number(amount).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-gray-500">
              Description
            </p>

            <p className="font-semibold">
              {description || "Transfer"}
            </p>
          </div>

          <div>
            <p className="text-gray-500 mb-2">
              Transaction PIN
            </p>

            <input
              type="password"
              maxLength={4}
              value={transactionPin}
              onChange={(e) =>
                setTransactionPin(
                  e.target.value
                )
              }
              placeholder="Enter 4-digit PIN"
              className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#0F2D52]"
            />
          </div>

        </div>

        <div className="border-t p-6 flex gap-3">

          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 py-3 rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={() =>
              onConfirm(
                transactionPin
              )
            }
            disabled={
              transactionPin.length !== 4
            }
            className="flex-1 bg-[#0F2D52] text-white py-3 rounded-xl disabled:opacity-50"
          >
            Confirm Transfer
          </button>

        </div>

      </div>

    </div>
  );
}

export default TransferConfirmationModal;


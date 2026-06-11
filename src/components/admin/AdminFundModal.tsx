import { useState } from "react";

interface Account {
  id: number;
  account_number: string;
  balance: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  accounts?: Account[];
}

interface AdminFundModalProps {
  user: User;
  onClose: () => void;
  onSubmit: (
    amount: string,
    description: string
  ) => void;
}

function AdminFundModal({
  user,
  onClose,
  onSubmit,
}: AdminFundModalProps) {
  const [amount, setAmount] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const account =
    user.accounts?.[0];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">

        <div className="p-6 border-b">

          <h2 className="text-2xl font-bold text-slate-900">
            Fund Account
          </h2>

          <p className="text-gray-500 mt-2">
            Credit a user's account.
          </p>

        </div>

        <div className="p-6 space-y-5">

          <div>

            <p className="text-gray-500 text-sm">
              User
            </p>

            <p className="font-semibold">
              {user.name}
            </p>

          </div>

          <div>

            <p className="text-gray-500 text-sm">
              Account Number
            </p>

            <p className="font-mono">
              {account?.account_number}
            </p>

          </div>

          <div>

            <p className="text-gray-500 text-sm">
              Current Balance
            </p>

            <p className="font-semibold text-green-600">
              ₦
              {Number(
                account?.balance || 0
              ).toLocaleString()}
            </p>

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Amount
            </label>

            <input
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(
                  e.target.value
                )
              }
              placeholder="Enter amount"
              className="w-full border rounded-xl p-3"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Admin funding"
              rows={3}
              className="w-full border rounded-xl p-3"
            />

          </div>

        </div>

        <div className="p-6 border-t flex gap-3">

          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 rounded-xl py-3"
          >
            Cancel
          </button>

          <button
            onClick={() =>
              onSubmit(
                amount,
                description
              )
            }
            disabled={!amount}
            className="flex-1 bg-[#0F2D52] text-white rounded-xl py-3 disabled:opacity-50"
          >
            Fund Account
          </button>

        </div>

      </div>

    </div>
  );
}

export default AdminFundModal;
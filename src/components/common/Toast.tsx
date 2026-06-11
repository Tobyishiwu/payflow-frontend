interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

function Toast({
  message,
  type = "info",
  onClose,
}: ToastProps) {
  const styles = {
    success:
      "bg-green-50 border-green-200 text-green-700",

    error:
      "bg-red-50 border-red-200 text-red-700",

    info:
      "bg-blue-50 border-blue-200 text-blue-700",
  };

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  };

  return (
    <div
      className={`fixed top-6 right-6 z-[9999] min-w-[340px] max-w-md border rounded-2xl shadow-2xl backdrop-blur-sm p-4 animate-in slide-in-from-right duration-300 ${styles[type]}`}
    >
      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-3">

          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              type === "success"
                ? "bg-green-100"
                : type === "error"
                ? "bg-red-100"
                : "bg-blue-100"
            }`}
          >
            {icons[type]}
          </div>

          <div>
            <p className="font-semibold">
              {type === "success"
                ? "Success"
                : type === "error"
                ? "Error"
                : "Information"}
            </p>

            <p className="text-sm">
              {message}
            </p>
          </div>

        </div>

        <button
          onClick={onClose}
          className="text-lg font-bold opacity-60 hover:opacity-100 transition"
        >
          ×
        </button>

      </div>
    </div>
  );
}

export default Toast;
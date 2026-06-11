interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationModalProps {
  notification: Notification | null;
  onClose: () => void;
}

function NotificationModal({
  notification,
  onClose,
}: NotificationModalProps) {
  if (!notification) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 mx-4">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-2xl font-bold text-[#0F2D52]">
            🔔 Notification Details
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl"
          >
            ×
          </button>

        </div>

        <h3 className="text-xl font-semibold text-[#0F2D52]">
          {notification.title}
        </h3>

        <p className="text-gray-600 mt-4 leading-relaxed">
          {notification.message}
        </p>

        <div className="mt-6 border-t pt-4">

          <p className="text-sm text-gray-500">
            {new Date(
              notification.created_at
            ).toLocaleString()}
          </p>

        </div>

      </div>

    </div>
  );
}

export default NotificationModal;
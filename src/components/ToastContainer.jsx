export default function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-lg border text-sm font-medium transition-all transform duration-300 translate-y-0 opacity-100 ${
              isSuccess
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : isError
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : isInfo
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : 'bg-gray-800 text-white border-gray-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">
                {isSuccess && '✅'}
                {isError && '⚠️'}
                {isInfo && '📦'}
                {!isSuccess && !isError && !isInfo && 'ℹ️'}
              </span>
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="ml-3 text-gray-400 hover:text-gray-700 p-1 rounded-md transition-colors"
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}

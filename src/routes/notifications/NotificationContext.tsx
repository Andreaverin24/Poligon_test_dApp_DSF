// notifications/NotificationContext.tsx

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    type ReactNode,
  } from 'react';
  import { X } from 'lucide-react'; // npm i lucide-react
  
  type Notification = {
    id: string;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
  };
  
  const NotificationContext = createContext<{
    notify: (message: string, type?: Notification['type']) => void;
  }>({
    notify: () => {},
  });
  
  export const useNotifications = () => useContext(NotificationContext);
  
  export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
  
    const notify = useCallback((message: string, type: Notification['type'] = 'info') => {
      const id = crypto.randomUUID();
      setNotifications((prev) => [...prev, { id, message, type }]);
  
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 5000);
    }, []);
  
    const dismiss = (id: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    };
  
    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
            <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
            {notifications.map(({ id, message, type }) => (
                <div
                key={id}
                className={`relative flex items-start justify-between rounded-xl px-4 py-3 text-sm shadow-lg text-white
                    ${
                    type === 'success'
                        ? 'bg-green-500'
                        : type === 'error'
                        ? 'bg-red-500'
                        : type === 'warning'
                        ? 'bg-yellow-500 text-gray-900'
                        : 'bg-gray-800'
                    }`}
                >
                <span className="pr-6">{message}</span>
                <button
                    className="absolute top-1 right-1 p-1 rounded hover:opacity-80"
                    onClick={() => dismiss(id)}
                    aria-label="Dismiss notification"
                >
                    <X className="w-4 h-4" />
                </button>
                </div>
            ))}
            </div>
        </NotificationContext.Provider>
    );
};
  
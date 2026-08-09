import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toast } = useContext(AppContext);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (toast) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [toast]);

  if (!toast) return null;

  const styles = {
    success: 'bg-green-900/90 border-green-500/40 text-green-300',
    error: 'bg-red-900/90 border-red-500/40 text-red-300',
    info: 'bg-blue-900/90 border-blue-500/40 text-blue-300',
  };

  const icons = {
    success: <CheckCircle className="w-4 h-4 flex-shrink-0" />,
    error: <XCircle className="w-4 h-4 flex-shrink-0" />,
    info: <Info className="w-4 h-4 flex-shrink-0" />,
  };

  return (
    <div
      className={`fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-2.5 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 ${styles[toast.type] || styles.info} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      {icons[toast.type] || icons.info}
      <span className="text-sm font-medium whitespace-nowrap">{toast.message}</span>
    </div>
  );
}

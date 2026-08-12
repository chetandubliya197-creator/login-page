import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { CheckCircle, XCircle, Info } from 'lucide-react';

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
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-rose-50 border-rose-200 text-rose-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600" />,
    error: <XCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />,
    info: <Info className="w-5 h-5 flex-shrink-0 text-blue-600" />,
  };

  return (
    <div
      className={`fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-3 px-5 py-3.5 rounded-full border shadow-xl transition-all duration-300 ${styles[toast.type] || styles.info} ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}
    >
      {icons[toast.type] || icons.info}
      <span className="text-sm font-bold tracking-wide whitespace-nowrap">{toast.message}</span>
    </div>
  );
}

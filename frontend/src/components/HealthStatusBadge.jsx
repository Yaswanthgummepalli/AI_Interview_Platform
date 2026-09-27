import React, { useEffect, useState } from 'react';
import { checkHealth } from '../services/healthService';

const HealthStatusBadge = () => {
  const [status, setStatus] = useState({
    loading: true,
    online: false,
    message: 'Checking API...'
  });

  useEffect(() => {
    let isMounted = true;

    const fetchStatus = async () => {
      try {
        const res = await checkHealth();
        if (isMounted) {
          if (res && res.success) {
            setStatus({
              loading: false,
              online: true,
              message: 'API & DB Connected'
            });
          } else {
            setStatus({
              loading: false,
              online: false,
              message: 'API Offline'
            });
          }
        }
      } catch (err) {
        if (isMounted) {
          setStatus({
            loading: false,
            online: false,
            message: 'API Disconnected'
          });
        }
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="health-badge" title="Live status check with Node.js & MongoDB backend">
      <span
        className={`health-dot ${
          status.loading ? 'loading' : status.online ? 'connected' : 'disconnected'
        }`}
      />
      <span>{status.message}</span>
    </div>
  );
};

export default HealthStatusBadge;

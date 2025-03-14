import { useEffect, useState } from 'react';
import { APP_VERSION } from '../version';

const UpdateNotification = () => {
  const [newVersionAvailable, setNewVersionAvailable] = useState(false);

  useEffect(() => {
    // Function to check for new version
    const checkForUpdates = async () => {
      try {
        // Add cache-busting query parameter to prevent caching
        const response = await fetch(`/version.json?cache=${Date.now()}`);
        if (response.ok) {
          const data = await response.json();
          // Compare versions
          if (data.version && data.version !== APP_VERSION) {
            setNewVersionAvailable(true);
          }
        }
      } catch (error) {
        console.error('Failed to check for updates:', error);
      }
    };

    // Check immediately and then every 5 minutes
    checkForUpdates();
    const interval = setInterval(checkForUpdates, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleUpdate = () => {
    // Force reload by navigating to the current URL
    window.location.href = window.location.origin;
  };

  if (!newVersionAvailable) return null;

  return (
    <div className="update-notification">
      <div className="update-notification-content">
        <p>A new version of the app is available!</p>
        <button onClick={handleUpdate}>Update Now</button>
      </div>
    </div>
  );
};

export default UpdateNotification;
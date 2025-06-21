// src/components/NotificationManager.tsx
import { useEffect } from 'react';
import { useSocketStore } from '@/zustand/socketStore'; // Adjust path
import { toast } from 'react-toastify';
import React from 'react'; // Import React for creating JSX element

const NotificationManager = () => {
    // This component subscribes to the part of the Zustand store that holds the notification data.
    const latestNotification = useSocketStore((state) => state.latestEarthquakeAlert);
    const clearNotification = useSocketStore((state) => state.clearLatestEarthquakeAlert);

    useEffect(() => {
        // This log confirms the effect is running when the component mounts
        console.log('[NotificationManager] Effect is active.'); 

        // This effect runs ONLY when latestNotification changes from null to an object.
        if (latestNotification) {
            const { title, body, magnitude, url } = latestNotification;
            console.log('[NotificationManager] New notification detected, attempting to show toast for:', title);

            // Now, we call toast() from inside a React component's lifecycle.
            toast(
                // It's safer to create the element outside the function call
                <div>
                    <strong>{title} (M{magnitude.toFixed(1)})</strong>
                    <p style={{ margin: '8px 0 0 0' }}>{body}</p>
                    {url &&
                        <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#3498db', textDecoration: 'underline' }}>
                            View Details on USGS
                        </a>
                    }
                </div>,
                {
                    position: "top-right",
                    autoClose: 20000, // 20 seconds
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "dark",
                    // When the toast is closed (either by user or autoClose), clear the state
                    onClose: () => clearNotification(),
                }
            );
        } else {
            console.log(latestNotification)
        }
    }, [latestNotification, clearNotification]);

    // This component is purely for logic and does not render any UI itself.
    return null;
};

export default NotificationManager;
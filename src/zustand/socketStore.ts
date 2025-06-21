// src/stores/socketStore.ts

import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { InfiniteData, useQueryClient } from '@tanstack/react-query'; // We can get this inside actions
import { ReportFactCheckUpdatePayload, ClientToServerEvents, ServerToClientEvents, EarthquakeAlertPayload, EQAlert } from '@/services/socketio/types';
import { ReportResponse } from '@/services/network/lib/reports';
import { toast } from 'react-toastify';


// Get backend URL from Vite environment variables
const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL || 'http://localhost:3000';

// Define the shape of your store's state and actions
interface SocketState {
    socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
    subscriptions: Set<string>;
    isConnected: boolean;
    latestEarthquakeAlert: EQAlert['data'] | null;
    clearLatestEarthquakeAlert: () => void;
    connect: () => void;
    disconnect: () => void;
    sendUserLocation: (location: { lat: number; lng: number }) => void;
    subscribeToReportsRoom: (reportData: ReportResponse[]) => void;
    unsubscribeFromReportsRoom: () => void;
    setupReportUpdateListener: (queryClient: ReturnType<typeof useQueryClient>) => void;
    earthquakeAlertListener: () => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
    socket: null,
    isConnected: false,
    subscriptions: new Set(),
    latestEarthquakeAlert: null,

    // --- ACTIONS ---

    connect: () => {
        // Prevent creating multiple connections
        if (get().socket) {
            // If socket exists but is disconnected, just connect it
            if (!get().socket?.connected) {
                get().socket?.connect();
            }
            return;
        }

        console.log(`[ZustandSocket] Creating new connection to: ${SOCKET_SERVER_URL}`);
        const newSocket = io(SOCKET_SERVER_URL, {
            transports: ['websocket'],
            autoConnect: true, // We'll manage connection state manually if needed, but autoConnect is fine
        });

        newSocket.on('connect', () => {
            console.log('[ZustandSocket] Connected. Socket ID:', newSocket.id);
            set({ isConnected: true });
        });

        newSocket.on('disconnect', (reason) => {
            console.log('[ZustandSocket] Disconnected. Reason:', reason);
            set({ isConnected: false });
        });

        newSocket.on('connect_error', (err) => {
            console.error('[ZustandSocket] Connection Error:', err.message);
            set({ isConnected: false });
        });

        // Set the socket instance in the store's state
        set({ socket: newSocket });
    },

    disconnect: () => {
        get().unsubscribeFromReportsRoom();
        get().subscriptions.clear();
        get().socket?.off('report_factcheck_update');
        get().socket?.disconnect();
        set({ socket: null, isConnected: false });
        console.log('[ZustandSocket] Disconnected and cleaned up.');
    },

    sendUserLocation: (location) => {
        get().socket?.emit('update_location', location);
    },
    subscribeToReportsRoom: (reportData: ReportResponse[]) => {
        reportData.forEach((page) => {
            page.data.reports.data.forEach((report) => {
                if (!get().subscriptions.has(report.id)) {
                    get().socket?.emit('subscribe_to_report', report.id, (res: any) => {
                        console.log(`Subscribed to report: ${report.id}, `, res)
                        get().subscriptions.add(report.id)
                    })
                }
            })
        })
    },

    unsubscribeFromReportsRoom: () => {
        get().subscriptions.forEach((reportId) => {
            get().socket?.emit('unsubscribe_from_report', reportId, (res: any) => {
                console.log(`Unsubscribed from report: ${reportId}, `, res)
            })
        })
    },
    earthquakeAlertListener: () => {
        const socket = get().socket;
        if (!socket) return
        socket.off('earthquake_alert')
        socket.on('earthquake_alert', (payload) => {
            console.log('[ZustandSocket] Received "earthquaker_alert": ', payload)
            if (payload && payload.notificationData.data) {
                set({ latestEarthquakeAlert: payload.notificationData.data });
                console.log('updated latestEQ: ', get().latestEarthquakeAlert)
            } else {
                console.log('else block')
            }
        });
    },
    clearLatestEarthquakeAlert: () => {
        set({ latestEarthquakeAlert: null });
    },

    // This action sets up the listener that updates React Query
    setupReportUpdateListener: (queryClient) => {
        const socket = get().socket;
        if (!socket) return;

        // Remove previous listener to avoid duplicates if this function is called multiple times
        socket.off('report_factcheck_update');

        socket.on('report_factcheck_update', (data: ReportFactCheckUpdatePayload) => {
            console.log('[ZustandSocket] Received "report_factcheck_update":', data);
            if (data && data.reportId && data.factCheck) {
                // Update React Query cache


                // 2. Use setQueryData with the correct key and update function
                const queryKey = ['get-all-disaster-reports']
                queryClient.setQueryData<InfiniteData<ReportResponse>>(
                    queryKey, // <-- Pass the key directly
                    (oldData) => {
                        if (!oldData) {
                            console.warn(`[ZustandSocket] No data found in cache for query key:`, queryKey);
                            return oldData;
                        }

                        // Create a new pages array by mapping over the old one
                        const newPages = oldData.pages.map(page => {
                            // Find the report to update within the current page's data array
                            // Your structure is: page.data.reports.data
                            const updatedReports = page.data.reports.data.map((report: any) => {
                                if (report.id === data.reportId) {
                                    console.log(`[ZustandSocket] Found and updating report ${data.reportId} in cache.`);
                                    // Return a *new* report object with the updated fields
                                    return {
                                        ...report,
                                        factCheckStatus: data.factCheck.status,
                                        factCheckOverallPercentage: data.factCheck.factCheckOverallPercentage,
                                        factCheckLastUpdatedAt: data.factCheck.lastCalculatedAt,
                                        // Also update the nested factCheck object if your component uses it
                                        factCheck: {
                                            ...report.factCheck,
                                            overallPercentage: data.factCheck.factCheckOverallPercentage,
                                            status: data.factCheck.status,
                                            lastCalculatedAt: data.factCheck.lastCalculatedAt,
                                            narrative: data.factCheck.narrative,
                                        }
                                    };
                                }
                                return report; // Return the original report if it's not the one being updated
                            });

                            // Return a new page object with the updated reports array
                            return {
                                ...page,
                                data: {
                                    ...page.data,
                                    reports: {
                                        ...page.data.reports,
                                        data: updatedReports
                                    }
                                }
                            };
                        });

                        // Return the new top-level data object with the new pages array
                        return {
                            ...oldData,
                            pages: newPages,
                        };
                    }
                );
            }
        })
    }
}))
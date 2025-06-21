// src/services/socketIO/types.ts

// The payload for the fact-check update event from the server
export interface ReportFactCheckUpdatePayload {
    reportId: string;
    factCheck: {
        status: string
        factCheckOverallPercentage: number
        lastCalculatedAt: number
        narrative: string
    };
}

export interface EQAlert {
    socketId: string,
    eventName: string,
    data: {
        id: string,
        title: string,
        body: string,
        url: string,
        magnitude: number,
        latitude: number,
        longitude: number,
        time: string
    }
}

export interface EarthquakeAlertPayload {
    socketId: string
    notificationData: EQAlert
}

// All possible events the server can send to the client
export interface ServerToClientEvents {
    connection_ack: (data: { message: string }) => void;
    report_factcheck_update: (payload: ReportFactCheckUpdatePayload) => void;
    // Add your 'earthquake_alert' here when you implement it
    earthquake_alert: (data: EarthquakeAlertPayload) => void;
}

// All possible events the client can send to the server
export interface ClientToServerEvents {
    update_location: (location: { lat: number; lng: number }) => void;
    subscribe_to_report: (reportId: string, ack?: (status: string) => void) => void;
    unsubscribe_from_report: (reportId: string, ack?: (status: string) => void) => void;
}
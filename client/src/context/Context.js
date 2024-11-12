import { createContext, useCallback, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { baseUrl, postReq, socketUrl } from '../utils/services'
import axios from 'axios'
export const Context = createContext()

// ContextProvider
// ContextProvider
export const ContextProvider = ({ children }) => {
    const [socket, setSocket] = useState();
    const [socketConnecting, setSocketConnecting] = useState(true); // Renamed to `socketConnecting`
    const [emergencyData, setEmergencyData] = useState();
    const [alertError, setAlertError] = useState();
    
    useEffect(() => {
        try {
            const newSocket = io("http://localhost:5000");

            newSocket.on("connect", () => {
                console.log("Socket connected");
                setSocketConnecting(false);
            });
            newSocket.on("disconnect", () => {
            });

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        } catch (error) {
            console.log("Error connecting to socket:", error);
        }
    }, []);

    const notifyAlert = useCallback((emergencyData) => {
        if (socket) {
            try {
                console.log(emergencyData);
                socket.emit("alertFromClient", emergencyData);
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log("Socket not found");
        }
    });

    const sendEmergencyAlert = useCallback(async (emergencyData) => {
        try {
            const response = await postReq(`${baseUrl}/api/disaster/emergency`, emergencyData);

            setSocketConnecting(false); // Update the connection state

            if (response.data.error) {
                console.log(response.data.error);
                return setAlertError(response.data.error);
            }

            setEmergencyData(emergencyData);

            return response.data;
        } catch (error) {
            setAlertError(error);
            console.error(error);
        }
    }, [socket]); // Make sure to include socket as a dependency

    return (
        <Context.Provider
            value={{
                sendEmergencyAlert,
                socket,
                socketConnecting, // Updated name
                alertError,
                notifyAlert,
            }}
        >
            {children}
        </Context.Provider>
    );
};


import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { authUser } = useAuthContext();

	useEffect(() => {
		// Determine the correct URL based on the environment
		const socketUrl =
			process.env.NODE_ENV === "production"
				? "https://chat-app-yt.onrender.com" // Your production server URL
				: "http://localhost:3000"; // Local development server

		if (authUser) {
			const socket = io(socketUrl, {
				query: {
					userId: authUser._id,
				},
			});

			setSocket(socket);

			// Listen for online users event
			socket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			// Clean up the socket connection on unmount
			return () => socket.close();
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [authUser]);

	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};

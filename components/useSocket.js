import  client  from "socket.io-client";

const socket = client.connect(process.env.SOCKET_URL, {
    transports: ['websocket'],
    reconnectionAttempts: 15 //Nombre de fois qu'il doit réessayer de se connecter
  });

export function useSocket () {
    
    return {
        socket
    }
}


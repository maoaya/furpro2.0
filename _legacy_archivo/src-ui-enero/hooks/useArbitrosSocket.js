import { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Cambia la URL según tu backend

export default function useArbitrosSocket(setArbitros) {
  useEffect(() => {
    socket.on('arbitrosActualizados', (nuevaLista) => {
      setArbitros(nuevaLista);
    });
    // Solicita la lista inicial
    socket.emit('solicitarArbitros');
    return () => {
      socket.off('arbitrosActualizados');
    };
  }, [setArbitros]);
}

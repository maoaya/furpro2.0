// Servicio de transmisión en vivo usando WebRTC
const liveStreamService = {
  async startStream(videoRef, token) {
    if (navigator.mediaDevices && videoRef.current) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = stream;
      // Lógica de WebRTC/RTMP aquí
      await fetch('/api/stream/start', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      // ...lógica de streaming local...
    }
  },
  stopStream(videoRef) {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  },
  async viewStream(token) {
    const res = await fetch('/api/stream/view', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },
};

export default liveStreamService;

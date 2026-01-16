/**
 * CameraService.js - Gestión de captura de cámara/foto/video
 * Permite acceder a la cámara del dispositivo para fotos y videos
 */

export class CameraService {
  static mediaStream = null;
  static videoElement = null;
  static canvas = null;

  /**
   * Solicitar acceso a la cámara
   */
  static async requestCameraAccess() {
    try {
      const constraints = {
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.mediaStream = stream;
      return { success: true, stream };
    } catch (error) {
      console.error('Error accessing camera:', error);
      return {
        success: false,
        error: error.name === 'NotAllowedError' 
          ? 'Permiso de cámara denegado' 
          : error.message
      };
    }
  }

  /**
   * Inicializar elemento de video
   */
  static setupVideoElement(videoElement) {
    try {
      if (!this.mediaStream) {
        return { success: false, error: 'No hay stream activo' };
      }

      this.videoElement = videoElement;
      videoElement.srcObject = this.mediaStream;
      videoElement.play();

      return { success: true };
    } catch (error) {
      console.error('Error setting up video element:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Capturar foto desde la cámara
   */
  static capturePhoto() {
    try {
      if (!this.videoElement) {
        return { success: false, error: 'Elemento de video no configurado' };
      }

      if (!this.canvas) {
        this.canvas = document.createElement('canvas');
      }

      this.canvas.width = this.videoElement.videoWidth;
      this.canvas.height = this.videoElement.videoHeight;

      const context = this.canvas.getContext('2d');
      context.drawImage(this.videoElement, 0, 0);

      const imageData = this.canvas.toDataURL('image/jpeg', 0.8);
      const blob = this.dataURItoBlob(imageData);

      return { success: true, imageData, blob };
    } catch (error) {
      console.error('Error capturing photo:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Iniciar grabación de video
   */
  static startVideoRecording() {
    try {
      if (!this.mediaStream) {
        return { success: false, error: 'No hay stream activo' };
      }

      const options = {
        mimeType: 'video/webm',
        videoBitsPerSecond: 2500000
      };

      // Fallback para navegadores que no soportan video/webm
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'video/mp4';
      }

      const mediaRecorder = new MediaRecorder(this.mediaStream, options);
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: options.mimeType });
        mediaRecorder.recordedBlob = blob;
        mediaRecorder.recordedChunks = chunks;
      };

      mediaRecorder.start();
      return { success: true, mediaRecorder };
    } catch (error) {
      console.error('Error starting video recording:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Detener grabación de video
   */
  static stopVideoRecording(mediaRecorder) {
    try {
      if (!mediaRecorder) {
        return { success: false, error: 'MediaRecorder no disponible' };
      }

      return new Promise((resolve) => {
        mediaRecorder.onstop = () => {
          const blob = new Blob(mediaRecorder.recordedChunks, { type: mediaRecorder.mimeType });
          const videoData = URL.createObjectURL(blob);
          resolve({ success: true, blob, videoData });
        };

        mediaRecorder.stop();
      });
    } catch (error) {
      console.error('Error stopping video recording:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Parar cámara y liberar recursos
   */
  static stopCamera() {
    try {
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(track => track.stop());
        this.mediaStream = null;
      }

      if (this.videoElement) {
        this.videoElement.srcObject = null;
        this.videoElement = null;
      }

      return { success: true };
    } catch (error) {
      console.error('Error stopping camera:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Convertir Data URI a Blob
   */
  static dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: 'image/jpeg' });
  }

  /**
   * Descargar imagen capturada
   */
  static downloadImage(imageData, fileName = 'capture.jpg') {
    try {
      const link = document.createElement('a');
      link.href = imageData;
      link.download = fileName;
      link.click();
      return { success: true };
    } catch (error) {
      console.error('Error downloading image:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Verificar si el dispositivo tiene cámara
   */
  static async checkCameraAvailability() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      return { success: true, available: videoDevices.length > 0, devices: videoDevices };
    } catch (error) {
      console.error('Error checking camera availability:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Solicitar permiso de cámara (para verificar antes)
   */
  static async requestPermission() {
    try {
      const result = await navigator.permissions.query({ name: 'camera' });
      return { success: true, state: result.state };
    } catch (error) {
      // Fallback si permissions API no está disponible
      return { success: false, error: 'Permissions API no soportada' };
    }
  }

  /**
   * Cambiar entre cámara frontal y trasera
   */
  static async switchCamera(facingMode = 'environment') {
    try {
      this.stopCamera();

      const constraints = {
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.mediaStream = stream;

      if (this.videoElement) {
        this.videoElement.srcObject = stream;
      }

      return { success: true, stream };
    } catch (error) {
      console.error('Error switching camera:', error);
      return { success: false, error: error.message };
    }
  }
}

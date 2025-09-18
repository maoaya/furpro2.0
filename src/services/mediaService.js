// Servicio para subir fotos/videos
const mediaService = {
  async uploadMedia(files, token) {
    const formData = new FormData();
    for (let file of files) {
      formData.append('media', file);
    }
    await fetch('/api/media/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
  },

  async getGallery(token) {
    const res = await fetch('/api/media/gallery', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },
};

export default mediaService;

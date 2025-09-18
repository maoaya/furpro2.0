// Servicio para comentarios en publicaciones/media
const commentService = {
  async getComments(mediaId, token) {
    const res = await fetch(`/api/media/${mediaId}/comments`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },
  async addComment(mediaId, text, token) {
    const res = await fetch(`/api/media/${mediaId}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ text })
    });
    return res.json();
  }
};

export default commentService;

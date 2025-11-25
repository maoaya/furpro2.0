// Servicio básico para logros
export const LogrosService = {
  async getLogros() {
    // Simulación: retorna logros de ejemplo
    return [
      { id: 1, nombre: 'Primer Gol', descripcion: 'Anotaste tu primer gol', tipo: 'personal' },
      { id: 2, nombre: 'Equipo Campeón', descripcion: 'Tu equipo ganó un torneo', tipo: 'equipo' }
    ];
  },
  async addLogro(logro) {
    // Simulación: agrega logro
    return { ...logro, id: Date.now() };
  },
  async updateLogro(id, logro) {
    // Simulación: actualiza logro
    return { ...logro, id };
  },
  async deleteLogro(id) {
    // Simulación: elimina logro
    return true;
  }
};

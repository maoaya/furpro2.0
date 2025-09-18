// Servicio para gestión de roles y permisos
const roles = ['organizador', 'jugador', 'staff', 'espectador'];

const permissions = {
  organizador: ['media:upload', 'media:view', 'chat:all', 'stream:start', 'stream:view'],
  jugador: ['media:view', 'chat:all', 'stream:view'],
  staff: ['media:view', 'chat:staff', 'stream:view'],
  espectador: ['media:view', 'chat:general', 'stream:view']
};

const roleService = {
  getRoles() {
    return roles;
  },
  getPermissions(role) {
    return permissions[role] || [];
  },
  hasPermission(role, perm) {
    return permissions[role]?.includes(perm);
  }
};

export default roleService;

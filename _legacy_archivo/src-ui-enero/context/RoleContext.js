import React, { createContext, useContext, useState } from 'react';
import roleService from '../services/roleService';

export const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState('espectador');
  const updateRole = (newRole) => setRole(newRole);
  return (
    <RoleContext.Provider value={{ role, updateRole }}>
      <div style={{position:'fixed',top:10,right:10,zIndex:1000,background:'#fff',padding:'0.5rem',borderRadius:'8px',boxShadow:'0 2px 8px #0002'}}>
        <label>Cambiar modo de usuario: </label>
        <select value={role} onChange={e => setRole(e.target.value)}>
          {roleService.getRoles().map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);

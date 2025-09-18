jest.mock('../../src/config/supabase', () => ({ supabase: {} }));
jest.mock('../../src/config/firebase', () => ({ auth: {}, googleProvider: {}, facebookProvider: {} }));
import FutProApp from '../../src/FutProApp.jsx';
import LoginRegisterForm from '../../src/LoginRegisterForm.jsx';
import { AuthContext } from '../../src/AuthContext.jsx';

describe('Componentes React puros FutPro (con mocks)', () => {
  it('FutProApp se puede importar sin errores', () => {
    expect(typeof FutProApp).toBe('function');
  });

  it('LoginRegisterForm se puede importar sin errores', () => {
    expect(typeof LoginRegisterForm).toBe('function');
  });

  it('AuthContext existe y es válido', () => {
    expect(AuthContext).toBeDefined();
  });
});

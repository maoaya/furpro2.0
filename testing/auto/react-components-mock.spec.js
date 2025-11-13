jest.mock('../../src/supabaseClient', () => ({}));
import FutProApp from '../../src/FutProApp.jsx';
import LoginRegisterForm from '../../src/pages/LoginRegisterForm.jsx';
import { AuthContext } from '../../src/context/AuthContext.jsx';

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

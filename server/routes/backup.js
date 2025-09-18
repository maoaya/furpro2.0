// Endpoint Express para exportar backup completo (usuarios, pagos, reportes, configuración)
import express from 'express';
// Importación compatible con CommonJS y ESModules
import supabaseDefault from '../src/supabaseClient.js';
const supabase = supabaseDefault.default || supabaseDefault;

const router = express.Router();

router.get('/admin/backup', async (req, res) => {
  try {
    // Opcional: validar que el usuario es admin
    const [usuarios, pagos, reportes, configuracion] = await Promise.all([
      supabase.from('usuarios').select('*'),
      supabase.from('pagos').select('*'),
      supabase.from('reportes').select('*'),
      supabase.from('configuracion').select('*')
    ]);
    const backup = {
      usuarios: usuarios.data || [],
      pagos: pagos.data || [],
      reportes: reportes.data || [],
      configuracion: configuracion.data || []
    };
    res.setHeader('Content-Disposition', 'attachment; filename="futpro-backup.json"');
    res.json(backup);
  } catch (e) {
    res.status(500).json({ error: 'Error al generar backup' });
  }
});

export default router;

# Archivo de instrucciones para configurar variables de entorno

## Problema actual
El sitio sigue usando URLs placeholder (tu_supabase_url.supabase.co) porque las variables de entorno no se están aplicando correctamente en Netlify.

## Solución paso a paso

### 1. Edita .env.production con tus valores reales
Reemplaza los valores en .env.production con los de tu proyecto:

**Supabase (ve a tu dashboard → Settings → API):**
- VITE_SUPABASE_URL=https://XXXXXX.supabase.co (tu Project URL)
- VITE_SUPABASE_ANON_KEY=eyJhbG... (tu anon public key)

**Firebase (ve a console.firebase.google.com → Project Settings):**
- VITE_FIREBASE_API_KEY=AIzaSy...
- VITE_FIREBASE_PROJECT_ID=tu-proyecto
- etc.

### 2. Fuerza un deploy limpio
```bash
git add .env.production
git commit -m "feat: configuración explícita de entorno para producción"
git push
```

### 3. En Netlify, borra todas las variables VITE_*
- Ve a Site settings → Environment variables
- Borra todas las que empiecen con VITE_
- Netlify debe usar las del archivo .env.production

### 4. Deploy limpio
- Deploys → "Clear cache and deploy site"

### 5. Alternativa: Deploy manual
Si Netlify sigue teniendo problemas:
```bash
npm run build
# Sube manualmente la carpeta dist/ a Netlify drag & drop
```

El archivo .env.production se incluye en el build y debería resolver el problema de configuración.
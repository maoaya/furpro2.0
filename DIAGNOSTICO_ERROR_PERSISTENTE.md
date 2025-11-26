# Diagnosis

The build crashes during vite build because Rollup cannot load its platform-specific optional dependency @rollup/rollup-linux-x64-gnu. This happens even though Rollup is installed, which indicates that the optional native package was skipped when npm ci ran on Netlify. This is the npm bug mentioned in the error message, where npm 10 occasionally omits optional dependencies when installing from a lockfile.

# Solution

Update the Netlify build so optional dependencies are installed. You can do this by editing netlify.toml and appending --include=optional to the build command:

[build]
  command = "npm ci --no-audit --no-fund --include=optional && npm run build"

Alternatively, set an environment variable in Netlify (Site settings → Build & deploy → Environment) named NPM_FLAGS with the value --include=optional, then keep the existing command. After committing the change or saving the environment variable, trigger a new deploy. This ensures the @rollup/rollup-linux-x64-gnu package is installed and the build succeeds.

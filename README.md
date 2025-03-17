# Granjita Feliz

Un juego divertido de granja donde los pollos ponen huevos que eclosionan en más pollos.

## Características

- Los pollos se mueven por la pantalla
- Al hacer clic en un pollo, pone un huevo
- Los huevos eclosionan en nuevos pollos después de un tiempo
- Animaciones fluidas para todos los elementos
- Pollos que cacarean aleatoriamente
- Música de fondo para una experiencia más inmersiva

## Música de Fondo

El juego incluye música de fondo para una experiencia más completa. Para habilitarla:

1. Descarga un archivo de música (recomendamos "Town Theme RPG" de OpenGameArt)
2. Renombra el archivo a `farm-background.mp3`
3. Colócalo en la carpeta `public/audio/`

Consulta el archivo `public/audio/README.md` para más detalles.

## Cómo jugar

1. Haz clic en un pollo para poner un huevo
2. Espera a que el huevo eclosione para obtener un nuevo pollo
3. ¡Cuantos más pollos tengas, más huevos podrás producir!

## Instalación

```
npm install
npm run dev
```

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

# Fix: login `showFeedback` undefined

Fecha: 2026-08-08

## Error

`TypeError: Cannot destructure property 'showFeedback' of 'A(...)' as it is undefined` en `loginpagesnew`.

## Causa

`useFeedback` (`FVe`) hacía `useContext` sin valor por defecto. Si Login montaba sin `FeedbackProvider` (carrera/lazy/error boundary), el contexto era `undefined` y el destructuring petaba. El `removeChild` NotFoundError es efecto colateral del crash de React.

## Fix

- `createContext` con default `{showFeedback, hideFeedback}` no-op
- `FVe` endurecido
- Login: `b = (A()||{}).showFeedback || noop`
- Cache-bust lazy import + `npm start` ya no cachea JS como immutable

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/config/i18n.ts';
import App from './App.tsx';
import soundPath from './assets/sound/notify_sound.wav';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <audio id="notification-sound" src={soundPath} preload="auto" />
  </StrictMode>
);

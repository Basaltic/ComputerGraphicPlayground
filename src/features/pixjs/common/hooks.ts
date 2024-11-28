import { Application } from 'pixi.js';
import React, { useEffect, useRef, useState } from 'react';

import { initDevtools } from '@pixi/devtools';

export function usePixiApplication() {
  const [application, setApp] = useState<Application>();
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const initApp = async () => {
    if (application) return;

    const app = new Application();

    initDevtools({ app });

    await app.init({ background: '#1099bb', resizeTo: window });

    setApp(app);

    canvasContainerRef.current?.appendChild(app.canvas);
  };

  useEffect(() => {
    initApp();
  }, []);

  return { application, canvasContainerRef };
}

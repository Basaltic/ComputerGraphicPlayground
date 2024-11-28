import { useEffect } from 'react';
import { usePixiApplication } from '../../common/hooks';
import { Assets, Sprite } from 'pixi.js';

export function PixiBasic1Page() {
  const { application, canvasContainerRef } = usePixiApplication();

  useEffect(() => {
    load();
  }, [application]);

  async function load() {
    if (!application) return;

    const texture = await Assets.load('/images/pixi/bunny.png');

    const bunny = new Sprite(texture);

    application.stage.addChild(bunny);

    bunny.anchor.set(0.5);

    bunny.x = application.screen.width / 2;
    bunny.y = application.screen.height / 2;

    application.ticker.add((time) => {
      bunny.rotation += 0.1 * time.deltaTime;
    });
  }

  return <div id="canvas" style={{ width: '100%', height: '100%' }} ref={canvasContainerRef}></div>;
}

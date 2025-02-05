import Phaser from 'phaser';
import { useEffect, useRef } from 'react';
import { Example } from './example.scene';

export function PhaserExample1() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const game = new Phaser.Game({
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        backgroundColor: '#2d2d2d',
        parent: containerRef.current,
        pixelArt: true,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { x: 0, y: 0 }
          }
        },
        scene: Example
      });
    }
  }, []);

  return <div ref={containerRef}></div>;
}

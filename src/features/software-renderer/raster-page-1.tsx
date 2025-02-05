import { Vector3 } from '../../libs/math/vector3';
import { Triangle } from './core/triangle';
import { Vertex } from './core/vertex';
import { RGBColor } from '../../libs/utils/color';
import { useEngine } from './util/use-engine';
import { Mesh } from './core/mesh';
import { Controller } from './components/controller';
import { useEffect } from 'react';
import { HEIGHT, WIDTH } from './util/constants';

export const SimSoftRendererPage1 = () => {
  const engine = useEngine({ pixelSize: 2 });
  const { canvasRef } = engine;

  // 场景中添加物体
  useEffect(() => {
    // 构建一个三角形
    const v1 = Vector3.fromArray([-1, 1, -1]);
    const v2 = Vector3.fromArray([1, -1, -1]);
    const v3 = Vector3.fromArray([-1, -1, -1]);

    const c1 = RGBColor.randomColor();
    const c2 = RGBColor.randomColor();
    const c3 = RGBColor.randomColor();

    const vx1 = new Vertex(v1, c1);
    const vx2 = new Vertex(v2, c2);
    const vx3 = new Vertex(v3, c3);

    const t1 = new Triangle([vx1, vx2, vx3]);

    const mesh = new Mesh([t1]);

    engine.scene.addMesh(mesh);
  }, []);

  return (
    <div className="flex gap-10 p-8">
      <div>
        <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
      </div>

      <Controller {...engine} />
    </div>
  );
};

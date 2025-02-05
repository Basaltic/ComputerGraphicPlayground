import { downloadModels, MeshMap } from '../../libs/third-party/obj-loader/utils';

import { useRequest } from 'ahooks';
import { Mesh } from './core/mesh';
import { useEngine } from './util/use-engine';
import { Controller } from './components/controller';
import { HEIGHT, WIDTH } from './util/constants';

/**
 * bunny
 */
export const SimSoftRendererPage3 = () => {
  const engine = useEngine();
  const { canvasRef } = engine;

  const { loading, run } = useRequest(async () => {
    const res = await downloadModels([{ obj: '/models/bunny/bunny.obj', mtl: false, downloadMtlTextures: false }]);

    const mesh = Mesh.fromLoaderMesh(res.bunny);

    engine.scene.addMesh(mesh);

    engine.camera.scale(15, 15, 15);
    engine.camera.translate(0, -1, 0);
  });

  return (
    <div style={{ width: 'fit-content', padding: '10px', display: 'flex' }}>
      <div className="positive">
        <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />

        {loading ? <p className="absolute top-10 left-10">正在加载，请稍后</p> : null}
      </div>

      <Controller {...engine} run={run} />
    </div>
  );
};

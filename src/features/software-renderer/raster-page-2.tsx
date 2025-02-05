import { downloadModels } from '../../libs/third-party/obj-loader/utils';

import { useRequest } from 'ahooks';
import { useEngine } from './util/use-engine';
import { Mesh } from './core/mesh';
import { Controller } from './components/controller';
import { HEIGHT, WIDTH } from './util/constants';

/**
 * cube
 */
export const SimSoftRendererPage2 = () => {
  const engine = useEngine();
  const { canvasRef } = engine;

  const { loading, run } = useRequest(async () => {
    const res = await downloadModels([{ obj: '/models/cube/cube.obj', mtl: false, downloadMtlTextures: false }]);

    const mesh = Mesh.fromLoaderMesh(res.cube);

    engine.scene.addMesh(mesh);
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

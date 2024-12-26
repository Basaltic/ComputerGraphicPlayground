import { EngineType } from '../util/use-engine';
import { Button } from '@/components/ui/button';
import { STEP_ANGLE, STEP_SCALE, STEP_TRANSLATE } from '../util/constants';

export function Controller(props: EngineType) {
  const { run, camera, changePixelSize } = props;

  return (
    <div className="ml-10 flex flex-col gap-2">
      <div>
        <Button onClick={run}>重新渲染</Button>
      </div>
      <div className="flex flex-col gap-2">
        <div>
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">摄像机</h2>
        </div>
        <div className="flex gap-2">
          <div>
            <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">移动</h2>
          </div>
          <Button onClick={() => camera.translate(0, -STEP_TRANSLATE, 0)}>上</Button>
          <Button onClick={() => camera.translate(0, STEP_TRANSLATE, 0)}>下</Button>
          <Button onClick={() => camera.translate(STEP_TRANSLATE, 0, 0)}>左</Button>
          <Button onClick={() => camera.translate(-STEP_TRANSLATE, 0, 0)}>右</Button>
          <Button onClick={() => camera.translate(0, 0, STEP_TRANSLATE)}>前</Button>
          <Button onClick={() => camera.translate(0, 0, -STEP_TRANSLATE)}>后</Button>
        </div>
        <div className="flex gap-2">
          <div>
            <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">旋转</h2>
          </div>
          {/* <Button onClick={() => camera.rotate(0, -STEP_ANGLE, 0)}>yaw</Button> */}
          <Button onClick={() => camera.rotate(0, STEP_ANGLE, 0)}>yaw</Button>
          <Button onClick={() => camera.rotate(STEP_ANGLE, 0, 0)}>pitch</Button>
          {/* <Button onClick={() => camera.rotate(-STEP_ANGLE, 0, 0)}>pitch</Button> */}
          <Button onClick={() => camera.rotate(0, 0, STEP_ANGLE)}>roll</Button>
          {/* <Button onClick={() => camera.rotate(0, 0, -STEP_ANGLE)}>roll</Button> */}
        </div>
        <div className="flex gap-2">
          <div>
            <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">缩放</h2>
          </div>
          <Button onClick={() => camera.scale(STEP_SCALE, STEP_SCALE, STEP_SCALE)}>放大</Button>
          <Button onClick={() => camera.scale(-STEP_SCALE, -STEP_SCALE, -STEP_SCALE)}>缩小</Button>
        </div>

        <div>
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">物体</h2>
        </div>

        <div>
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">其他</h2>
        </div>
        <div className="flex gap-2">
          <input type="number" placeholder="像素大小" onChange={(e) => changePixelSize(Number(e.target.value))} />
        </div>
      </div>
    </div>
  );
}

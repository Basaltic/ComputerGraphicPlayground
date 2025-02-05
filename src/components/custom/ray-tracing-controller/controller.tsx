import { Input } from '@/components/ui/input';
import { useSetState } from 'ahooks';

export interface RayTracingControllerState {
  samplesPerPixel: number;
  maxDepth: number;
}

export function useRayTracingController() {
  const [state, setState] = useSetState({ samplesPerPixel: 100, maxDepth: 50 });

  return {
    state: state,
    controller: (
      <div>
        <Input
          placeholder="请输入每像素采样数"
          defaultValue={state.samplesPerPixel}
          onChange={(e) => setState({ samplesPerPixel: Number(e.target.value || 10) })}
        />
        <Input
          placeholder="请输入光线最大折射次数"
          defaultValue={state.maxDepth}
          onChange={(e) => setState({ maxDepth: Number(e.target.value || 10) })}
        />
      </div>
    )
  };
}

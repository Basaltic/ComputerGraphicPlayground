import React, { useEffect, useRef } from 'react';
import { Bitmap } from '../../libs/utils/bitmap';

const WIDTH = 400;
const HEIGHT = 300;

export const TestPage = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const image = new Image();
    image.src = 'http://127.0.0.1:5173/images/earthmap.png';

    image.onload = function (ev) {
      console.log(ev);
      const bitmap = Bitmap.fromImage(image);
      console.log(bitmap.get(200, 96));
      if (!ref.current) return;

      const context = ref.current?.getContext && ref.current?.getContext('2d');

      const width = image.naturalWidth || image.offsetWidth || image.width;
      const height = image.naturalHeight || image.offsetHeight || image.height;

      context?.drawImage(image, 0, 0, width, height);

      const imageData = context?.getImageData(0, 0, width, height);

      if (!imageData) return;
      console.log(imageData);

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const r = imageData.data[(x + y * width) * 4];
          const g = imageData.data[(x + y * width) * 4 + 1];
          const b = imageData.data[(x + y * width) * 4 + 2];

          const color = (r << 16) | (g << 8) | b;
          // console.log(x, y, color);
          bitmap.set(x, y, color);
        }
      }
      console.log(bitmap.get(200, 96));
    };
  }, []);

  return (
    <div>
      TestPage
      <canvas ref={ref} width={WIDTH} height={HEIGHT} style={{ width: WIDTH, height: HEIGHT }} />
    </div>
  );
};

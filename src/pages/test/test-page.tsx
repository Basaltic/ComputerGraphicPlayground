import React, { useEffect } from 'react';
import { Bitmap } from '../../libs/utils/bitmap';

export const TestPage = () => {
  useEffect(() => {
    const image = new Image();
    image.src = 'http://127.0.0.1:5173/images/wall.png';

    image.onload = function (ev) {
      console.log(ev);
      const bitmap = Bitmap.fromImage(image);
      console.log(bitmap.get(0, 0));
    };
  }, []);

  return <div>TestPage</div>;
};

import React, { useRef } from 'react'

const WIDTH = 800;
const HEIGHT = 800;

/**
 * 
 */
export const SimSoftRendererPage = () => {
  const canvasRef = useRef(null)

  

  return (
    <div style={{ background: 'white', width: 'fit-content', margin: '10px 0px 0px 10px' }}>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
    </div>
  )
}

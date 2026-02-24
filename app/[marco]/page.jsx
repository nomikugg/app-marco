"use client"

import { useState, useRef } from "react"
import { useParams } from "next/navigation"
import { Stage, Layer, Image as KonvaImage } from "react-konva"
import useImage from "use-image"

export default function MarcoPage() {

  const { marco } = useParams()
  const stageRef = useRef()

  const [userImage, setUserImage] = useState(null)
  const [scale, setScale] = useState(1)

  const [image] = useImage(userImage)
  const [frame] = useImage(`/${marco}.png`)

  const handleUpload = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = () => {
      setUserImage(reader.result)
    }

    reader.readAsDataURL(file)
  }

  const downloadImage = () => {
    const uri = stageRef.current.toDataURL()
    const link = document.createElement("a")
    link.download = `${marco}.png`
    link.href = uri
    link.click()
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6">

      <h1 className="text-2xl font-bold capitalize">
        Marco: {marco}
      </h1>

      <input type="file" accept="image/*" onChange={handleUpload} />

      <div className="border shadow-lg">
        <Stage width={800} height={800} ref={stageRef}>
          <Layer>

            {image && (
              <KonvaImage
                image={image}
                draggable
                scaleX={scale}
                scaleY={scale}
              />
            )}

            {frame && (
              <KonvaImage
                image={frame}
                listening={false}
              />
            )}

          </Layer>
        </Stage>
      </div>

      <input
        type="range"
        min="0.5"
        max="2"
        step="0.1"
        value={scale}
        onChange={(e) => setScale(parseFloat(e.target.value))}
      />

      <button
        onClick={downloadImage}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Descargar
      </button>

    </div>
  )
}
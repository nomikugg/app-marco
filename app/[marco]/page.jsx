"use client"
import { useState, useRef, useEffect } from "react"
import { useParams, notFound } from "next/navigation"
import { Stage, Layer, Image as KonvaImage } from "react-konva"

export default function MarcoPage() {

  const { marco } = useParams()

  const marcosValidos = ["sistemas", "ingenieria", "promocion2026"]

  if (!marcosValidos.includes(marco)) {
    notFound()
  }
  //estado de fondo
  const [darkMode, setDarkMode] = useState(false)



  const stageRef = useRef()
  const fileInputRef = useRef(null)
  const [userImage, setUserImage] = useState(null)
  const [image, setImage] = useState(null)
  const [frame, setFrame] = useState(null)

  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)


  const [stageSize, setStageSize] = useState(800)

  const [position, setPosition] = useState({ x: 400, y: 400 })


  // responsive telefono
  useEffect(() => {
    const updateSize = () => {
        const size = Math.min(window.innerWidth - 40, 800)
        setStageSize(size)
        setPosition({ x: size / 2, y: size / 2 })
    }

    updateSize()
    window.addEventListener("resize", updateSize)

    return () => window.removeEventListener("resize", updateSize)
  }, [])
  useEffect(() => {
    const frameImg = new window.Image()
    frameImg.src = `/${marco}.png`
    frameImg.onload = () => setFrame(frameImg)
  }, [marco])

  useEffect(() => {
    if (userImage) {
      const img = new window.Image()
      img.src = userImage
      img.onload = () => setImage(img)
    }
  }, [userImage])

  const handleUpload = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = () => setUserImage(reader.result)
    reader.readAsDataURL(file)
  }

  const downloadImage = () => {
    const uri = stageRef.current.toDataURL()
    const link = document.createElement("a")
    // link.download = `${marco}.png`
    link.download = "FotoConMarco_AlianzaGenteNueva.png"
    link.href = uri
    link.click()
  }

  // CONTROLES para zoom y rotate
  const zoomIn = () => setScale(prev => prev + 0.1)
  const zoomOut = () => setScale(prev => Math.max(0.2, prev - 0.1))
  const rotateLeft = () => setRotation(prev => prev - 10)
  const rotateRight = () => setRotation(prev => prev + 10)

  return (
    <div className={`flex flex-col items-center gap-4 p-6 min-h-screen transition-colors duration-300 ${
    darkMode
      ? "bg-gray-900 text-white"
      : "bg-white text-black"
    }`}>
    <button
  onClick={() => setDarkMode(!darkMode)}
  className="px-4 py-2 rounded bg-gray-800 text-white hover:opacity-80 transition"
>
  {darkMode ? "Modo Claro ☀️" : "Modo Oscuro 🌙"}
</button>

      <h1 className="text-2xl font-bold capitalize">
        Marco: {marco}
      </h1>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleUpload}
        style={{ display: "none" }}
        />

        <button
        onClick={() => fileInputRef.current.click()}
        className="bg-[#00d8ff] text-white px-6 py-2 rounded hover:bg-gray-800 transition"
        >
        {image ? "Subir otra foto" : "Subir foto"}
        </button>

      {/* 🔥 BOTONES */}
      <div className="flex gap-2 flex-wrap justify-center">

        <button
          onClick={zoomIn}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Zoom +
        </button>

        <button
          onClick={zoomOut}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Zoom -
        </button>

        <button
          onClick={rotateLeft}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          ⟲ Rotar Izq
        </button>

        <button
          onClick={rotateRight}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Rotar Der ⟳
        </button>

      </div>
      <div className={`p-2 rounded-2xl shadow-xl transition-all duration-300 ${
        darkMode
  ? "bg-gray-800 border border-cyan-500/40 shadow-black/40"
  : "bg-white border border-gray-200 shadow-gray-300"
        }`}>
        <Stage width={stageSize} height={stageSize} ref={stageRef}>
            <Layer>

            {image && (
                <KonvaImage
                image={image}
                draggable
                x={position.x}
                y={position.y}
                offsetX={image.width / 2}
                offsetY={image.height / 2}
                scaleX={scale}
                scaleY={scale}
                rotation={rotation}
                onDragEnd={(e) => {
                    setPosition({
                    x: e.target.x(),
                    y: e.target.y()
                    })
                }}
                />
            )}

            {frame && (
                <KonvaImage
                image={frame}
                listening={false}
                width={stageSize}
                height={stageSize}
                />
            )}

            </Layer>
        </Stage>
      </div>
      

      <button
        onClick={downloadImage}
        disabled={!image}
        className={`px-6 py-2 rounded text-white ${
            image
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
        >
        Descargar
      </button>

    </div>
  )
}
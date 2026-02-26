"use client"
import { useState, useRef, useEffect } from "react"
import { useParams, notFound } from "next/navigation"
import { Stage, Layer, Image as KonvaImage } from "react-konva"
import { Cardo } from "next/font/google"

export default function MarcoPage() {

  const { marco } = useParams()

  const marcosValidos = ["sistemas", "tardio", "promocion2026"]

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


//   const [stageSize, setStageSize] = useState(800)
  const [stageSize, setStageSize] = useState(null)

  const [position, setPosition] = useState({ x: 400, y: 400 })
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  //imagen alta calidad

  const [downloading, setDownloading] = useState(false)

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

  const handlePreview = () => {
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 })
    setPreviewImage(uri)
    setPreviewOpen(true)
  }
  const handleUpload = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = () => setUserImage(reader.result)
    reader.readAsDataURL(file)
  }

  const downloadImage = () => {
    setDownloading(true)

    setTimeout(() => {
        const uri = stageRef.current.toDataURL({ pixelRatio: 3 }) // HD
        const link = document.createElement("a")
        link.download = "Frame_FatimaTardio.png"
        link.href = uri
        link.click()
        setDownloading(false)
    }, 800)
    }

  // CONTROLES para zoom y rotate
  const zoomIn = () => setScale(prev => prev + 0.1)
  const zoomOut = () => setScale(prev => Math.max(0.2, prev - 0.1))
  const rotateLeft = () => setRotation(prev => prev - 10)
  const rotateRight = () => setRotation(prev => prev + 10)

  return (
    <div className={`flex flex-col items-center gap-4 p-6 min-h-screen transition-colors duration-300 overflow-x-hidden ${
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

      <h1 className="text-2xl font-bold">
        Mi Voto es por {marco === "sistemas" ? "Luis Ayllon" : marco === "tardio" ? "Fátima Tardío" : ""}
      </h1>
      {/* CARD COMISION */}
      <div className="max-w-sm mx-auto bg-white dark:bg-white rounded-xl shadow-lg overflow-hidden border border-gray-800 dark:border-gray-700 p-6 transition-transform hover:scale-105 hover:shadow-2xl">
        <h2 className="text-lg font-semibold text-black dark:text-dark mb-1">
          SISTEMAS - TI
        </h2>
        {/* <p className="text-gray-500 dark:text-gray-300 text-sm">
          
        </p> */}
      </div>
      <br />

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
        <div className="flex flex-col items-center gap-2 w-64 mx-auto">
            <label className="text-sm font-medium">
                Zoom: {(scale * 100).toFixed(0)}%
            </label>

            <input
                type="range"
                min="0.2"
                max="3"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full bg-[#00d8ff]"
            />
        </div>
        {stageSize &&
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
                dragBoundFunc={(pos) => {
                    const limit = stageSize / 2

                    return {
                    x: Math.max(0, Math.min(stageSize, pos.x)),
                    y: Math.max(0, Math.min(stageSize, pos.y)),
                    }
                }}
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
        </Stage>}
      </div>
      
      <div className="flex gap-3">
            <button
                onClick={downloadImage}
                disabled={!image || downloading}
                className={`px-6 py-2 rounded text-white transition-all duration-300 ${
                    downloading
                    ? "bg-cyan-400 animate-pulse"
                    : image
                    ? "bg-green-400 hover:scale-105 hover:bg-green-600"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                >
                {downloading ? "Descargando..." : "Descargar"}
            </button>
            <button
                onClick={handlePreview}
                disabled={!image}
                className="px-6 py-2 rounded bg-[#00d8ff] text-white hover:scale-105 transition cursor-pointer">
                Previsualizar
            </button>
            {previewOpen && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                <div className="bg-white p-4 rounded-2xl shadow-2xl max-w-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}  
                <img src={previewImage} className="rounded-xl" alt="desc" />
                <div className="flex justify-end mt-4">
                    <button
                    onClick={() => setPreviewOpen(false)}
                    className="px-4 py-2 bg-gray-800 text-white rounded text-center hover:cursor-pointer"
                    >
                    Cerrar
                    </button>
                </div>
                </div>
            </div>
            )}
      </div>
      
      

    </div>
  )
}
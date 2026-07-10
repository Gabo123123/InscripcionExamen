import { useState, useRef, useCallback, useEffect } from 'react'
import { Plus, Camera, Upload, X, Check } from 'lucide-react'
import Cropper from 'react-easy-crop'

interface PhotoUploadProps {
  onCapture: (base64: string) => void
  currentImage?: string
}

export default function PhotoUpload({ onCapture, currentImage }: PhotoUploadProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mode, setMode] = useState<'select' | 'camera' | 'crop'>('select')
  
  // Camera state
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState('')

  // Crop state
  const [imageToCrop, setImageToCrop] = useState<string>('')
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // ─── Camera Logic ────────────────────────────────────────────────────────
  
  const startCamera = async () => {
    try {
      setMode('camera')
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } 
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setCameraError('')
    } catch (err) {
      setCameraError('No se pudo acceder a la cámara.')
      console.error(err)
    }
  }

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }, [stream])

  useEffect(() => {
    return () => stopCamera()
  }, [stopCamera])

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const base64 = canvas.toDataURL('image/jpeg', 1.0)
        setImageToCrop(base64)
        stopCamera()
        setMode('crop')
      }
    }
  }

  // ─── File Upload Logic ───────────────────────────────────────────────────

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        setImageToCrop(reader.result as string)
        setMode('crop')
      })
      reader.readAsDataURL(file)
    }
  }

  // ─── Cropping Logic ──────────────────────────────────────────────────────

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const getCroppedImg = async () => {
    try {
      const image = new Image()
      image.src = imageToCrop
      await new Promise(resolve => image.onload = resolve)

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) return

      canvas.width = croppedAreaPixels.width
      canvas.height = croppedAreaPixels.height

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      )

      const base64Image = canvas.toDataURL('image/jpeg', 0.9)
      onCapture(base64Image)
      closeModal()
    } catch (e) {
      console.error(e)
    }
  }

  // ─── Modal Management ────────────────────────────────────────────────────

  const openModal = () => {
    setIsModalOpen(true)
    setMode('select')
    setImageToCrop('')
  }

  const closeModal = () => {
    setIsModalOpen(false)
    stopCamera()
  }

  return (
    <div className="flex w-full flex-col items-center">
      {/* 1. Área del Avatar Gigante */}
      <div className="mb-8 mt-4 flex justify-center">
        <div className="flex h-48 w-48 overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-xl ring-1 ring-slate-900/5">
          {currentImage ? (
            <img src={currentImage} alt="Foto del postulante" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-400">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-28 w-28 opacity-30">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* 2. Etiqueta y Botón + Falso Input */}
      <div className="w-full max-w-sm">
        <label className="mb-2 block text-sm font-semibold text-slate-700">Registra tu fotografía *</label>
        <div className="flex items-center gap-3">
          <div className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-400">
            {currentImage ? 'Fotografía adjuntada' : 'Adjuntar Fotografía'}
          </div>
          <button
            type="button"
            onClick={openModal}
            className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-lg bg-orange-500 text-white shadow-md transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
          >
            <Plus strokeWidth={3} size={20} />
          </button>
        </div>
      </div>

      {/* 3. Modal de Interacción */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Cabecera */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h3 className="text-lg font-semibold text-slate-800">
                {mode === 'select' && 'Seleccionar Origen'}
                {mode === 'camera' && 'Tomar Foto'}
                {mode === 'crop' && 'Recortar Foto'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>

            {/* Contenido Dinámico */}
            <div className="p-6">
              {mode === 'select' && (
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-slate-200 py-4 text-slate-600 transition hover:border-sky-500 hover:bg-sky-50 hover:text-sky-700 font-medium"
                  >
                    <Upload size={20} />
                    Subir foto desde PC
                  </button>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                  />
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="shrink-0 px-4 text-sm text-slate-400">O</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                  </div>
                  <button
                    onClick={startCamera}
                    className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-slate-200 py-4 text-slate-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 font-medium"
                  >
                    <Camera size={20} />
                    Usar cámara web
                  </button>
                </div>
              )}

              {mode === 'camera' && (
                <div className="flex flex-col items-center gap-4">
                  {cameraError ? (
                    <div className="text-red-500 text-sm">{cameraError}</div>
                  ) : (
                    <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-black">
                      <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
                    </div>
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                  <button
                    onClick={takePhoto}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700"
                  >
                    <Camera size={18} />
                    Capturar
                  </button>
                </div>
              )}

              {mode === 'crop' && (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-full h-80 rounded-xl overflow-hidden bg-slate-900">
                    <Cropper
                      image={imageToCrop}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      cropShape="round"
                      showGrid={false}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  </div>
                  <div className="w-full px-2">
                    <input
                      type="range"
                      value={zoom}
                      min={1}
                      max={3}
                      step={0.1}
                      aria-labelledby="Zoom"
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                    />
                  </div>
                  <button
                    onClick={getCroppedImg}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 py-3 font-semibold text-white transition hover:bg-sky-700"
                  >
                    <Check size={18} />
                    Confirmar Foto
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

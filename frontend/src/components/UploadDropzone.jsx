import { useRef, useState } from 'react'

export default function UploadDropzone({ accept, file, onFileSelected, hint }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = (files) => {
    if (files && files[0]) onFileSelected(files[0])
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        handleFiles(e.dataTransfer.files)
      }}
      onClick={() => inputRef.current?.click()}
      className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all backdrop-blur ${
        dragging
          ? 'border-signal bg-signal/5 shadow-[0_0_40px_-12px_rgb(var(--color-signal)/0.35)]'
          : 'border-panelBorder bg-panel/80 hover:border-signal/50'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {file ? (
        <div>
          <p className="font-mono text-sm text-signal">{file.name}</p>
          <p className="text-xs text-textSecondary mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB — click to replace</p>
        </div>
      ) : (
        <div>
          <p className="font-medium text-textPrimary">Drop a file here, or click to browse</p>
          <p className="text-xs text-textSecondary mt-2 font-mono">{hint}</p>
        </div>
      )}
    </div>
  )
}
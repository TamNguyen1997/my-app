"use client"

import { useEffect } from "react"

const FullscreenModal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => {
      if (e.key === "Escape") {
        onClose?.()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const stop = (e) => e.stopPropagation()

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 flex" onClick={stop}>
        <div className="bg-white w-full h-full overflow-auto flex flex-col">
          {children}
        </div>
      </div>
    </div>
  )
}

export default FullscreenModal



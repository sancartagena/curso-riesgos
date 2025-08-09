import React from 'react'

export function Progress({ value = 0, className='' }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0))
  return (
    <div className={`w-full h-2 bg-gray-100 rounded-full overflow-hidden ${className}`}>
      <div className="h-full bg-black" style={{ width: `${v}%` }} />
    </div>
  )
}

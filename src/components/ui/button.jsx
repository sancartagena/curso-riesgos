import React from 'react'

export function Button({ children, variant = 'default', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium border transition-colors disabled:opacity-50 disabled:pointer-events-none'
  const variants = {
    default: 'bg-black text-white border-black hover:opacity-90',
    outline: 'bg-white text-black border-gray-300 hover:bg-gray-50'
  }
  return (
    <button className={`${base} ${variants[variant] || variants.default} ${className}`} {...props}>
      {children}
    </button>
  )
}

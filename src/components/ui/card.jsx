import React from 'react'

export function Card({ className = '', children }) {
  return <div className={`rounded-2xl border bg-white shadow-sm ${className}`}>{children}</div>
}
export function CardHeader({ children, className='' }) {
  return <div className={`p-4 border-b ${className}`}>{children}</div>
}
export function CardTitle({ children, className='' }) {
  return <div className={`text-base font-semibold ${className}`}>{children}</div>
}
export function CardContent({ children, className='' }) {
  return <div className={`p-4 space-y-3 ${className}`}>{children}</div>
}

import { Link, type LinkProps } from '@tanstack/react-router'
import type React from 'react'
import Poster from './poster'

interface Props {
  title: string
  posterPath: string | null
  topRight?: React.ReactNode
  footer?: React.ReactNode
  small?: boolean
  to?: LinkProps['to']
  params?: LinkProps['params']
  children?: React.ReactNode
}

export default function BaseEntityCard({
  title,
  posterPath,
  topRight,
  footer,
  to,
  params,
  children,
}: Props) {
  const content = (
    <article
      className={`group relative overflow-hidden rounded-md border border-[#333] bg-dark/40 backdrop-blur-md shadow-lg shadow-white/20 ring-1 ring-white/5 p-1`}
    >
      <Poster transition path={posterPath} size="w342" h={242} />

      {topRight && <div className="absolute top-1 right-1">{topRight}</div>}

      <p className="mt-2 truncate px-1 text-sm font-semibold">{title}</p>

      {footer && (
        <footer className="text-gray-400 mt-1 flex items-center justify-between text-sm">
          {footer}
        </footer>
      )}

      {children}
    </article>
  )

  // If "to" is provided, wrap in a <Link>
  return to ? (
    <Link to={to} params={params}>
      {content}
    </Link>
  ) : (
    content
  )
}

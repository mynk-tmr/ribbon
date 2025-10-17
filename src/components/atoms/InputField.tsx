import { formControl, type FormControlVariants } from '@/styles/form'
import { Icon } from '@iconify/react'
import React from 'react'

export function InputField({
  label,
  icon,
  helper,
  error,
  state,
  disabled,
  size,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  helper?: string
  error?: string
  icon?: string // iconify name like "mdi:email-outline"
} & FormControlVariants) {
  const {
    root,
    label: labelCls,
    wrapper,
    icon: iconCls,
    input,
    helper: helperCls,
    error: errorCls,
  } = formControl({
    state: error ? 'error' : disabled ? 'disabled' : state,
    size,
    withIcon: Boolean(icon),
  })

  return (
    <div className={root()}>
      {label && <label className={labelCls()}>{label}</label>}
      <div className={wrapper()}>
        {icon && (
          <span className={iconCls()}>
            <Icon icon={icon} width='1em' height='1em' />
          </span>
        )}
        <input {...props} className={input()} disabled={disabled} />
      </div>
      {error ? (
        <span className={errorCls()}>{error}</span>
      ) : helper ? (
        <span className={helperCls()}>{helper}</span>
      ) : null}
    </div>
  )
}

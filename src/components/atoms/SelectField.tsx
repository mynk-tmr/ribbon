import { formControl } from '@/styles/form'
import { Icon } from '@iconify/react'
import React from 'react'

type Option<Value extends string | number = string> = {
  label: string
  value: Value
}

// 💡 Generic SelectField that infers value type from options
export function SelectField<
  T extends readonly Option<string | number>[], // infer union of values
>({
  label,
  icon,
  helper,
  error,
  state,
  disabled,
  size,
  options,
  value,
  onValueChange,
  ...props
}: Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value'> & {
  label?: string
  helper?: string
  error?: string
  state?: 'default' | 'error' | 'success'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  options: T
  value?: T[number]['value']
  onValueChange?: (value: T[number]['value']) => void
}) {
  const {
    root,
    label: labelCls,
    wrapper,
    icon: iconCls,
    select,
    helper: helperCls,
    error: errorCls,
    chevron,
  } = formControl({
    state: error ? 'error' : disabled ? 'disabled' : state,
    size,
    withIcon: Boolean(icon),
  })

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as T[number]['value']
    onValueChange?.(val)
  }

  return (
    <div className={root()}>
      {label && <label className={labelCls()}>{label}</label>}
      <div className={wrapper()}>
        {icon && (
          <span className={iconCls()}>
            <Icon icon={icon} width='1em' height='1em' />
          </span>
        )}
        <select
          {...props}
          disabled={disabled}
          value={value}
          onChange={handleChange}
          className={select()}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className={chevron()}>
          <Icon icon='mdi:chevron-down' width='1em' height='1em' />
        </span>
      </div>
      {error ? (
        <span className={errorCls()}>{error}</span>
      ) : helper ? (
        <span className={helperCls()}>{helper}</span>
      ) : null}
    </div>
  )
}

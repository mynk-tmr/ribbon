import { type FormControlVariants, formControl } from '@/styles/form'
import { Icon } from '@iconify/react'

export function InputField({
  label,
  icon,
  helper,
  error,
  state,
  disabled,
  size,
  onValueChange = () => {},
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  helper?: string
  error?: string
  icon?: string // iconify name like "mdi:email-outline"
  onValueChange?: (value: string) => void
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
        <input
          onChange={(e) => onValueChange(e.target.value)}
          className={input()}
          disabled={disabled}
          {...props}
        />
      </div>
      {error ? (
        <span className={errorCls()}>{error}</span>
      ) : helper ? (
        <span className={helperCls()}>{helper}</span>
      ) : null}
    </div>
  )
}

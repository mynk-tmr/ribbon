import { Icon } from '@iconify/react'
import cn from '@/helpers/cn'

interface Props {
  icon: string
  label: string | number
  className?: string
}

export const MetaItem = ({ icon, label, className }: Props) => (
  <span className={cn.filter('flex items-center gap-1', className)}>
    <Icon icon={icon} width={14} height={14} />
    <span>{label}</span>
  </span>
)

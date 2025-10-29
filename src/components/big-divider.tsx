import { Icon } from '@iconify/react'
import { Divider } from '@mantine/core'

export default function BigDivider({ icon, title }: { icon: string; title: string }) {
  return (
    <Divider
      labelPosition="center"
      label={
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {title} <Icon icon={icon} className="inline" />
        </h2>
      }
    />
  )
}

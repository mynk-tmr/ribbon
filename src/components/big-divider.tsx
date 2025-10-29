import { Icon } from '@iconify/react'
import { Divider } from '@mantine/core'

export default function BigDivider({ icon, title }: { icon: string; title: string }) {
  return (
    <Divider
      labelPosition="center"
      label={
        <h2 className="text-2xl font-medium md:text-3xl my-4">
          {title} <Icon icon={icon} className="inline" />
        </h2>
      }
    />
  )
}

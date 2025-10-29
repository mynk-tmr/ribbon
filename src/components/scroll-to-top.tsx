import { Icon } from '@iconify/react'
import { Affix, Button, Transition } from '@mantine/core'
import { useViewportSize, useWindowScroll } from '@mantine/hooks'

export default function ScrollToTop() {
  const [scroll, scrollTo] = useWindowScroll()
  const { width } = useViewportSize()
  return (
    <Affix position={{ top: 20, left: width / 2 - 50 }}>
      <Transition transition="slide-up" mounted={scroll.y > 0}>
        {(transitionStyles) => (
          <Button
            size="compact-sm"
            radius="xl"
            bg="blue.5"
            leftSection={<Icon icon="mdi:arrow-up" />}
            style={transitionStyles}
            onClick={() => scrollTo({ y: 0 })}
          >
            Scroll to top
          </Button>
        )}
      </Transition>
    </Affix>
  )
}

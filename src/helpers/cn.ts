import { twMerge } from 'tailwind-merge'

function filter(...classes: (string | undefined | false | null)[]): string {
  return twMerge(classes.filter(Boolean).join(' '))
}

function first<T>(...classes: T[]): T {
  return classes.find(Boolean) ?? classes[classes.length - 1]
}

export default { filter, first }

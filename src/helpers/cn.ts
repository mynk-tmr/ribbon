function filter<T>(...classes: T[]): string {
  return classes.filter(Boolean).join(' ')
}

function first<T>(...classes: T[]): T {
  return classes.find(Boolean) ?? classes[classes.length - 1]
}

export default { filter, first }

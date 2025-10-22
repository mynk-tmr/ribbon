export function linkToDiceBear(seed: string) {
  const enc_seed = encodeURIComponent(seed)
  return `https://api.dicebear.com/8.x/adventurer/svg?seed=${enc_seed}`
}

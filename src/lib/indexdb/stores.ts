import { Store } from '../externs/sync-store'
import { indexdb, type IMedia, type ISearch, type RibbonDB } from './setup'

export const $searches = new Store<ISearch[]>([])
export const $medias = new Store<IMedia[]>([])

type StoreName = 'search' | 'media'

export const IDBStores = { search: $searches, media: $medias }

async function reload(storeName: StoreName) {
  IDBStores[storeName].state = await indexdb.getAll(storeName)
  IDBStores[storeName].emit()
}

async function reloadAll() {
  await reload('search')
  await reload('media')
}

async function getAll(storeName: StoreName) {
  return await indexdb.getAll(storeName)
}

async function clear(storeName: StoreName) {
  await indexdb.clear(storeName)
  await reload(storeName)
}

async function remove<s extends StoreName>(
  storeName: s,
  key: RibbonDB[s]['key'],
) {
  await indexdb.delete(storeName, key)
  await reload(storeName)
}

async function addSearch(query: string, media: 'movie' | 'tv') {
  await indexdb.put('search', {
    title: `${query} / ${media}`,
    addedAt: new Date(),
  })
  await reload('search')
}

async function getByKey<s extends StoreName>(
  storeName: s,
  key: RibbonDB[s]['key'],
) {
  return await indexdb.get(storeName, key)
}

async function updateMedia(media: Partial<IMedia> & Pick<IMedia, 'id'>) {
  const prev = await getByKey('media', media.id)
  if (!prev) throw new Error('Media not found')
  const now = new Date()
  return await indexdb.put(
    'media',
    { ...prev, ...media, updatedAt: now },
    media.id,
  )
}

async function addMedia(
  item: Pick<IMedia, 'id' | 'title' | 'poster_path'>,
  forTv: Pick<IMedia, 'season' | 'end' | 'episode'> = {},
) {
  const now = new Date()
  return await indexdb.put('media', {
    ...item,
    media: forTv.season ? 'tv' : 'movie',
    ...forTv,
    progress: 0,
    favourite: false,
    addedAt: now,
    updatedAt: now,
  })
}

export const RibbonDBActions = {
  clear,
  remove,
  addSearch,
  getAll,
  reload,
  reloadAll,
  getByKey,
  updateMedia,
  addMedia,
}

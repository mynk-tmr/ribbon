import { Store } from '../externs/sync-store'
import { indexdb, type IMedia, type ISearch } from './setup'

class SearchStore extends Store<ISearch[]> {
  async refresh() {
    const docs = await indexdb.getAll('search')
    this.state = docs.sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime())
    this.emit()
  }
  async add(props: { query: string; media: 'movie' | 'tv' }) {
    await indexdb.put('search', {
      title: `${props.query} / ${props.media}`,
      addedAt: new Date(),
    })
    await this.refresh()
  }
  async remove(title: string) {
    await indexdb.delete('search', title)
    await this.refresh()
  }
  async clear() {
    await indexdb.clear('search')
    await this.refresh()
  }
}

class MediaStore extends Store<IMedia[]> {
  movies: IMedia[] = []
  tvs: IMedia[] = []
  async refresh() {
    this.state = (await indexdb.getAll('media')).sort(
      (a, b) => b.addedAt.getTime() - a.addedAt.getTime(),
    )
    this.movies = this.state.filter((m) => m.media === 'movie')
    this.tvs = this.state.filter((m) => m.media === 'tv')
    this.emit()
  }
  async addMedia(
    props: Pick<IMedia, 'id' | 'title' | 'poster_path' | 'media'>,
    tvProps?: Pick<IMedia, 'season' | 'end' | 'episode'>,
  ) {
    const exists = await indexdb.get('media', props.id)
    if (exists) return
    const now = new Date()
    await indexdb.put('media', {
      ...props,
      ...tvProps,
      media: props.media,
      progress: 0,
      addedAt: now,
      updatedAt: now,
      favourite: false,
    })
    await this.refresh()
  }
  private async clear(type: 'movie' | 'tv') {
    const tx = indexdb.transaction('media', 'readwrite')
    const store = tx.objectStore('media')
    const all = await store.getAll()
    for (const item of all) {
      if (item.media === type) store.delete(item.id)
    }
    await tx.done
    await this.refresh()
  }
  async clearMovies() {
    await this.clear('movie')
  }
  async clearTvs() {
    await this.clear('tv')
  }
  private async update(doc: Partial<IMedia>, id: number) {
    const now = new Date()
    const prev = await indexdb.get('media', id)
    if (!prev) throw new Error('Movie not found')
    await indexdb.put('media', { ...prev, ...doc, updatedAt: now })
    await this.refresh()
  }
  async updateTV(doc: Pick<Required<IMedia>, 'id' | 'season' | 'episode'>) {
    await this.update(doc, doc.id)
  }
  async updateProgress(doc: Pick<Required<IMedia>, 'id' | 'progress'>) {
    await this.update(doc, doc.id)
  }
}

export const $medias = new MediaStore([])
export const $searches = new SearchStore([])

await $searches.refresh()
await $medias.refresh()

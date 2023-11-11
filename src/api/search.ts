import instance from '@/api/base'
import type { ISearchResultList } from '@/types'

export function fetchSearchData(key = '') {
  return instance.get<ISearchResultList, ISearchResultList>('home_search', {
    params: { _label_like: key },
  })
}

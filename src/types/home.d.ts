export interface ISearchRecommend {
  value: number
  label: string
}

export interface ISearchResult {
  label: string
  resultCount: number
  type: number
}

export interface ISearchResultList {
  list: ISearchResult[]
}

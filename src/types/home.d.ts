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

export interface IHomeInfo {
  banner: IBanner[]
  searchRecommends: ISearchRecommend[]
  transformer: ITransformer[]
  scrollBarInfoList: IScrollBarInfo[]
  countdown: ICountdown
  activities: string[]
}

export interface IBanner {
  imgUrl: string
}

export interface ITransformer {
  imgUrl: string
  label: string
}

export interface ICountdown {
  time: number
  goods: IGood
}

export interface IGood {
  imgUrl: string
  name: string
  price: number
  oldPrice: number
}

export interface ITransformer {
  imgUrl: string
  label: string
}

export interface IScrollBarInfo {
  type: string
  badge: string
  detail: string
  btn: string
}

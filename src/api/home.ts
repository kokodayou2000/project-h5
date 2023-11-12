import instance from '@/api/base'
import type { IHomeInfo } from '@/types'

export const fetchHomePageData = () => {
  return instance.get<IHomeInfo, IHomeInfo>('home_page')
}

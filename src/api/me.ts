import instance from '@/api/base'
import type { IMeInfo } from '@/types/me'

export const fetchMePageData = () => {
  return instance.get<IMeInfo, IMeInfo>('me_page')
}

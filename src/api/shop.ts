import instance from '@/api/base'
import type { IList, IPaginate, IShop } from '@/types'

export const fetchShopList = ({ _page, _limit }: IPaginate) => {
  return instance.get<IList<IShop>, IList<IShop>>('shop_list', {
    params: {
      _page,
      _limit,
    },
  })
}

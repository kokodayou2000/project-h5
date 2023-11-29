import instance from '@/api/base'
import type { IAuth, ILoginInfo } from '@/types'

export const auth = ({ username, password }: ILoginInfo) => {
  return instance.post<IAuth, IAuth>('auth', {
    username,
    password,
  })
}

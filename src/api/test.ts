import instance from '@/api/base'

export const fetchTest = () => {
  return instance.get('test')
}

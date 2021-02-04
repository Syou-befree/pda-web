import request from '@/utils/request'

export default function getMember() {
  return request({
    url: '/member/allList',
    method: 'get'
  })
}

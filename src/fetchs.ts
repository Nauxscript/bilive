import { $fetch } from 'ohmyfetch'

export interface RoomInfo {
  uid: number
  room_id: number
  short_id: number
  attention: number // 关注人数
  online: number
  is_portrait: boolean
  description: string // 房间描述
  live_status: number // 直播状态 0 未开播 / 1 已开播
  area_id: number // 二级分区id
  area_name: string | number // 二级分区名
  parent_area_id: number // 一级分区id
  parent_area_name: string | number // 一级分区名
  background: string
  title: string | number
  user_cover: string
  keyframe: string
  live_time: string
  tags: string // 标签，以 , 分割
}

interface RoomInfoResponse {
  code: number
  msg: string
  message: string
  data: RoomInfo
}

export const getRoomInfo = async (roomId: number) => {
  const url = `https://api.live.bilibili.com/room/v1/Room/get_info?room_id=${roomId}`
  const response = await $fetch<RoomInfoResponse>(url)
  return response.code === 0 ? response.data : null
}

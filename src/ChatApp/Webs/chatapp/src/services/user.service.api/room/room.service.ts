import { AxiosContracts } from "@/lib/axios/AxiosContracts";
import { httpDelPrivate, httpGetPrivate, httpPostPrivate } from "../_req";
import { CreateRoomDto } from "./room.types";
import { CreateRoomDtoSchema, CreateRoomResponseDtoSchema } from "./room.contracts";

export class RoomService {
  static createRoomMutation(data: {createRoomDto: CreateRoomDto}) {
    const createRoomDto = AxiosContracts.requestContract(
      CreateRoomDtoSchema,
      data.createRoomDto)

    return httpPostPrivate('/management/rooms/creation', createRoomDto)
  }

  static allRoomsQuery() {
    return httpGetPrivate('/management/rooms')
  }

  static addUserToRoom(data: { roomId: number, userId: number }) {
    return httpPostPrivate(`/management/rooms/${data.roomId}/user/${data.userId}`)
  }

  static removeUserFromRoom(data: {roomId: number, userId: number}) {
    return httpDelPrivate(`/management/rooms/${data.roomId}/user/${data.userId}`)
  }
}
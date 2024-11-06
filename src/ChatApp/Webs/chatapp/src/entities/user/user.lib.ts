import { User } from "./user.types";
import { userTypesDto } from "@/services/user.service.api/user";

export function transformUserDtoToUser(
  userDto: userTypesDto.UserDto
) : User{
  return {
    ...userDto
  }
}
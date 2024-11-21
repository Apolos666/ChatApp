import { httpGetPrivate, httpPostPrivate } from "../_req"
import { AxiosContracts } from "@/lib/axios/AxiosContracts"
import { UserDtoSchema, UsersByNameDtoSchema } from "./user.contracts"
import { userContractsDto, userTypesDto } from "."
import { UsersParamsQueryDto } from "./user.types"

export class UserService {
  static loggedUserProfileQuery() {
    return httpGetPrivate('/user/profile')
            .then(AxiosContracts.responseContract(UserDtoSchema))
  }

  static usersByNameQuery(config: {
    params: UsersParamsQueryDto
  }) {
    return httpGetPrivate('/user/search', config)
            // .then(AxiosContracts.responseContract(UsersByNameDtoSchema))
  }
  
  static updateLoggedUserProfileMutation(data: { updateLoggedUserProfileDto: userTypesDto.UpdateUserDto }) {
    const updateLoggedUserProfileDto = AxiosContracts.requestContract(
      userContractsDto.UpdateUserDtoSchema,
      data.updateLoggedUserProfileDto
    )

    return httpPostPrivate('/user/profile', updateLoggedUserProfileDto)
  }

  static updateUserAvatarMutation(formData: FormData) {
    return httpPostPrivate('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
import { httpGetPrivate, httpPostPrivate } from "../_req"
import { AxiosContracts } from "@/lib/axios/AxiosContracts"
import { UserDtoSchema } from "./user.contracts"
import { userContractsDto, userTypesDto } from "."

export class UserService {
  static loggedUserProfileQuery() {
    return httpGetPrivate('/user/profile')
            .then(AxiosContracts.responseContract(UserDtoSchema))
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
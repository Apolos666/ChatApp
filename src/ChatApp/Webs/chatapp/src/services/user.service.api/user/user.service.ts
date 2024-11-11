import { httpGetPrivate } from "../_req"
import { AxiosContracts } from "@/lib/axios/AxiosContracts"
import { UserDtoSchema } from "./user.contracts"

export class UserService {
  static loggedUserProfileQuery() {
    return httpGetPrivate('/user/profile')
            .then(AxiosContracts.responseContract(UserDtoSchema))
  }
}
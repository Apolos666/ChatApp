import { AxiosContracts } from "@/lib/axios/AxiosContracts";
import { httpPost } from "../_req";
import { LoginDto } from "./auth.types";
import { LoginDtoSchema, LoginResponseDtoSchema } from "./auth.contracts";

export class AuthService {
  static loginMutation(data: { loginDto: LoginDto }) {
    // const loginDto = AxiosContracts.requestContract(LoginDtoSchema, data)

    return httpPost('/auth/login', data.loginDto)
          // .then(AxiosContracts.responseContract(LoginResponseDtoSchema))
  }
}
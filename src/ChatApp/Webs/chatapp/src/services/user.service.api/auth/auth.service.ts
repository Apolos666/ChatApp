import { AxiosContracts } from "@/lib/axios/AxiosContracts";
import { httpPost } from "../_req";
import { ActivateAccountDto, LoginDto, RegisterDto } from "./auth.types";
import { ActivateAccountDtoSchema, LoginDtoSchema, LoginResponseDtoSchema, RegisterDtoSchema } from "./auth.contracts";

export class AuthService {
  static loginMutation(data: { loginDto: LoginDto }) {
    const loginDto = AxiosContracts.requestContract(LoginDtoSchema, data.loginDto)

    return httpPost('/auth/login', loginDto)
          .then(AxiosContracts.responseContract(LoginResponseDtoSchema))
  }

  static registerMutation(data: { registerDto: RegisterDto }) {
    const registerDto = AxiosContracts.requestContract(RegisterDtoSchema, data.registerDto)
    return httpPost('/auth/registration', registerDto)
  }

  static activateAccountMutation(data: { activateAccountDto: ActivateAccountDto }) {
    const activateAccountDto = AxiosContracts.requestContract(ActivateAccountDtoSchema, data.activateAccountDto)
    return httpPost('/auth/activation', activateAccountDto)
  }
}
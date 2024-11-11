import { AxiosContracts } from "@/lib/axios/AxiosContracts";
import { httpPostPublic } from "../_req";
import { ActivateAccountDto, LoginDto, RegisterDto } from "./auth.types";
import { ActivateAccountDtoSchema, LoginDtoSchema, LoginResponseDtoSchema, RegisterDtoSchema } from "./auth.contracts";

export class AuthService {
  static loginMutation(data: { loginDto: LoginDto }) {
    const loginDto = AxiosContracts.requestContract(LoginDtoSchema, data.loginDto)

    return httpPostPublic('/auth/login', loginDto)
          .then(AxiosContracts.responseContract(LoginResponseDtoSchema))
  }

  static registerMutation(data: { registerDto: RegisterDto }) {
    const registerDto = AxiosContracts.requestContract(RegisterDtoSchema, data.registerDto)
    return httpPostPublic('/auth/registration', registerDto)
  }

  static activateAccountMutation(data: { activateAccountDto: ActivateAccountDto }) {
    const activateAccountDto = AxiosContracts.requestContract(ActivateAccountDtoSchema, data.activateAccountDto)
    return httpPostPublic('/auth/activation', activateAccountDto)
  }
}
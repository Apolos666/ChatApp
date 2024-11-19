import { AxiosContracts } from "@/lib/axios/AxiosContracts";
import { httpPostPrivate, httpPostPublic } from "../_req";
import { ActivateAccountDto, ChangePasswordDto, LoginDto, RegisterDto, ResetPasswordDto } from "./auth.types";
import { ActivateAccountDtoSchema, ChangePasswordDtoSchema, LoginDtoSchema, LoginResponseDtoSchema, RegisterDtoSchema, ResetPasswordDtoSchema } from "./auth.contracts";

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

  static changePasswordMutation(data: { changePasswordDto: ChangePasswordDto }) {
    const changePasswordDto = AxiosContracts.requestContract(
      ChangePasswordDtoSchema,
      data.changePasswordDto
    )
    return httpPostPrivate('/auth/password/modification', changePasswordDto)
  }

  static resetPasswordMutation(data: {resetPasswordDto: ResetPasswordDto}) {
    const resetPasswordDto = AxiosContracts.requestContract(
      ResetPasswordDtoSchema,
      data.resetPasswordDto
    )

    return httpPostPublic('/auth/reset', resetPasswordDto)
  }
}
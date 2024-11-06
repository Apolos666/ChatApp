import { AxiosHeaders, AxiosResponse } from 'axios'
import { ZodType } from 'zod'
import { AxiosValidationError } from './AxiosValidationError'

export class AxiosContracts {
  static responseContract<Data>(schema: ZodType<Data>) {
    return (response: AxiosResponse<unknown>): AxiosResponse<Data> => {
      const validationResult = schema.safeParse(response.data)

      if (validationResult.error) {
        throw new AxiosValidationError(
          response.config,
          response.request,
          response,
          validationResult.error.errors
        )
      }

      return { ...response, data: validationResult.data }
    }
  }

  static requestContract<Data>(schema: ZodType<Data>, data: unknown ) {
    const validationResult = schema.safeParse(data)

    if (validationResult.error) {
      throw new AxiosValidationError(
        { headers: new AxiosHeaders() },
        undefined,
        undefined,
        validationResult.error.errors
      )
    }

    return validationResult.data
  }
}
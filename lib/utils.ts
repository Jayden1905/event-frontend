import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const api_endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT

export async function catachErrorType<
  T,
  E extends new (message?: string) => Error,
>(
  promise: Promise<T>,
  errorsToCatach?: E[],
): Promise<[undefined, T] | [InstanceType<E>]> {
  return promise
    .then((data) => {
      return [undefined, data] as [undefined, T]
    })
    .catch((error) => {
      if (errorsToCatach === undefined) {
        return [error]
      }

      if (errorsToCatach.some((err) => error instanceof err)) {
        return [error]
      }

      throw error
    })
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

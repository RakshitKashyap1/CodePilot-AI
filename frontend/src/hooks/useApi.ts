import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions, type QueryKey } from "@tanstack/react-query"
import { extractApiError } from "@/utils/error"

export function useApiQuery<T>(
  key: QueryKey,
  fn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">,
) {
  return useQuery<T>({ queryKey: key, queryFn: fn, ...options })
}

export function useApiMutation<TData, TVariables = void>(
  fn: (variables: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, "mutationFn">,
) {
  return useMutation<TData, Error, TVariables>({
    mutationFn: fn,
    onError: (err) => {
      const msg = extractApiError(err, "Operation failed")
      console.error(msg)
    },
    ...options,
  })
}

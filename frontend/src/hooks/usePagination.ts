import { useState, useCallback, useMemo } from "react"

interface UsePaginationOptions {
  totalItems: number
  pageSize?: number
  initialPage?: number
}

export function usePagination({ totalItems, pageSize = 10, initialPage = 1 }: UsePaginationOptions) {
  const [page, setPage] = useState(initialPage)
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  const clampedPage = Math.min(page, totalPages)
  const safePage = clampedPage < 1 ? 1 : clampedPage

  const nextPage = useCallback(() => {
    setPage((p) => Math.min(p + 1, totalPages))
  }, [totalPages])

  const prevPage = useCallback(() => {
    setPage((p) => Math.max(p - 1, 1))
  }, [])

  const goToPage = useCallback((p: number) => {
    setPage(Math.max(1, Math.min(p, totalPages)))
  }, [totalPages])

  const startIndex = (safePage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)

  return useMemo(() => ({
    page: safePage,
    totalPages,
    pageSize,
    startIndex,
    endIndex,
    totalItems,
    hasNext: safePage < totalPages,
    hasPrev: safePage > 1,
    nextPage,
    prevPage,
    goToPage,
  }), [safePage, totalPages, pageSize, startIndex, endIndex, totalItems, nextPage, prevPage, goToPage])
}

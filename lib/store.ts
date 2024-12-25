import { atom } from 'jotai'

export const paginationAtom = atom({
  pageIndex: 0,
  pageSize: 10,
})

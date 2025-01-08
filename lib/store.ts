import { atom } from 'jotai'

export const paginationAtom = atom({
  pageIndex: 0,
  pageSize: 10,
})

export const visibleAtom = atom<boolean>(false)

export const selectedImageAtom = atom<string>('')

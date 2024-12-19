import { atomWithStorage } from 'jotai/utils'

export const currentEventIDAtom = atomWithStorage('eventID', 0)

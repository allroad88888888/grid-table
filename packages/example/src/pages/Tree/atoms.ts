import { atom, createGetFamilyAtomById } from '@einfach/react'
import mock from './mock'
// import { createNeverResolvingPromise } from './promise'
import { createBatchCache, deepEqual } from '../../utils/cacheIds'

async function getInfoById(id: string[]) {
  return Object.fromEntries(
    id.map((id) => {
      return [
        id,
        {
          id,
          name: `${id}_name`,
        },
      ]
    }),
  )
}

const batchGetInfoById = createBatchCache(getInfoById, deepEqual, 50)

export const relationAsyncAtom = atom(async (getter) => {
  return mock.relation
})

const empty = {}

export const getInfoAtomById = createGetFamilyAtomById({
  createAtom: (id) => {
    const entityAtom = atom(() => {
      return batchGetInfoById(id, empty)
    })
    entityAtom.debugLabel = `getInfoAtomById-${id}`
    return entityAtom
  },
})

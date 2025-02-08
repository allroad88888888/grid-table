import { type Atom, type AtomEntity, type AtomState } from '@einfach/state'
import { atom } from '@einfach/state'

export type Id = string | number | boolean | undefined | symbol

type IdObj = {
  id: Id
}

function createIdObj(id: Id): IdObj {
  const idObj = Object.create(null)
  idObj.id = id
  return idObj
}

const cacheIdObj = new Map<Id, IdObj>()

export function createAtomFamily<AtomType extends Atom<unknown>, Key extends Id = string>(params: {
  debuggerKey: string
  defaultValue?: AtomState<AtomType>
  createAtom: (key: Key, initState?: AtomState<AtomType>) => AtomType
}): (key: Key) => AtomType

export function createAtomFamily<State, Key extends Id = string>(params: {
  debuggerKey: string
  defaultValue?: State
  createAtom?: (id: Key, initState?: State) => AtomEntity<State>
}) {
  const cache = new WeakMap<IdObj, Atom<any>>()

  function getAtomById(id: Key, initState?: State) {
    if (!cacheIdObj.has(id)) {
      cacheIdObj.set(id, createIdObj(id))
    }

    const keyObj = cacheIdObj.get(id)!
    if (!cache.get(keyObj)) {
      let newAtom: AtomEntity<State>
      if ('defaultValue' in params) {
        newAtom = atom(params.defaultValue) as AtomEntity<State>
      } else {
        newAtom = params.createAtom!(id, initState)
      }
      if (process.env.NODE_ENV !== 'production') {
        const { debuggerKey } = params
        newAtom.debugLabel = `${debuggerKey}||${keyObj.id?.toString()}||${newAtom.debugLabel}`
      }
      cache.set(keyObj, newAtom)
    }
    return cache.get(keyObj)!
  }

  return getAtomById
}

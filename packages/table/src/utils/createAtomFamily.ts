import type { Atom, AtomState, AtomEntity } from '@einfach/react'
import { atom } from '@einfach/react'

type IdObj = {
  id: string
}

const cacheObjMap = new Map<string, IdObj>()
function createObjByString(id: string): IdObj {
  if (!cacheObjMap.has(id)) {
    cacheObjMap.set(id, {
      id,
    })
  }
  return cacheObjMap.get(id)!
}

export function createAtomFamily<State>({
  debuggerKey,
  defaultValue,
}: {
  debuggerKey: string
  defaultValue?: State
}): (key: string) => AtomEntity<State>

export function createAtomFamily<AtomType extends Atom<any>>({
  debuggerKey,
  createAtom,
}: {
  debuggerKey: string
  createAtom?: (key: string, initState?: AtomState<AtomType>) => AtomType
}): (key: string, initState?: AtomState<AtomType>) => AtomType
export function createAtomFamily<AtomType extends Atom<any>>({
  debuggerKey,
  defaultValue,
  createAtom,
}: {
  debuggerKey: string
  createAtom?: (key: string, initState?: AtomState<AtomType>) => AtomType
  defaultValue?: AtomState<AtomType>
}) {
  const cache = new WeakMap<IdObj, Atom<any>>()

  return (key: string, initState?: AtomState<AtomType>) => {
    const idObj = createObjByString(key)

    if (!cache.has(idObj)) {
      function create() {
        if (createAtom) {
          const newAtom = createAtom(key, initState)
          newAtom.debugLabel = `${debuggerKey}||${key}||${newAtom.debugLabel}`
          return newAtom
        }

        const newAtom = atom(defaultValue)
        newAtom.debugLabel = `${debuggerKey}||${key}||${newAtom.debugLabel}`
        return newAtom
      }
      cache.set(idObj, create())
    }
    return cache.get(idObj)!
  }
}

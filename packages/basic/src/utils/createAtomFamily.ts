import type { AtomEntity, Atom, AtomState } from '@einfach/state'
import { atom } from '@einfach/state'

type IdObj = {
  id: string
}

function createIdObj(id: string): IdObj {
  const idObj = Object.create(null)
  idObj.id = id
  return idObj
}

export interface CreateAtomFamilyOptions<Key, State> {
  debuggerKey: string
  createAtom?: <T extends AtomEntity<unknown>>(key: Key, initState?: AtomState<T>) => T
  defaultValue?: State
}

export interface AtomFamilyAtom<State> extends AtomEntity<State> {
  delete: () => void
}
export interface GetAtomById<Key, State> {
  <CurState extends State = State>(key: Key, initState?: State): AtomEntity<CurState>
  <AtomType extends Atom<unknown>>(key: Key, initState?: AtomState<AtomType>): AtomType
  remove: (key: Key) => void
  clear: () => void
  get: GetAtomById<Key, State>
  has: (key: Key) => boolean
}

export function createAtomFamilyEntity() {
  const cacheIdObjMap = new Map<string, IdObj>()
  function getIdObj(key: string) {
    if (!cacheIdObjMap.has(key)) {
      cacheIdObjMap.set(key, createIdObj(key))
    }
    return cacheIdObjMap.get(key)!
  }
  const types = new Set(['number', 'string', 'boolean', 'undefined'])

  function getWeakKey(key: string): IdObj
  function getWeakKey(key: number): IdObj
  function getWeakKey(key: boolean): IdObj
  function getWeakKey(key: undefined): IdObj
  function getWeakKey(key: symbol): symbol
  function getWeakKey<T extends object>(key: T): T
  function getWeakKey(key: any) {
    if (types.has(typeof key)) {
      return getIdObj(key as string)
    }
    return key
  }

  function createAtomFamily<AtomType extends Atom<unknown>, Key = string>(param: {
    debuggerKey: string
    createAtom: (key: Key, initState?: AtomState<AtomType>) => AtomType
  }): {
    (key: Key, initState?: AtomState<AtomType>): AtomType
    remove: (key: Key) => void
    clear: () => void
    get: GetAtomById<Key, AtomState<AtomType>>
    has: (key: Key) => boolean
  }

  function createAtomFamily<State, Key = string>(
    param: CreateAtomFamilyOptions<Key, State>,
  ): GetAtomById<Key, State>
  function createAtomFamily<State, Key = string>({
    debuggerKey,
    createAtom,
    defaultValue,
  }: CreateAtomFamilyOptions<Key, State>) {
    let cacheAtomWeakMap = new WeakMap<WeakKey, AtomEntity<State>>()

    function getAtomById<CurState extends State = State>(key: Key, initState?: CurState) {
      const cacheKey = getWeakKey(key as string)

      if (!cacheAtomWeakMap.has(cacheKey as WeakKey)) {
        let newAtom
        if (createAtom) {
          if (arguments.length === 1) {
            newAtom = createAtom(key)
          } else {
            newAtom = createAtom(key, initState)
          }
        } else {
          newAtom = atom(initState || defaultValue) as AtomEntity<State>
        }
        cacheAtomWeakMap.set(cacheKey as WeakKey, newAtom as AtomEntity<State>)
        if (process.env.NODE_ENV !== 'production') {
          newAtom.debugLabel = `${debuggerKey}||${cacheKey.id?.toString()}||${newAtom.debugLabel}`
        }
      }
      return cacheAtomWeakMap.get(cacheKey as WeakKey)! as AtomEntity<CurState>
    }
    getAtomById.remove = (key: Key) => {
      const cacheKey = getWeakKey(key as string)
      cacheAtomWeakMap.delete(cacheKey)
    }
    getAtomById.clear = () => {
      cacheAtomWeakMap = new WeakMap()
    }
    getAtomById.has = (key: Key) => {
      const cacheKey = getWeakKey(key as string)
      return cacheAtomWeakMap.has(cacheKey)
    }

    getAtomById.get = getAtomById
    getAtomById.cacheAtomMap = cacheAtomWeakMap
    return getAtomById as GetAtomById<Key, State>
  }
  return {
    createAtomFamily,
    clear: () => {
      cacheIdObjMap.clear()
    },
  }
}

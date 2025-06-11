import { atom, selectAtom, createStore, useAtomValue } from '@einfach/react'
import { Suspense } from 'react'

interface Pagination {
  pageSize: number
  currentPage: number
  total: number
}

const paginationAtom = atom(
  {
    pageSize: 20,
    currentPage: 1,
    total: 0,
  },
  (getter, setter, nextPagination: Pagination) => {
    getter(paginationAtom)
    const { total, pageSize, currentPage } = nextPagination
    const maxPage = Math.ceil(total / pageSize) || 1
    const fixPage = currentPage < 1 ? 1 : currentPage > maxPage ? maxPage : currentPage
    setter(paginationAtom, {
      ...nextPagination,
      currentPage: fixPage,
    })
  },
)
const queryAtom = selectAtom(
  paginationAtom,
  (current) => {
    return {
      pageSize: current.pageSize,
      currentPage: current.currentPage,
    }
  },
  (prev, next) => {
    return prev.pageSize === next.pageSize && prev.currentPage === next.currentPage
  },
)

const promiseATom = atom(async (getter, { setter }) => {
  getter(queryAtom)

  await new Promise((rev) => {
    setTimeout(() => {
      rev(true)
    }, 1000 * 3)
  })
  setter(paginationAtom, {
    pageSize: 20,
    currentPage: 1,
    total: 63,
  })
  return Promise.resolve(100)
})
const store = createStore()
store.sub(promiseATom, () => {
  store.getter(promiseATom)
})

function Demo() {
  const val = useAtomValue(promiseATom, { store })

  return <div>{JSON.stringify(val)}</div>
}

export default () => {
  return (
    <Suspense fallback={<div> loading </div>}>
      <Demo />
    </Suspense>
  )
}

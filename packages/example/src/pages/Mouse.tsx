const DataList = new Array(100).fill(0)

function Item({ index }: { index: number }) {
  return (
    <div
      style={{
        height: '30px',
        border: '1px solid red',
        flexShrink: 0,
      }}
      onMouseEnter={() => {
        requestAnimationFrame(() => {
          console.log(`index:${index}`)
        })
      }}
    ></div>
  )
}

export function MousePage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100px',
        height: '500px',
        overflow: 'auto',
      }}
    >
      {DataList.map((xx, index) => {
        return <Item key={index} index={index} />
      })}
    </div>
  )
}

export default MousePage

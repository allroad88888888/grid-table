import { useLayoutEffect } from 'react'

function DemoCopy() {
  useLayoutEffect(() => {
    const $div = document.createElement('textarea')

    $div.value = 'sth'

    document.body.appendChild($div)
    $div.oncopy = () => {
      console.log(' 触发复制 方法')
    }
    $div.select()
    // try {
    //   const successful = document.execCommand('copy')
    //   const msg = successful ? '成功' : '失败'
    //   console.log('复制文本命令：' + msg)
    // } catch (err) {
    //   console.error('复制失败', err)
    // }
  }, [])

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: '30px 30px 30px',
        gridTemplateColumns: '50px 50px 50px',
        border: '1px solid gray',
      }}
    >
      <div
        style={{
          gridRowStart: 1,
          gridRowEnd: 2000,
          gridColumnStart: 1,
          gridColumnEnd: 2000,
          border: '1px solid red',
        }}
      >
        1
      </div>
      <div
        style={{
          gridRowStart: 2,
          gridColumnStart: 1,
          // gridRowEnd: 2,
          width: 300,
          height: 300,
          border: '1px solid blue',
        }}
      >
        <div>2</div>
      </div>
    </div>
  )
}

export default DemoCopy

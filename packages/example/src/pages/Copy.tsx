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
    <div>
      <div>1</div>
      <div>
        <div>2</div>
      </div>
    </div>
  )
}

export default DemoCopy

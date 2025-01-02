import { Form, FormItem, useForm } from 'einfach-form'

import { getOptionAtomById } from '@deepfos/ux-state'
import { useAtom } from 'jotai'
import { useCallback, useContext } from 'react'
import type { Options } from './type'

function TextArea({ value = '', onChange }: { value?: string; onChange?: (val: string) => void }) {
  const handChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange && onChange(e.target.value)
  }, [])
  return <textarea value={value} onChange={handChange} />
}

export default function Options({ id, scope, ...props }: { id: string; scope: string }) {
  const [options, setOptions] = useAtom(getOptionAtomById(id), scope)

  const onValuesChange = useCallback((val: any, values: any) => {
    setOptions(values)
  }, [])

  const formInstance = useForm({
    initialValues: options,
    onValuesChange,
  })
  return (
    <>
      <Form formInstance={formInstance}>
        <>
          <FormItem name="config.json" label="数据">
            <TextArea />
          </FormItem>
          <FormItem name="config.theme" label="样式">
            <TextArea />
          </FormItem>
        </>
      </Form>
    </>
  )
}

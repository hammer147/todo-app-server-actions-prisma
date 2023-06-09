'use client'

import { useRef } from 'react'
import { createTodoAction } from '../_actions'

export default function NewTodoForm() {
  const formRef = useRef<HTMLFormElement>(null)

  async function action(data: FormData) {
    const title = data.get('title')
    if (!title || typeof title !== 'string') return
    // call server action
    await createTodoAction(title)
    // reset form
    formRef.current?.reset()
  }

  return (
    <form ref={formRef} action={action}>
      <h2 className='mb-2 font-medium'>Create a new Todo</h2>
      <input type='text' name='title' className='rounded border border-slate-400 px-2 py-0.5 text-slate-900'/>
      <button
        type='submit'
        className='ml-2 rounded bg-slate-700 px-2 py-1 text-sm text-white disabled:bg-opacity-50'>
        Add Todo
      </button>
    </form>
  )
}

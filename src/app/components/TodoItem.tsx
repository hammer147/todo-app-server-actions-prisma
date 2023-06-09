'use client'

import { Todo } from '@prisma/client'
import { useTransition } from 'react'
import { updateTodoAction } from '../_actions'

type Props = {
  todo: Todo
}

export default function TodoItem({ todo }: Props) {
  const [isPending, startTransition] = useTransition()

  return (
    <li className='flex items-center gap-3'>
      <input
        type='checkbox'
        id={todo.id}
        defaultChecked={todo.isCompleted}
        onChange={e => startTransition(() => updateTodoAction(todo.id, e.target.checked))}
        className='peer h-4 w-4 cursor-pointer rounded border-gray-300 text-slate-600 focus:ring-slate-600'
      />
      <label
        htmlFor={todo.id}
        className='cursor-pointer peer-checked:text-slate-500 peer-checked:line-through'>
        {todo.title}
      </label>
      <span className='ml-auto text-sm text-slate-500 peer-checked:line-through'>
        {todo.updatedAt.toUTCString()}
      </span>
    </li>
  )
}

import { Todo } from '@prisma/client'

type Props = {
  todo: Todo
}

export default function TodoItem({ todo }: Props) {
  return <li>{todo.title}</li>
}

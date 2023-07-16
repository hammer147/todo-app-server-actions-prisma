# Todo app with Server Actions, Prisma and MongoDB

## Prisma

### Installation

```bash
npm i prisma -D
npx prisma
npm i @prisma/client
npx prisma init
```

### Environment variables

- add .env to .gitignore
- change DATABASE_URL in .env

```bash
DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority"
```

### Schema

In /prisma/schema.prisma, change the provider to mongodb

If you have an existing database, you can run `npx prisma pull` to generate the schema from the database.
We just added a Todo model to the schema manually.

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model Todo {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  isCompleted Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Export Prisma Client

Create /lib/prisma.ts

```ts
import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV === 'development') global.prisma = prisma

export default prisma
```

### Add some records

A quick way to add some records is to use the Prisma Studio

```bash
npx prisma studio
```

This can also be done with a script, see [seeding your database](https://www.prisma.io/docs/guides/migrate/seed-database#how-to-seed-your-database-in-prisma)

### Define CRUD operations

Create /lib/todos.ts

```ts
import prisma from './prisma'

export async function getTodos() {
  try {
    const todos = await prisma.todo.findMany()
    return { todos }
  } catch (error) {
    return { error }
  }
}

export async function createTodo(title: string) {
  try {
    const todo = await prisma.todo.create({ data: { title } })
    return { todo }
  } catch (error) {
    return { error }
  }
}

export async function getTodoById(id: string) {
  try {
    const todo = await prisma.todo.findUnique({ where: { id } })
    return { todo }
  } catch (error) {
    return { error }
  }
}

export async function updateTodo(id: string, isCompleted: boolean) {
  try {
    const todo = await prisma.todo.update({
      where: { id },
      data: { isCompleted }
    })
    return { todo }
  } catch (error) {
    return { error }
  }
}
```

## Server Actions

Create /app/_actions.ts

```ts
'use server'

import { createTodo, updateTodo } from '@/lib/todos'
import { revalidatePath } from 'next/cache'

export async function createTodoAction(title: string) {
  await createTodo(title)
  revalidatePath('/')
}

export async function updateTodoAction(id: string, isCompleted: boolean) {
  await updateTodo(id, isCompleted)
  revalidatePath('/')
}
```

Call the actions from the components

```ts
// app/components/NewTodoForm.tsx

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
      <input type='text' name='title' className='rounded border border-slate-400 px-2 py-0.5' />
      <button
        type='submit'
        className='ml-2 rounded bg-slate-700 px-2 py-1 text-sm text-white disabled:bg-opacity-50'>
        Add Todo
      </button>
    </form>
  )
}
```

'use client'

import { type Editor } from '@tiptap/react'
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading1,
  HeadingIcon,
  Heading3,
  Underline,
  AlignLeft,
  AlignRight,
  AlignCenter,
  ImageIcon,
  Link,
} from 'lucide-react'
import { Toggle } from '@/components/ui/toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAtom } from 'jotai'
import { visibleAtom } from '@/lib/store'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

type Props = {
  editor: Editor | null
}

export function ToolBar({ editor }: Props) {
  const [, setVisible] = useAtom(visibleAtom)
  const [open, setOpen] = useState<boolean>(false)
  const [url, setUrl] = useState<string>('')

  if (!editor) return null

  return (
    <div className='mb-4 flex gap-2 p-2 items-center border border-input bg-transparent rounded-md'>
      <DropdownMenu>
        <DropdownMenuTrigger className='outline-none'>
          <HeadingIcon className='h-4 w-4' />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <div className='flex flex-col p-2'>
            <Toggle
              size={'sm'}
              pressed={editor.isActive('heading', { level: 1 })}
              onPressedChange={() => {
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }}
            >
              <Heading1 className='h-4 w-4' />
            </Toggle>
            <Toggle
              size={'sm'}
              pressed={editor.isActive('heading', { level: 2 })}
              onPressedChange={() => {
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }}
            >
              <Heading2 className='h-4 w-4' />
            </Toggle>
            <Toggle
              size={'sm'}
              pressed={editor.isActive('heading', { level: 3 })}
              onPressedChange={() => {
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }}
            >
              <Heading3 className='h-4 w-4' />
            </Toggle>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <Toggle
        size={'sm'}
        pressed={editor.isActive('bold')}
        onPressedChange={() => {
          editor.chain().focus().toggleBold().run()
        }}
      >
        <Bold className='h-5 w-5' />
      </Toggle>
      <Toggle
        size={'sm'}
        pressed={editor.isActive('italic')}
        onPressedChange={() => {
          editor.chain().focus().toggleItalic().run()
        }}
      >
        <Italic className='h-5 w-5' />
      </Toggle>
      <Toggle
        size={'lg'}
        pressed={editor.isActive('underline')}
        onPressedChange={() => {
          editor.chain().focus().toggleUnderline().run()
        }}
      >
        <Underline className='h-5 w-5' />
      </Toggle>
      <Toggle
        size={'sm'}
        pressed={editor.isActive('strike')}
        onPressedChange={() => {
          editor.chain().focus().toggleStrike().run()
        }}
      >
        <Strikethrough className='h-5 w-5' />
      </Toggle>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Link className='w-4 h-4' />
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
            <DialogDescription>
              This is the form for inserting the link.
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='url' className='text-right'>
                Url
              </Label>
              <Input
                id='url'
                className='col-span-3'
                onChange={(event) => {
                  setUrl(event.target.value)
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                editor
                  .chain()
                  .focus()
                  .setLink({ href: url, target: '_blank' })
                  .run()
                setOpen(false)
              }}
            >
              Ok
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toggle
        size={'lg'}
        pressed={editor.isActive('bulletList')}
        onPressedChange={() => {
          editor.chain().focus().toggleBulletList().run()
        }}
      >
        <List className='h-5 w-5' />
      </Toggle>
      <Toggle
        size={'lg'}
        pressed={editor.isActive('orderedList')}
        onPressedChange={() => {
          editor.chain().focus().toggleOrderedList().run()
        }}
      >
        <ListOrdered className='h-5 w-5' />
      </Toggle>
      <Toggle
        size={'lg'}
        pressed={editor.isActive('orderedList')}
        onPressedChange={() => {
          editor.chain().focus().setTextAlign('left').run()
        }}
      >
        <AlignLeft className='h-5 w-5' />
      </Toggle>
      <Toggle
        size={'lg'}
        pressed={editor.isActive('orderedList')}
        onPressedChange={() => {
          editor.chain().focus().setTextAlign('center').run()
        }}
      >
        <AlignCenter className='h-5 w-5' />
      </Toggle>
      <Toggle
        size={'lg'}
        pressed={editor.isActive('orderedList')}
        onPressedChange={() => {
          editor.chain().focus().setTextAlign('right').run()
        }}
      >
        <AlignRight className='h-5 w-5' />
      </Toggle>
      <Toggle
        size={'lg'}
        pressed={editor.isActive('orderedList')}
        onPressedChange={() => {
          setVisible(true)
        }}
      >
        <ImageIcon className='h-5 w-5' />
      </Toggle>
    </div>
  )
}

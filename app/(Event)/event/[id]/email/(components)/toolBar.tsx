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
  CodeXml,
  AlignLeft,
  AlignRight,
  AlignCenter,
} from 'lucide-react'
import { Toggle } from '@/components/ui/toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'

type Props = {
  editor: Editor | null
}

export function ToolBar({ editor }: Props) {
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
    </div>
  )
}

'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { ToolBar } from './toolBar'
import Heading from '@tiptap/extension-heading'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'

interface TiptapEditorProps {
  setContent: (content: string) => void
  description: string
}

export default function TiptapEditor({
  description,
  setContent,
}: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure(),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Underline.configure(),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'image'],
        alignments: ['left', 'center', 'right'],
      }),
    ],
    content: description,
    editorProps: {
      attributes: {
        class:
          'rounded-md prose leading-[2px] min-h-[400px] mx-auto max-w-[760px] border p-4 focus:border-black focus:outline-none',
      },
    },
    onUpdate({ editor }) {
      setContent(editor.getHTML())
    },
  })

  return (
    <div>
      <ToolBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

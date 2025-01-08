'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { ToolBar } from './toolBar'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import ImageGallery from './imageGallery'
import { Link as TiptapLink } from '@tiptap/extension-link'

interface TiptapEditorProps {
  setContent?: (content: string) => void
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
      Underline.configure(),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'image'],
        alignments: ['left', 'center', 'right'],
      }),
      Image.configure({
        inline: false,
        HTMLAttributes: {
          style: `
                  display: block; 
                  width: 100%; 
                  height: 100%; 
                  object-fit: cover; 
                  object-position: center; 
                  margin-left: auto; 
                  margin-right: auto;
                `,
        },
      }),
      TiptapLink.configure({
        openOnClick: false,
        autolink: false,
        linkOnPaste: true,
        HTMLAttributes: {
          target: '_blank',
          style: `
                  color: blue; 
                  text-decoration: underline;
                `,
          onMouseOver: "this.style.color='darkblue';",
          onMouseOut: "this.style.color='blue';",
          onMouseDown: "this.style.color='red';",
          onMouseUp: "this.style.color='darkblue';",
        },
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
      if (setContent) setContent(editor.getHTML())
    },
  })

  return (
    <div>
      <ToolBar editor={editor} />
      <EditorContent editor={editor} />
      <ImageGallery editor={editor} />
    </div>
  )
}

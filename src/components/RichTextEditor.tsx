import { useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, List, ListOrdered } from 'lucide-react'
import './RichTextStyles.css'

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  minHeight?: string
  className?: string
}

export default function RichTextEditor({
  content,
  onChange,
  minHeight = '128px',
  className = '',
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || '<p></p>',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) return null

  return (
    <>
      {/* Tiptap Editor Toolbar */}
      <div className='mb-2 flex items-center gap-1 rounded-t-lg border border-[#33333430] p-1'>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded p-1 hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
          title='Bold'
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded p-1 hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
          title='Italic'
        >
          <Italic size={18} />
        </button>
        <div className='mx-1 h-5 w-px bg-gray-300'></div>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded p-1 hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
          title='Bullet List'
        >
          <List size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded p-1 hover:bg-gray-100 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
          title='Ordered List'
        >
          <ListOrdered size={18} />
        </button>
      </div>

      {/* Tiptap Editor Content */}
      <div
        className={`overflow-y-auto rounded-b-lg border border-[#33333430] ${className}`}
      >
        <EditorContent
          editor={editor}
          className={`min-h-[${minHeight}] w-full rounded-lg p-1 text-[16px] outline-none focus:border-zinc-500`}
        />
      </div>
    </>
  )
}

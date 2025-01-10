import { EditorSidebar } from "@/src/components/editor/EditorSidebar"

export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className="flex min-h-screen">
      <EditorSidebar />
      <div className="flex-1 p-6">
          {children}
      </div>
    </div>
  )
}

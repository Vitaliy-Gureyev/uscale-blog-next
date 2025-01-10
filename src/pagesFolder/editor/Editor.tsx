import { Outlet } from "react-router-dom";
import { EditorSidebar } from "@/src/components/editor/EditorSidebar";

const Editor = () => {
  return (
    <div className="flex min-h-screen">
      <EditorSidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Editor;

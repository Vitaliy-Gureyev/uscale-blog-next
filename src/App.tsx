import { Suspense, lazy } from "react"
import { Toaster } from "@/src/components/ui/toaster"
import { Toaster as Sonner } from "@/src/components/ui/sonner"
import { TooltipProvider } from "@/src/components/ui/tooltip"
import { Routes, Route, Navigate } from "react-router-dom"
import { SidebarProvider } from "@/src/components/ui/sidebar"
import { ProtectedRoute } from "@/src/components/auth/ProtectedRoute"
import { AppLayout } from "@/src/components/layout/AppLayout"
import { LoadingScreen } from "@/src/components/layout/LoadingScreen"

// Lazy load route components
const Index = lazy(() => import("./pages/Index"))
const Post = lazy(() => import("./pages/Post"))
const Login = lazy(() => import("./pages/Login"))
const Editor = lazy(() => import("./pages/editor/Editor"))
const BlogPosts = lazy(() => import("./pages/editor/BlogPosts"))
const Categories = lazy(() => import("./pages/editor/Categories"))
const Authors = lazy(() => import("./pages/editor/Authors"))
const CreatePost = lazy(() => import("./pages/editor/CreatePost"))

const AppContent = () => {
  return (
    <TooltipProvider delayDuration={0}>
      <Toaster />
      <Sonner />
      <SidebarProvider>
        <AppLayout>
          <Routes>
            {/* Editor Routes */}
            <Route
              path="/editor"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingScreen />}>
                    <Editor />
                  </Suspense>
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="posts" replace />} />
              <Route path="posts" element={<BlogPosts />} />
              <Route path="posts/new" element={<CreatePost />} />
              <Route path="posts/:slug/edit" element={<CreatePost />} />
              <Route path="categories" element={<Categories />} />
              <Route path="authors" element={<Authors />} />
            </Route>

            {/* Public Routes */}
            <Route path="/" element={
              <Suspense fallback={<LoadingScreen />}>
                <Index />
              </Suspense>
            } />
            <Route path="/login" element={
              <Suspense fallback={<LoadingScreen />}>
                <Login />
              </Suspense>
            } />
            <Route path="/posts/:slug" element={
              <Suspense fallback={<LoadingScreen />}>
                <Post />
              </Suspense>
            } />

            {/* Redirect old routes to new editor routes */}
            <Route path="/posts/new" element={<Navigate to="/editor/posts/new" replace />} />
            <Route path="/posts" element={<Navigate to="/editor/posts" replace />} />
          </Routes>
        </AppLayout>
      </SidebarProvider>
    </TooltipProvider>
  );
};

const App = () => <AppContent />;

export default App;

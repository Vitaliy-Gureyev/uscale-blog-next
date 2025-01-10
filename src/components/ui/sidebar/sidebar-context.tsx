'use client'
import * as React from "react"
import { useIsMobile } from "@/src/hooks/use-mobile"

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarState = "expanded" | "collapsed"

interface SidebarContextValue {
  state: SidebarState
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export { 
  SidebarContext, 
  SIDEBAR_COOKIE_NAME, 
  SIDEBAR_COOKIE_MAX_AGE, 
  SIDEBAR_KEYBOARD_SHORTCUT,
  type SidebarState,
  type SidebarContextValue
}
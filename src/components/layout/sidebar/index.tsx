import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Boxes,
  DollarSign,
  Home,
  LayoutDashboard,
  Settings,
  Wallet,
} from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function Sidebar() {
  return (
    <TooltipProvider >
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
          <Link
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Home className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">CC</span>
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/app/dashboard"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="sr-only">Operações</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Operaçoes</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/app/operation"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <DollarSign className="h-5 w-5" />
                <span className="sr-only">Operações</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Operaçoes</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/app/wallet"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Wallet className="h-5 w-5" />
                <span className="sr-only">Wallet</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Carteira</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/app/category"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Boxes className="h-5 w-5" />
                <span className="sr-only">Category</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Categorias</TooltipContent>
          </Tooltip>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="app/settings"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Configuraçoes</TooltipContent>
          </Tooltip> */}
        </nav>
      </aside>
    </TooltipProvider>
  )
}
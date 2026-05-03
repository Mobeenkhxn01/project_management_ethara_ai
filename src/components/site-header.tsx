import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { SparklesIcon } from "lucide-react"

export function SiteHeader({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background/80 backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />

        <Separator
          orientation="vertical"
          className="mx-2 h-4 data-vertical:self-auto"
        />

        <h1 className="text-base font-semibold tracking-tight">{title}</h1>
        <div className="ml-auto hidden items-center gap-2 rounded-full border bg-muted px-3 py-1 text-xs text-muted-foreground md:flex">
          <SparklesIcon className="size-3.5" />
          Team Productivity
        </div>
      </div>
    </header>
  )
}
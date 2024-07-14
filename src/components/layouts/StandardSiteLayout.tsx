import { SiteHeader } from "../SiteHeader"

export interface StandardSiteLayoutProps {
  children: React.ReactNode
}

export function StandardSiteLayout({ children }: StandardSiteLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background ">
      <SiteHeader />
      {children}
    </div>
  )
}

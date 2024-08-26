import * as React from "react"
import NextLink, { LinkProps as NextLinkProps } from "next/link"

import { useLocalePath } from "@/hooks/useLocalePath"

type FinalNextLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof NextLinkProps
> &
  NextLinkProps

export interface LinkProps extends FinalNextLinkProps {
  disableLocale?: boolean
  className?: string
}

export function Link(props: React.PropsWithChildren<LinkProps>) {
  const { localePath } = useLocalePath()
  const href = props.disableLocale ? props.href : localePath(props.href)
  return (
    <NextLink {...props} href={href}>
      {props.children}
    </NextLink>
  )
}

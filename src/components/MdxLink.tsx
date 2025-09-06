import Link from "next/link";
type AProps = React.ComponentProps<"a">;
export default function MdxLink({ href = "#", children, ...rest }: AProps) {
  return href.startsWith("/")
    ? <Link href={href} {...rest}>{children}</Link>
    : <a href={href} {...rest} rel={rest.rel ?? "noreferrer"}>{children}</a>;
}

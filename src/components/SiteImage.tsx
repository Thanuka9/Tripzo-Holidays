import Image, { type ImageProps } from "next/image";

/** Local files stay optimized; Blob/HTTPS uploads skip the optimizer. */
export function SiteImage(props: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  const remote = /^https?:\/\//i.test(src);
  return <Image {...props} unoptimized={remote || props.unoptimized} />;
}

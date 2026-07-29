import type { CSSProperties, ElementType, ReactNode } from "react";

/** A blueprint object: square corners, 1px hairline frame, and the four
 *  registration crosses that mark every card in the Industry system. */
export function Blueprint({
  as: Tag = "div",
  className = "",
  style,
  children,
  ...rest
}: {
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  [key: string]: unknown;
}) {
  return (
    <Tag className={`blueprint ${className}`.trim()} style={style} {...rest}>
      <i className="corner tl" />
      <i className="corner tr" />
      <i className="corner bl" />
      <i className="corner br" />
      {children}
    </Tag>
  );
}

/** Numbered section header — «01 · Abonnement» over a 1px rule. */
export function SectionKicker({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <>
      <span className="kicker" id={id}>
        {children}
      </span>
      <hr className="kicker-rule" />
    </>
  );
}

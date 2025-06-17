import { cn } from '@/libs/utils';

export function TypographyP({
  children,
  props = {},
}: {
  children?: React.ReactNode;
  props?: React.HTMLProps<HTMLParagraphElement>;
}) {
  return (
    <p className={cn('leading-7 [&:not(:first-child)]:mt-6', props.className)} {...props}>
      {children}
    </p>
  );
}

export function TypographyH4({
  children,
  props = {},
}: {
  children?: React.ReactNode;
  props?: React.HTMLProps<HTMLHeadingElement>;
}) {
  return (
    <h4 className={cn('scroll-m-20 text-xl font-semibold tracking-tight', props.className)} {...props}>
      {children}
    </h4>
  );
}

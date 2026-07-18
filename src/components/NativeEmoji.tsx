import type { HTMLAttributes } from 'react';

type NativeEmojiProps = {
  symbol: string;
  label?: string;
  className?: string;
} & HTMLAttributes<HTMLSpanElement>;

export function NativeEmoji({
  symbol,
  label,
  className = '',
  style,
  ...rest
}: NativeEmojiProps) {
  return (
    <span
      role={label ? 'img' : 'presentation'}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`inline-flex items-center justify-center leading-none select-none ${className}`.trim()}
      style={{
        fontFamily: '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif',
        ...style,
      }}
      {...rest}
    >
      {symbol}
    </span>
  );
}

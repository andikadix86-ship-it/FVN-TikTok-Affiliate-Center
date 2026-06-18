"use client";

import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

type OAuthButtonProps = {
  href: string;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
  badge?: string;
};

export function OAuthButton({ href, label, icon: Icon, disabled, badge }: OAuthButtonProps) {
  const content = (
    <>
      <Icon className="h-4 w-4" />
      <span className="min-w-0 truncate">{label}</span>
      {badge ? <span className="ml-auto rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-black text-violet-700">{badge}</span> : null}
    </>
  );

  if (disabled) {
    return (
      <button
        type="button"
        disabled
        className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-violet-100 bg-slate-50 px-3 text-sm font-black text-slate-400"
      >
        {content}
      </button>
    );
  }

  return (
    <a
      href={href}
      className={clsx(
        "flex h-11 w-full items-center justify-center gap-2 rounded-2xl border px-3 text-sm font-black transition",
        "border-violet-100 bg-white text-ink shadow-soft hover:border-violet-300 hover:bg-violet-50"
      )}
    >
      {content}
    </a>
  );
}

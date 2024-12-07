import { cn } from "@/libs/cn";
import type { ParentProps } from "solid-js";

export interface PaneHeaderProps extends ParentProps {
  title: string;
  class?: string;
}
export function PaneHeader(props: PaneHeaderProps) {
  return (
    <div
      class={cn(
        "sticky top-0 left-0 bg-slate-2/50 backdrop-blur mb-5 p-3 px-5 z-1",
        props.class,
      )}
    >
      <div class="text-xs leading-relaxed tracking-widest font-medium uppercase">
        {props.title}
      </div>
    </div>
  );
}

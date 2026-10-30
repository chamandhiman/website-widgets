"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipArrow = TooltipPrimitive.Arrow;

interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  showArrow?: boolean;
}

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  TooltipContentProps
>(({ className, sideOffset = 8, showArrow = false, children, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white shadow-xl border border-zinc-800 animate-in fade-in-0 duration-150 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[side=right]:slide-in-from-left-1 data-[side=left]:slide-in-from-right-1 data-[side=top]:slide-in-from-bottom-1 data-[side=bottom]:slide-in-from-top-1 origin-(--radix-tooltip-content-transform-origin)",
        showArrow ? "overflow-visible" : "overflow-hidden",
        className,
      )}
      {...props}
    >
      {children}
      {showArrow && (
        <TooltipPrimitive.Arrow className="fill-zinc-900" width={8} height={4} />
      )}
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipArrow,
  type TooltipContentProps,
};

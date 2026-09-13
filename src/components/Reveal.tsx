"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function Reveal({
  children,
  delay = 0,
  immediate = false,
  className,
}: {
  children: ReactNode;
  delay?: number;
  /** Animate on mount instead of on scroll into view — use for above-the-fold content. */
  immediate?: boolean;
  className?: string;
}) {
  const viewProps = immediate
    ? { animate: "visible" as const }
    : {
        whileInView: "visible" as const,
        viewport: { once: true, margin: "-80px" },
      };

  return (
    <motion.div
      className={className}
      initial="hidden"
      variants={variants}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      {...viewProps}
    >
      {children}
    </motion.div>
  );
}

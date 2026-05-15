"use client"

import { useEffect, useRef, useState } from "react"

interface AnimatedNumberProps {
  end: number
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
  className?: string
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

export function AnimatedNumber({
  end,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 2000,
  className,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Honor prefers-reduced-motion — jump to the final value, skip the count-up.
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reducedMotion) {
      setValue(end)
      hasAnimated.current = true
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          observer.disconnect()

          const start = performance.now()
          function tick(now: number) {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = easeOutExpo(progress)
            setValue(eased * end)
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  const display = decimals > 0
    ? value.toFixed(decimals)
    : Math.round(value).toLocaleString("en-US")

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  )
}

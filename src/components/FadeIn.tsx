'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  as?: React.ElementType;
}

export default function FadeIn({
  children,
  className,
  direction = 'up',
  delay = 0,
  duration = 700,
  threshold = 0.15,
  once = true,
  as: Tag = 'div',
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const translateMap: Record<Direction, string> = {
    up: 'translateY(2rem)',
    down: 'translateY(-2rem)',
    left: 'translateX(2rem)',
    right: 'translateX(-2rem)',
    none: 'none',
  };

  return (
    <Tag
      ref={ref}
      className={cn('will-change-[opacity,transform]', className)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : translateMap[direction],
        transition: `opacity ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  direction?: Direction;
  duration?: number;
  threshold?: number;
  as?: React.ElementType;
}

export function StaggerChildren({
  children,
  className,
  stagger = 100,
  direction = 'up',
  duration = 600,
  threshold = 0.1,
  as: Tag = 'div',
}: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const translateMap: Record<Direction, string> = {
    up: 'translateY(1.5rem)',
    down: 'translateY(-1.5rem)',
    left: 'translateX(1.5rem)',
    right: 'translateX(-1.5rem)',
    none: 'none',
  };

  return (
    <Tag ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div
              key={i}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'none' : translateMap[direction],
                transition: `opacity ${duration}ms cubic-bezier(0.16,1,0.3,1) ${i * stagger}ms, transform ${duration}ms cubic-bezier(0.16,1,0.3,1) ${i * stagger}ms`,
              }}
              className="will-change-[opacity,transform]"
            >
              {child}
            </div>
          ))
        : children}
    </Tag>
  );
}

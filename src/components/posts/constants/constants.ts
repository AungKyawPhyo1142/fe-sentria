export const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}
export const modalVariants = {
  hidden: { opacity: 0, scale: 0.8, y: -50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 200,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    y: 40,
    transition: {
      duration: 0.2,
      ease: 'easeInOut' as const,
    },
  },
}

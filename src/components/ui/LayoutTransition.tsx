import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

interface LayoutTransitionProps {
  children: React.ReactNode;
  routeKey: string;
}

const pageVariants = {
  initial: { opacity: 0, y: 20, filter: 'blur(4px)' },
  enter: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -20, filter: 'blur(4px)' },
};

const pageTransition = {
  type: 'tween' as const,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  duration: 0.45,
};

export default function LayoutTransition({ children, routeKey }: LayoutTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routeKey}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        transition={pageTransition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

import { motion } from "motion/react";

export function Logo() {
  return (
    <motion.div
      className="relative"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Rounded square background */}
        <motion.rect
          x="30"
          y="30"
          width="140"
          height="140"
          rx="20"
          fill="#DC2626"
          initial={{ scale: 0, rotate: 45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "backOut" }}
        />
        
        {/* Brick pattern - row 1 */}
        <motion.rect
          x="55"
          y="70"
          width="40"
          height="15"
          fill="white"
          initial={{ x: 0, opacity: 0 }}
          animate={{ x: 55, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        />
        <motion.rect
          x="105"
          y="70"
          width="40"
          height="15"
          fill="white"
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 105, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        />
        
        {/* Brick pattern - row 2 */}
        <motion.rect
          x="55"
          y="92"
          width="25"
          height="15"
          fill="white"
          initial={{ x: 0, opacity: 0 }}
          animate={{ x: 55, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        />
        <motion.rect
          x="87"
          y="92"
          width="25"
          height="15"
          fill="white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        />
        <motion.rect
          x="120"
          y="92"
          width="25"
          height="15"
          fill="white"
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 120, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        />
        
        {/* Brick pattern - row 3 */}
        <motion.rect
          x="55"
          y="114"
          width="40"
          height="15"
          fill="white"
          initial={{ x: 0, opacity: 0 }}
          animate={{ x: 55, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        />
        <motion.rect
          x="105"
          y="114"
          width="40"
          height="15"
          fill="white"
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 105, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        />
      </svg>
    </motion.div>
  );
}
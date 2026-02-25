import { motion } from "motion/react"

export default function Button(
    { children, onClick, disabled, className }: { children: string; onClick?: () => any; disabled?: boolean; className: string }
) {
    return (
        <>
            <motion.button
                className={className}
                initial={{ scale: 1 }}
                whileTap={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                onClick={onClick}
                disabled={disabled}
            >
                {children}
            </motion.button>
        </>
    )
}

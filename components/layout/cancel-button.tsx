import React from 'react'
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation'
import { motion } from "framer-motion";

export default function CancelButton() {
    const router = useRouter();

  return (
      <motion.div whileHover={{ scale: 1.04  }} whileTap={{ scale: 0.96 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
        <Button type='button' variant="secondary" onClick={ () => router.back() }>
            Cancel
        </Button>
      </motion.div>
  )
}
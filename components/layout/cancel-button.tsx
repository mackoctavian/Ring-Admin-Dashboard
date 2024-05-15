'use client'

import React from 'react'
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation'

export default function CancelButton() {
    const router = useRouter();

  return (
    <Button type='button' variant="secondary" onClick={ () => router.back() }>
        Cancel
    </Button>
  )
}
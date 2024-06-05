import React from 'react'
import { ReloadIcon } from "@radix-ui/react-icons"

function LoadingWidget() {
  return (
        <div className="flex items-center justify-center w-full h-full">
            <div className="flex justify-center items-center space-x-1 text-sm text-gray-700">
                <ReloadIcon className="mr-2 h-6 w-6 animate-spin" />
                <div>Loading ...</div>
            </div>
        </div>
  )
}

export default LoadingWidget
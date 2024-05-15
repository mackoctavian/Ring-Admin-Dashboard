'use client';

import CountUp from 'react-countup';

const AnimatedCounter = ({ value, type }: { value: number, type?: string }) => {
  return (
    <div className="w-full">
      <CountUp
        className='text-green-main'
        duration={0.75}
        decimals={type === "money" ? 2 : 0}
        decimal="."
        prefix={type === "money" ? "Tsh " : ""}
        end={value} 
      />
    </div>
  )
}

export default AnimatedCounter;
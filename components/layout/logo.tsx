'use client'

import {siteConfig} from "@/config/site";
import Image from "next/image";
import {useTheme} from "next-themes";

interface LogoProps {
    inverse?: boolean
}

const Logo = ({inverse}: LogoProps) => {
    const {theme} = useTheme()

    return (
        <Image
            src={inverse ? siteConfig.logoLight : (theme === 'dark' ? siteConfig.logoLight : siteConfig.logo)}
            width={961}
            height={396}
            alt={siteConfig.name}
            style={{width: '100%', height: 'auto'}}
        />
    );
}

export default Logo;
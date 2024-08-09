'use client'

import React, { useState, useEffect } from 'react';
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { useTheme } from "next-themes";

interface LogoProps {
    inverse?: boolean
}

const Logo = ({ inverse }: LogoProps) => {
    const { theme, systemTheme } = useTheme()
    const [logoSrc, setLogoSrc] = useState(siteConfig.logo)

    useEffect(() => {
        const currentTheme = theme === 'system' ? systemTheme : theme;
        setLogoSrc(inverse ? siteConfig.logoLight : (currentTheme === 'dark' ? siteConfig.logoLight : siteConfig.logo))
    }, [theme, systemTheme, inverse])

    return (
        <Image
            src={logoSrc}
            width={961}
            height={396}
            alt={siteConfig.name}
            style={{width: '100%', height: 'auto'}}
        />
    );
}

export default Logo;
import { useUser, useClerk } from "@clerk/nextjs";
import Image from 'next/image'
import React from 'react'
import { FooterProps } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const Footer = ({ type = 'desktop' }: FooterProps) => {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  if (isSignedIn) {
    return (
      <footer className="footer">
        <div className={type === 'mobile' ? 'footer_name-mobile' : 'footer_name'}>
          <Avatar className="h-8 w-8">
              <AvatarImage
                src={user.imageUrl}
                alt={user.firstName!}
              />
              <AvatarFallback>{user.fullName}</AvatarFallback>
          </Avatar>
        </div>

        <div className={type === 'mobile' ? 'footer_email-mobile' : 'footer_email'}>
            <h1 className="text-14 truncate text-gray-700 font-semibold">
              {user.fullName!}
            </h1>
            <p className="text-14 truncate font-normal text-gray-600">
            {user.primaryEmailAddress?.emailAddress}
            </p>
        </div>

        <div className="footer_image" onClick={() => signOut({ redirectUrl: '/sign-in' })}>
          <Image src="icons/logout.svg" fill alt="jsm" />
        </div>
      </footer>
    )
  }
}

export default Footer
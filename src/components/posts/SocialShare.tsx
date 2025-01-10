'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/src/components/ui/button";
import { Twitter, Facebook, Linkedin, Mail } from "lucide-react";
import { usePathname } from 'next/navigation'

interface SocialShareProps {
  title: string;
}

export const SocialShare = ({ title }: SocialShareProps) => {
  const [url, setUrl] = useState('')
  const pathname = usePathname()

  useEffect(() => {
    setUrl(`${window.location.origin}${pathname}`)
  }, [pathname])

  const handleShare = (platform: string) => {
    if (!url) return

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`
    };

    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex gap-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare('twitter')}
        className="rounded-full"
      >
        <Twitter className="h-4 w-4" />
        <span className="sr-only">Share on Twitter</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare('facebook')}
        className="rounded-full"
      >
        <Facebook className="h-4 w-4" />
        <span className="sr-only">Share on Facebook</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare('linkedin')}
        className="rounded-full"
      >
        <Linkedin className="h-4 w-4" />
        <span className="sr-only">Share on LinkedIn</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare('email')}
        className="rounded-full"
      >
        <Mail className="h-4 w-4" />
        <span className="sr-only">Share via Email</span>
      </Button>
    </div>
  );
};
"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ReferralLinkCardProps {
  referralCode: string;
  referralLink: string;
}

export function ReferralLinkCard({ referralCode, referralLink }: ReferralLinkCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can be unavailable (e.g. insecure context) - nothing to fall back to.
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Your referral link</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="text-sm text-muted-foreground">
          Code: <span className="font-mono font-semibold text-foreground">{referralCode}</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            readOnly
            value={referralLink}
            className="w-full min-w-0 truncate rounded-md border bg-muted px-3 py-2 text-sm"
            onFocus={(e) => e.currentTarget.select()}
          />
          <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpDialog } from '@/components/HelpDialog';
import { LifeBuoy, MessageCircle } from 'lucide-react';
export const HelpAndSupport = () => {
  const [isHelpDialogOpen, setHelpDialogOpen] = useState(false);
  return <>
      <Card className="glass-card border-0 shadow-lg animate-slide-up bg-white/50 dark:bg-black/50 backdrop-blur-xl">
        <CardHeader className="p-4 lg:p-6 pb-3">
          <CardTitle className="text-lg lg:text-xl font-semibold text-foreground">
            Precisa de ajuda?
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 p-4 lg:p-6 pt-0">
          <Button onClick={() => setHelpDialogOpen(true)} className="w-full sm:w-auto">
            <LifeBuoy className="mr-2" />
            Ajuda & Dicas
          </Button>
          <Button variant="outline" onClick={() => window.open('https://wa.me/556496028022', '_blank')} className="w-full sm:w-auto text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700 my-[24px] py-0 mx-0 px-[8px]">
            <MessageCircle className="mr-2" />
            Suporte WhatsApp
          </Button>
        </CardContent>
      </Card>
      <HelpDialog open={isHelpDialogOpen} onOpenChange={setHelpDialogOpen} />
    </>;
};
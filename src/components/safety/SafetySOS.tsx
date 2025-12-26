import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const SafetySOS = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Only show for logged in users
  if (!user) return null;

  return (
    <>
      {/* Floating SOS Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-lg hover:bg-destructive/90 transition-all hover:scale-105"
        aria-label="Emergency SOS"
      >
        <AlertTriangle className="w-6 h-6" />
      </button>

      {/* SOS Panel */}
      {isVisible && (
        <div className="fixed bottom-24 right-6 z-50 w-72 bg-card border border-border rounded-xl shadow-xl p-4 animate-scale-in">
          <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Emergency Help
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            If you feel unsafe during a session, use these options immediately.
          </p>
          <div className="space-y-2">
            <Button
              variant="destructive"
              className="w-full flex items-center gap-2"
              onClick={() => window.open("tel:100", "_self")}
            >
              <Phone className="w-4 h-4" />
              Call Police (100)
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() => window.open("tel:1091", "_self")}
            >
              <Phone className="w-4 h-4" />
              Women Helpline (1091)
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Your safety is our priority
          </p>
        </div>
      )}
    </>
  );
};

export default SafetySOS;

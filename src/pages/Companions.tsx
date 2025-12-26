import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Star, Clock } from "lucide-react";

const Companions = () => {
  const [companions, setCompanions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanions = async () => {
      const { data, error } = await supabase
        .from("companions")
        .select("*")
        .eq("is_available", true)
        .order("rating", { ascending: false });

      if (data) setCompanions(data);
      setLoading(false);
    };

    fetchCompanions();
  }, []);

  const energyTypeLabels: Record<string, string> = {
    silent_observant: "Silent & Observant",
    comforting_presence: "Comforting Presence",
    public_event_plus_one: "Event +1",
    calm_listener: "Calm Listener",
    gentle_companion: "Gentle Companion",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Find Your Companion
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our verified companions and find someone who matches your energy.
              All companions are trained professionals who understand the value of quiet presence.
            </p>
          </div>

          {/* Companions Grid */}
          {loading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Loading companions...</p>
            </div>
          ) : companions.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No companions available at the moment.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {companions.map((companion) => (
                <div
                  key={companion.id}
                  className="bg-card rounded-2xl border border-border overflow-hidden hover:zen-shadow-lg transition-all group"
                >
                  {/* Image */}
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={companion.avatar_url || `https://api.dicebear.com/7.x/lorelei/svg?seed=${companion.name}`}
                      alt={companion.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {companion.is_verified && (
                      <Badge className="absolute top-3 right-3 bg-primary/90">Verified</Badge>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{companion.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-primary text-primary" />
                        <span className="text-sm font-medium">{companion.rating || 4.5}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{companion.city}</span>
                    </div>

                    <Badge variant="secondary" className="mb-4">
                      {energyTypeLabels[companion.energy_type] || companion.energy_type}
                    </Badge>

                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                      {companion.bio || "A professional presence companion ready to be there for you."}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="text-foreground">
                        <span className="text-xl font-semibold">₹{companion.hourly_rate}</span>
                        <span className="text-muted-foreground text-sm">/hr</span>
                      </div>
                      <Link to={`/book/${companion.id}`}>
                        <Button size="sm">Book Now</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Companions;

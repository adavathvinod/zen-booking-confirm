import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { MapPin, Star, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const presenceOptions = [
  { value: "park_sitting", label: "Sitting in a park" },
  { value: "shopping_together", label: "Shopping together" },
  { value: "restaurant_dining", label: "Eating at a restaurant" },
  { value: "cafe_companion", label: "Café companion" },
  { value: "event_attendance", label: "Event attendance" },
  { value: "office_support", label: "Office support" },
  { value: "hospital_visit", label: "Hospital visit" },
  { value: "walking_companion", label: "Walking companion" },
];

const Book = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [companion, setCompanion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("2");
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [presenceNature, setPresenceNature] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        toast({ title: "Please login", description: "You need to login to book a companion.", variant: "destructive" });
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    const fetchCompanion = async () => {
      const { data } = await supabase.from("companions").select("*").eq("id", id).single();
      if (data) setCompanion(data);
      setLoading(false);
    };
    fetchCompanion();
  }, [id, navigate]);

  const totalAmount = companion ? companion.hourly_rate * parseInt(duration) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !companion) return;
    setShowGuidelines(true);
  };

  const confirmBooking = async () => {
    setSubmitting(true);
    try {
      const { data: bookingData, error } = await supabase.from("bookings").insert({
        user_id: user.id,
        companion_id: companion.id,
        booking_date: bookingDate,
        start_time: startTime,
        duration_hours: parseInt(duration),
        venue_name: venueName,
        venue_address: venueAddress,
        presence_nature: presenceNature as any,
        special_notes: specialNotes,
        total_amount: totalAmount,
      }).select().single();

      if (error) throw error;

      // Send email notification to admin
      await supabase.functions.invoke("send-booking-notification", {
        body: { 
          userName: user.email, 
          companionName: companion.name, 
          bookingDate, 
          startTime, 
          venueName, 
          venueAddress,
          presenceNature,
          totalAmount,
          specialNotes,
          bookingId: bookingData.id
        },
      });

      toast({ title: "Booking submitted!", description: "Your booking has been submitted and is pending confirmation." });
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Booking error:", err);
      toast({ title: "Booking failed", description: err.message || "Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
      setShowGuidelines(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p>Loading...</p></div>;
  if (!companion) return <div className="min-h-screen bg-background flex items-center justify-center"><p>Companion not found</p></div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-semibold text-foreground mb-8">Book {companion.name}</h1>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Date</Label>
                    <Input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required min={new Date().toISOString().split("T")[0]} />
                  </div>
                  <div>
                    <Label>Start Time</Label>
                    <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                  </div>
                </div>
                <div>
                  <Label>Duration (hours)</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6].map(h => <SelectItem key={h} value={String(h)}>{h} hour{h>1?"s":""}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Venue Name</Label>
                  <Input value={venueName} onChange={(e) => setVenueName(e.target.value)} placeholder="e.g., Starbucks, Central Park" required />
                </div>
                <div>
                  <Label>Venue Address</Label>
                  <Input value={venueAddress} onChange={(e) => setVenueAddress(e.target.value)} placeholder="Full address" required />
                </div>
                <div>
                  <Label>Nature of Presence</Label>
                  <Select value={presenceNature} onValueChange={setPresenceNature} required>
                    <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      {presenceOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Special Notes (optional)</Label>
                  <Textarea value={specialNotes} onChange={(e) => setSpecialNotes(e.target.value)} placeholder="Any special requirements..." />
                </div>
                <Button type="submit" size="lg" className="w-full">Confirm Booking — ₹{totalAmount}</Button>
              </form>
            </div>

            {/* Summary */}
            <div className="bg-card rounded-2xl border border-border p-6 h-fit sticky top-24">
              <img 
                src={companion.avatar_url || `https://api.dicebear.com/7.x/lorelei/svg?seed=${companion.name}`} 
                alt={companion.name} 
                className="w-full aspect-square object-cover rounded-xl mb-4" 
              />
              <h3 className="text-xl font-semibold text-foreground mb-1">{companion.name}</h3>
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                <MapPin className="w-4 h-4" />{companion.city}
              </div>
              <div className="flex items-center gap-1 mb-4">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <span className="text-sm font-medium">{companion.rating || 4.5}</span>
              </div>
              <div className="border-t border-border pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Rate</span>
                  <span>₹{companion.hourly_rate}/hr</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Duration</span>
                  <span>{duration} hr</span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{totalAmount}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-4">+ Travel & meals paid by client</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={showGuidelines} onOpenChange={setShowGuidelines}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary" />Usage Guidelines
            </DialogTitle>
            <DialogDescription>Please confirm you understand our terms</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>• This is NOT a dating or labor service</p>
            <p>• All meetings must be in public places only</p>
            <p>• No physical contact or romantic behavior</p>
            <p>• You are responsible for companion's travel & meals</p>
          </div>
          <Button onClick={confirmBooking} disabled={submitting} className="w-full">
            {submitting ? "Processing..." : "I Understand — Confirm Booking"}
          </Button>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default Book;

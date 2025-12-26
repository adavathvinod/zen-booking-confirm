import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, MapPin, User } from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
        return;
      }
      setUser(session.user);

      const { data } = await supabase
        .from("bookings")
        .select("*, companions(*)")
        .eq("user_id", session.user.id)
        .order("booking_date", { ascending: false });

      if (data) setBookings(data);
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-green-100 text-green-800 border-green-200",
    completed: "bg-muted text-muted-foreground border-border",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p>Loading...</p></div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-foreground mb-2">My Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.email}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">My Bookings</h2>
              
              {bookings.length === 0 ? (
                <div className="bg-card rounded-2xl border border-border p-8 text-center">
                  <p className="text-muted-foreground mb-4">You haven't made any bookings yet.</p>
                  <Button onClick={() => navigate("/companions")}>Browse Companions</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="bg-card rounded-2xl border border-border p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={booking.companions?.avatar_url || `https://api.dicebear.com/7.x/lorelei/svg?seed=${booking.companions?.name}`}
                            alt={booking.companions?.name}
                            className="w-16 h-16 rounded-xl object-cover"
                          />
                          <div>
                            <h3 className="font-semibold text-foreground">{booking.companions?.name}</h3>
                            <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                              <Calendar className="w-4 h-4" />
                              <span>{booking.booking_date}</span>
                              <Clock className="w-4 h-4 ml-2" />
                              <span>{booking.start_time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                              <MapPin className="w-4 h-4" />
                              <span>{booking.venue_name}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={statusColors[booking.status || 'pending']}>
                            {booking.status || 'pending'}
                          </Badge>
                          <span className="text-lg font-semibold">₹{booking.total_amount}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;

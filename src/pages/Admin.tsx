import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Users, Calendar, Shield } from 'lucide-react';

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

const Admin = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (isAdmin) fetchBookings();
  }, [isAdmin]);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`*, companions:companion_id (name), profiles:user_id (email)`)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch bookings');
    } else {
      const formattedBookings = (data || []).map((booking: any) => ({
        ...booking,
        companion_name: booking.companions?.name,
        user_email: booking.profiles?.email,
      }));
      setBookings(formattedBookings);
    }
    setLoading(false);
  };

  const handleStatusChange = async (booking: any, newStatus: BookingStatus) => {
    const previousStatus = booking.status;
    
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', booking.id);

    if (error) {
      toast.error('Failed to update booking status');
      return;
    }

    // Send confirmation email to user when status changes to confirmed or cancelled
    if ((newStatus === 'confirmed' || newStatus === 'cancelled') && previousStatus !== newStatus) {
      try {
        await supabase.functions.invoke('send-booking-confirmation', {
          body: {
            userEmail: booking.user_email,
            companionName: booking.companion_name,
            bookingDate: booking.booking_date,
            startTime: booking.start_time,
            durationHours: booking.duration_hours,
            venueName: booking.venue_name,
            venueAddress: booking.venue_address,
            presenceNature: booking.presence_nature,
            totalAmount: booking.total_amount,
            status: newStatus,
            bookingId: booking.id
          }
        });
        toast.success(`Booking ${newStatus}! Email sent to ${booking.user_email}`);
      } catch (err) {
        console.error('Email error:', err);
        toast.success(`Booking ${newStatus}! (Email notification may have failed)`);
      }
    } else {
      toast.success('Booking status updated');
    }
    
    fetchBookings();
  };

  if (adminLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><p>Loading...</p></div>;
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-24">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-semibold text-foreground">Admin Dashboard</h1>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />All Bookings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-6">
            <h2 className="text-xl font-medium text-foreground">All Bookings</h2>
            <div className="grid gap-4">
              {bookings.length === 0 ? (
                <Card><CardContent className="py-8 text-center text-muted-foreground">No bookings found.</CardContent></Card>
              ) : (
                bookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="py-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{booking.companion_name || 'Unknown'}</h3>
                            <Badge variant={booking.status === 'confirmed' ? 'default' : booking.status === 'cancelled' ? 'destructive' : 'outline'}>
                              {booking.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Client: {booking.user_email || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">{booking.booking_date} at {booking.start_time} • {booking.duration_hours} hours</p>
                          <p className="text-sm text-muted-foreground">Venue: {booking.venue_name}</p>
                          <p className="text-sm font-medium">Amount: ₹{booking.total_amount}</p>
                        </div>
                        <Select value={booking.status || 'pending'} onValueChange={(value: BookingStatus) => handleStatusChange(booking, value)}>
                          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;

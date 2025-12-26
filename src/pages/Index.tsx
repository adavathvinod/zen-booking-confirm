import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Shield, Volume2, Hand, Users, MapPin, Clock } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-slate-light/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase mb-4 animate-fade-in">
              The Art of Being Present
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              The Luxury of{" "}
              <span className="text-primary">Quiet Presence</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Someone to be there, when you just don't want to be alone.
              No conversation required. No expectations. Just presence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <Link to="/companions">
                <Button size="lg" className="px-8 gap-2">
                  Browse Companions <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="px-8">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              What We Offer
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Professional presence companions for life's moments when you need someone by your side.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background rounded-2xl p-8 zen-shadow-md hover:zen-shadow-lg transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Volume2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Silent Companion</h3>
              <p className="text-muted-foreground">
                Someone who understands the value of quiet. No forced small talk, just comfortable presence.
              </p>
            </div>

            <div className="bg-background rounded-2xl p-8 zen-shadow-md hover:zen-shadow-lg transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Safe & Verified</h3>
              <p className="text-muted-foreground">
                All companions are verified and trained. Public-only meetings with safety protocols in place.
              </p>
            </div>

            <div className="bg-background rounded-2xl p-8 zen-shadow-md hover:zen-shadow-lg transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Hand className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Flexible Booking</h3>
              <p className="text-muted-foreground">
                Book for any occasion - cafés, walks, events, or just sitting in the park together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple, safe, and seamless. Book a companion in minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-semibold mx-auto mb-6">
                1
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Browse</h3>
              <p className="text-muted-foreground text-sm">
                Explore verified companions and find someone who matches your needs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-semibold mx-auto mb-6">
                2
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Book</h3>
              <p className="text-muted-foreground text-sm">
                Choose your date, time, and venue. All meetings are in public places only.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-semibold mx-auto mb-6">
                3
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Meet</h3>
              <p className="text-muted-foreground text-sm">
                Enjoy quiet presence. No expectations, no pressure. Just companionship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-semibold mb-2">500+</div>
              <div className="text-primary-foreground/80 text-sm">Verified Companions</div>
            </div>
            <div>
              <div className="text-4xl font-semibold mb-2">10K+</div>
              <div className="text-primary-foreground/80 text-sm">Sessions Completed</div>
            </div>
            <div>
              <div className="text-4xl font-semibold mb-2">50+</div>
              <div className="text-primary-foreground/80 text-sm">Cities Covered</div>
            </div>
            <div>
              <div className="text-4xl font-semibold mb-2">4.9</div>
              <div className="text-primary-foreground/80 text-sm">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center bg-card rounded-3xl p-12 zen-shadow-lg">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Ready to Experience Quiet Presence?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands who have discovered the comfort of having someone just... be there.
            </p>
            <Link to="/companions">
              <Button size="lg" className="px-8 gap-2">
                Find Your Companion <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

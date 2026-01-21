import { useAuth } from "@/hooks/use-auth";
import { useLoyaltyAccount } from "@/hooks/use-loyalty";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Gift, Star, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Rewards() {
  const { user } = useAuth();
  const { data: loyalty, isLoading } = useLoyaltyAccount();

  if (isLoading) {
    return <div className="container mx-auto p-12"><Skeleton className="h-[400px] rounded-xl" /></div>;
  }

  // Mock tiers logic
  const points = loyalty?.points || 0;
  const nextTierPoints = 500;
  const progress = (points / nextTierPoints) * 100;

  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-display font-bold uppercase mb-2">Heat Rewards</h1>
          <p className="text-muted-foreground">Earn points with every spicy bite.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-2 bg-gradient-to-br from-secondary to-black text-white border-none shadow-xl">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-display uppercase tracking-wider text-primary">
                    {loyalty?.tier || "Bronze"} Member
                  </CardTitle>
                  <p className="text-gray-400 mt-1">Member since {new Date(loyalty?.joinedAt || Date.now()).getFullYear()}</p>
                </div>
                <Trophy className="w-12 h-12 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex justify-between text-sm font-bold">
                <span>{points} Points</span>
                <span className="text-gray-400">{nextTierPoints} Points Goal</span>
              </div>
              <Progress value={progress} className="h-4 bg-gray-700" indicatorClassName="bg-primary" />
              <p className="text-xs text-gray-400 mt-2">
                {nextTierPoints - points} more points to reach Silver Tier
              </p>
            </CardContent>
          </Card>

          <Card className="flex flex-col items-center justify-center text-center p-6 border-2 border-primary/20 bg-primary/5">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
               <Star className="w-8 h-8 text-primary fill-primary" />
            </div>
            <h3 className="font-bold text-lg mb-1">Available Rewards</h3>
            <p className="text-3xl font-display font-bold text-primary">2</p>
            <Button size="sm" className="mt-4" variant="outline">View All</Button>
          </Card>
        </div>

        <h3 className="font-display text-2xl font-bold mb-6">Redeem Points</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Free Soft Drink", points: 100, icon: Gift },
            { title: "Spicy Wings (6pc)", points: 250, icon: Award },
            { title: "$10 Off Order", points: 500, icon: Star },
          ].map((reward, i) => (
            <Card key={i} className={`hover:border-primary transition-colors cursor-pointer ${points < reward.points ? 'opacity-60 grayscale' : ''}`}>
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <reward.icon className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h4 className="font-bold">{reward.title}</h4>
                  <p className="text-primary font-bold text-sm">{reward.points} Points</p>
                </div>
                <Button 
                  size="sm" 
                  className="w-full" 
                  disabled={points < reward.points}
                >
                  Redeem
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

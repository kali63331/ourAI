import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Code, Globe, Zap, Brain, Sparkles, Rocket, Star } from 'lucide-react';
import { AnimatedBackground } from './AnimatedBackground';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative min-h-screen flex items-center justify-center p-6">
        <div className="max-w-7xl mx-auto text-center">
          {/* Hero Content */}
          <div className="mb-12 animate-fade-in">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-2xl opacity-50 animate-pulse" />
              <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-500 rounded-3xl shadow-2xl backdrop-blur-sm animate-float transform hover:scale-110 transition-transform duration-300">
                <Code className="w-12 h-12 text-white" strokeWidth={2.5} />
              </div>
            </div>
            
            <h1 className="text-7xl md:text-9xl mb-8 leading-tight font-['Space_Grotesk'] font-black tracking-tight">
              <span className="inline-block bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink bg-clip-text text-transparent animate-gradient-x drop-shadow-[0_0_30px_rgba(167,139,250,0.5)]">
                Python AI
              </span>
              <span className="block text-3xl md:text-4xl text-foreground/90 font-['Inter'] font-medium mt-6 tracking-normal">
                Master Programming with Intelligence
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 text-foreground/70 max-w-3xl mx-auto font-['Inter'] font-light leading-relaxed">
              Your advanced AI companion for Python mastery. Get expert guidance, real-time solutions, and interactive learning experiences.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                onClick={onGetStarted} 
                size="lg" 
                className="text-xl px-12 py-8 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink hover:shadow-glow rounded-2xl font-['Space_Grotesk'] font-bold transition-all duration-300 hover:scale-110 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-neon-pink via-neon-cyan to-neon-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center">
                  <Sparkles className="w-6 h-6 mr-2 group-hover:rotate-12 transition-transform" />
                  Start Learning Now
                  <Zap className="w-6 h-6 ml-2 group-hover:scale-125 transition-transform" />
                </span>
              </Button>
              
              <Button 
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                }}
                variant="outline"
                size="lg"
                className="text-xl px-12 py-8 border-2 border-neon-purple/30 hover:border-neon-purple hover:bg-neon-purple/10 rounded-2xl font-['Space_Grotesk'] font-semibold backdrop-blur-sm transition-all duration-300 hover:shadow-glow"
              >
                <Rocket className="w-6 h-6 mr-2" />
                View Features
              </Button>
            </div>
          </div>
          
          {/* Quick Highlights */}
          <div className="grid md:grid-cols-3 gap-6 mt-20">
            <Card className="group p-8 backdrop-blur-xl bg-card/50 border border-border/50 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2 animate-slide-up rounded-3xl">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Code className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <h3 className="text-2xl font-['Space_Grotesk'] font-bold mb-4 bg-gradient-to-br from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Python Mastery
              </h3>
              <p className="text-foreground/70 font-['Inter'] leading-relaxed">
                Comprehensive expertise from fundamentals to advanced frameworks. Learn with structured, practical examples.
              </p>
            </Card>
            
            <Card className="group p-8 backdrop-blur-xl bg-card/50 border border-border/50 hover:border-pink-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/20 hover:-translate-y-2 animate-slide-up rounded-3xl" style={{animationDelay: '0.1s'}}>
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-yellow-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-pink-600 to-yellow-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Globe className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <h3 className="text-2xl font-['Space_Grotesk'] font-bold mb-4 bg-gradient-to-br from-pink-400 to-yellow-400 bg-clip-text text-transparent">
                Real-Time Research
              </h3>
              <p className="text-foreground/70 font-['Inter'] leading-relaxed">
                Access latest documentation, tutorials, and community solutions instantly with internet-powered AI.
              </p>
            </Card>
            
            <Card className="group p-8 backdrop-blur-xl bg-card/50 border border-border/50 hover:border-yellow-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-500/20 hover:-translate-y-2 animate-slide-up rounded-3xl" style={{animationDelay: '0.2s'}}>
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-purple-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-yellow-600 to-purple-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Brain className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <h3 className="text-2xl font-['Space_Grotesk'] font-bold mb-4 bg-gradient-to-br from-yellow-400 to-purple-400 bg-clip-text text-transparent">
                Smart Solutions
              </h3>
              <p className="text-foreground/70 font-['Inter'] leading-relaxed">
                Multiple approaches, best practices, and optimized code examples tailored to your learning style.
              </p>
            </Card>
          </div>
          
          {/* Info Section */}
          <div className="mt-24 max-w-5xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-5xl font-['Space_Grotesk'] font-bold mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Everything You Need
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-8 backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-3xl hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
                <h3 className="text-xl font-['Space_Grotesk'] font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  What You Can Ask
                </h3>
                <ul className="space-y-3 font-['Inter'] text-foreground/70">
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                    <span>"How do I create a list in Python?"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-pink-400 mt-1 flex-shrink-0" />
                    <span>"What are Python functions and classes?"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                    <span>"Best practices for Python coding"</span>
                  </li>
                </ul>
              </Card>
              
              <Card className="p-8 backdrop-blur-xl bg-gradient-to-br from-pink-500/10 to-yellow-500/10 border border-pink-500/30 rounded-3xl hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300">
                <h3 className="text-xl font-['Space_Grotesk'] font-bold mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-pink-400" />
                  AI Models Available
                </h3>
                <ul className="space-y-3 font-['Inter'] text-foreground/70">
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-pink-400 mt-1 flex-shrink-0" />
                    <span><strong>Perplexity AI:</strong> Internet-enhanced research</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                    <span><strong>OpenAI GPT:</strong> Fast, comprehensive responses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                    <span>Specialized Python programming focus</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-foreground/50 font-['Inter'] text-sm">
              🐍 Powered by Advanced AI • Real-time Research • Python-Focused • Created by Jaskaran Singh
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
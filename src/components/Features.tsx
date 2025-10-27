import { Card } from '@/components/ui/card';
import { 
  Code, 
  Globe, 
  Brain, 
  Sparkles, 
  MessageSquare, 
  BookOpen, 
  Zap, 
  Terminal,
  Lightbulb,
  FileCode,
  Mic,
  Camera,
  ArrowRight
} from 'lucide-react';

interface FeaturesProps {
  onFeatureClick?: (tab: string) => void;
}

export const Features = ({ onFeatureClick }: FeaturesProps) => {
  const mainFeatures = [
    {
      icon: Brain,
      title: 'AI-Powered Learning',
      description: 'Get instant help from advanced AI models trained specifically for Python programming assistance.',
      gradient: 'from-purple-600 to-pink-600',
      borderColor: 'border-purple-500/50',
      shadowColor: 'shadow-purple-500/20',
      delay: '0s',
      tab: 'chat'
    },
    {
      icon: MessageSquare,
      title: 'Interactive Chat',
      description: 'Ask questions in natural language and receive detailed explanations with code examples.',
      gradient: 'from-pink-600 to-yellow-600',
      borderColor: 'border-pink-500/50',
      shadowColor: 'shadow-pink-500/20',
      delay: '0.1s',
      tab: 'chat'
    },
    {
      icon: Terminal,
      title: 'Code Playground',
      description: 'Write, test, and debug Python code in real-time with our interactive coding environment.',
      gradient: 'from-yellow-600 to-purple-600',
      borderColor: 'border-yellow-500/50',
      shadowColor: 'shadow-yellow-500/20',
      delay: '0.2s',
      tab: 'playground'
    },
    {
      icon: BookOpen,
      title: 'Interactive Exercises',
      description: 'Practice with hands-on coding challenges designed to reinforce your learning.',
      gradient: 'from-blue-600 to-purple-600',
      borderColor: 'border-blue-500/50',
      shadowColor: 'shadow-blue-500/20',
      delay: '0.3s',
      tab: 'exercises'
    },
    {
      icon: FileCode,
      title: 'Code Snippets Library',
      description: 'Access a comprehensive collection of Python code examples for common tasks and patterns.',
      gradient: 'from-green-600 to-blue-600',
      borderColor: 'border-green-500/50',
      shadowColor: 'shadow-green-500/20',
      delay: '0.4s',
      tab: 'snippets'
    },
    {
      icon: Globe,
      title: 'Real-Time Research',
      description: 'AI searches the web for the latest documentation, tutorials, and community solutions.',
      gradient: 'from-orange-600 to-pink-600',
      borderColor: 'border-orange-500/50',
      shadowColor: 'shadow-orange-500/20',
      delay: '0.5s',
      tab: 'chat'
    }
  ];

  const additionalFeatures = [
    {
      icon: Mic,
      title: 'Voice Interaction',
      description: 'Learn hands-free with voice-enabled AI conversations.',
      gradient: 'from-violet-600 to-fuchsia-600'
    },
    {
      icon: Camera,
      title: 'Image Analysis',
      description: 'Upload screenshots of code or diagrams for instant analysis.',
      gradient: 'from-cyan-600 to-blue-600'
    },
    {
      icon: Lightbulb,
      title: 'Smart Suggestions',
      description: 'Get intelligent code recommendations and optimization tips.',
      gradient: 'from-amber-600 to-orange-600'
    },
    {
      icon: Zap,
      title: 'Quick Reference',
      description: 'Access Python cheat sheets and documentation instantly.',
      gradient: 'from-rose-600 to-pink-600'
    },
    {
      icon: Code,
      title: 'Multiple AI Models',
      description: 'Choose between Perplexity, OpenAI, and specialized models.',
      gradient: 'from-indigo-600 to-purple-600'
    },
    {
      icon: Sparkles,
      title: 'Best Practices',
      description: 'Learn industry-standard coding patterns and conventions.',
      gradient: 'from-teal-600 to-emerald-600'
    }
  ];

  return (
    <div className="space-y-20">
      {/* Main Features Section */}
      <div>
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block mb-4">
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-sm">
              <span className="text-sm font-['Space_Grotesk'] font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                POWERFUL FEATURES
              </span>
            </div>
          </div>
          <h2 className="text-4xl md:text-6xl font-['Space_Grotesk'] font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
            Everything You Need to Excel
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto font-['Inter']">
            A complete learning ecosystem designed to take you from beginner to expert
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className={`group p-8 backdrop-blur-xl bg-card/50 border ${feature.borderColor} hover:shadow-2xl ${feature.shadowColor} hover:-translate-y-3 transition-all duration-500 rounded-3xl animate-slide-up overflow-hidden relative cursor-pointer`}
                style={{ animationDelay: feature.delay }}
                onClick={() => onFeatureClick?.(feature.tab)}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <div className="relative">
                  <div className="relative w-16 h-16 mb-6">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300`} />
                    <div className={`relative w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-300`}>
                      <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-['Space_Grotesk'] font-bold mb-4 group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-foreground/70 font-['Inter'] leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm font-['Space_Grotesk'] font-semibold text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Try it now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Additional Features Grid */}
      <div>
        <div className="text-center mb-12 animate-fade-in">
          <h3 className="text-3xl md:text-4xl font-['Space_Grotesk'] font-bold mb-4 bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent">
            And Much More
          </h3>
          <p className="text-lg text-foreground/70 font-['Inter']">
            Discover additional tools to enhance your learning experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {additionalFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="group p-6 backdrop-blur-xl bg-card/30 border border-border/30 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 rounded-2xl hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`relative w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:rotate-6 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-['Space_Grotesk'] font-bold mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-foreground/70 font-['Inter']">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid md:grid-cols-4 gap-6 animate-fade-in">
        {[
          { number: '5+', label: 'AI Models' },
          { number: '100+', label: 'Code Examples' },
          { number: '50+', label: 'Exercises' },
          { number: '24/7', label: 'AI Support' }
        ].map((stat, index) => (
          <Card 
            key={index}
            className="p-8 backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-3xl text-center hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="text-5xl font-['Space_Grotesk'] font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              {stat.number}
            </div>
            <div className="text-foreground/70 font-['Inter'] font-medium">
              {stat.label}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
import { useState } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { Features } from '@/components/Features';
import { PythonAIChat } from '@/components/PythonAIChat';
import { CodePlayground } from '@/components/CodePlayground';
import { PythonExercises } from '@/components/PythonExercises';
import { PythonCheatSheet } from '@/components/PythonCheatSheet';
import { CodeSnippets } from '@/components/CodeSnippets';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [currentView, setCurrentView] = useState<'hero' | 'features'>('hero');
  const [selectedTab, setSelectedTab] = useState<string>('chat');

  const handleGetStarted = () => {
    setCurrentView('features');
  };

  const handleFeatureClick = (tab: string) => {
    setSelectedTab(tab);
    setCurrentView('features');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'hero':
        return (
          <>
            <HeroSection onGetStarted={handleGetStarted} />
            <section id="features" className="min-h-screen relative overflow-hidden py-24">
              <div className="absolute inset-0 bg-gradient-to-br from-background via-neon-purple/5 to-neon-cyan/5" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem]" />
              <div className="absolute top-20 right-20 w-96 h-96 bg-neon-purple/10 rounded-full blur-[100px] animate-pulse" />
              <div className="absolute bottom-20 left-20 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '1s'}} />
              <div className="relative container mx-auto px-6">
                <Features onFeatureClick={handleFeatureClick} />
              </div>
            </section>
          </>
        );
      case 'features':
        return (
          <div className="min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-neon-purple/5 to-neon-cyan/5" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            <div className="absolute top-20 right-20 w-96 h-96 bg-neon-purple/10 rounded-full blur-[100px] animate-blob" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[100px] animate-blob" style={{animationDelay: '2s'}} />
            
            <div className="relative container mx-auto py-12 px-6">
              <div className="mb-8">
                <Button 
                  onClick={() => setCurrentView('hero')}
                  variant="ghost" 
                  size="sm"
                  className="mb-6 hover:bg-purple-500/10 rounded-xl font-['Space_Grotesk'] font-semibold"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
                <div className="text-center mb-8">
                  <h1 className="text-5xl md:text-6xl font-['Space_Grotesk'] font-bold mb-4">
                    <span className="bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink bg-clip-text text-transparent animate-gradient-x">
                      Python Learning Hub
                    </span>
                  </h1>
                  <p className="text-muted-foreground font-['Inter'] text-lg max-w-2xl mx-auto">
                    Everything you need to master Python programming with cutting-edge AI
                  </p>
                </div>
              </div>

              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-10 p-2 backdrop-blur-xl bg-card/80 border-2 border-neon-purple/20 rounded-3xl h-auto gap-2 shadow-glow">
                  <TabsTrigger value="chat" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-purple data-[state=active]:to-neon-cyan data-[state=active]:text-white data-[state=active]:shadow-glow rounded-2xl font-['Space_Grotesk'] font-semibold py-4 transition-all duration-300">AI Chat</TabsTrigger>
                  <TabsTrigger value="playground" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-purple data-[state=active]:to-neon-cyan data-[state=active]:text-white data-[state=active]:shadow-glow rounded-2xl font-['Space_Grotesk'] font-semibold py-4 transition-all duration-300">Playground</TabsTrigger>
                  <TabsTrigger value="exercises" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-purple data-[state=active]:to-neon-cyan data-[state=active]:text-white data-[state=active]:shadow-glow rounded-2xl font-['Space_Grotesk'] font-semibold py-4 transition-all duration-300">Exercises</TabsTrigger>
                  <TabsTrigger value="cheatsheet" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-purple data-[state=active]:to-neon-cyan data-[state=active]:text-white data-[state=active]:shadow-glow rounded-2xl font-['Space_Grotesk'] font-semibold py-4 transition-all duration-300">Cheat Sheet</TabsTrigger>
                  <TabsTrigger value="snippets" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-purple data-[state=active]:to-neon-cyan data-[state=active]:text-white data-[state=active]:shadow-glow rounded-2xl font-['Space_Grotesk'] font-semibold py-4 transition-all duration-300">Snippets</TabsTrigger>
                </TabsList>

                <TabsContent value="chat">
                  <PythonAIChat />
                </TabsContent>

                <TabsContent value="playground">
                  <CodePlayground />
                </TabsContent>

                <TabsContent value="exercises">
                  <PythonExercises />
                </TabsContent>

                <TabsContent value="cheatsheet">
                  <PythonCheatSheet />
                </TabsContent>

                <TabsContent value="snippets">
                  <CodeSnippets />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        );
      default:
        return <HeroSection onGetStarted={handleGetStarted} />;
    }
  };

  return renderCurrentView();
};

export default Index;
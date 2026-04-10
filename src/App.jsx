/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Gamepad2, X, Maximize2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import gamesData from "./data/games.json";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeGame, setActiveGame] = useState(null);

  const categories = useMemo(() => {
    const cats = new Set(gamesData.map((g) => g.category));
    return Array.from(cats);
  }, []);

  const filteredGames = useMemo(() => {
    return gamesData.filter((game) => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-navy-deep text-cool-white p-4 md:p-8 relative overflow-hidden">
      <div className="scanline" />
      
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter leading-none mb-4"
          >
            Nano <span className="glow-text">Games</span>
          </motion.h1>
          <p className="text-cool-gray font-mono text-sm uppercase tracking-widest">
            // NEURAL_LINK_ESTABLISHED //
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-96">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cool-gray" />
            <Input
              placeholder="SEARCH_THE_VOID..."
              className="pl-10 glass-panel bg-transparent border-white/10 focus:ring-navy-accent focus:border-navy-accent placeholder:text-cool-gray/40 uppercase font-mono"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Categories */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-wrap gap-2 relative z-10">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => setSelectedCategory(null)}
          className={`font-mono uppercase rounded-none transition-all duration-300 ${selectedCategory === null ? 'bg-navy-accent text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'glass-panel hover:bg-white/5'}`}
        >
          [ ALL_MODULES ]
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            onClick={() => setSelectedCategory(cat)}
            className={`font-mono uppercase rounded-none transition-all duration-300 ${selectedCategory === cat ? 'bg-navy-accent text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'glass-panel hover:bg-white/5'}`}
          >
            [ {cat} ]
          </Button>
        ))}
      </div>

      {/* Game Grid */}
      <main className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredGames.map((game, index) => (
              <motion.div
                key={game.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Card 
                  className="futuristic-card h-full flex flex-col group cursor-pointer border-none rounded-none"
                  onClick={() => setActiveGame(game)}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={game.thumbnail}
                      alt={game.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-navy-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                      <Gamepad2 className="w-12 h-12 text-white glow-text" />
                    </div>
                    <Badge className="absolute top-2 right-2 bg-navy-deep/80 text-navy-accent border-navy-accent/50 rounded-none font-mono text-[10px]">
                      {game.category}
                    </Badge>
                  </div>
                  <CardHeader className="p-6">
                    <CardTitle className="text-2xl font-display uppercase tracking-tight group-hover:glow-text transition-colors">
                      {game.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 flex-grow">
                    <p className="text-cool-gray text-sm font-mono leading-relaxed">
                      {game.description}
                    </p>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button className="w-full bg-navy-accent/20 text-navy-accent hover:bg-navy-accent hover:text-white border border-navy-accent/50 rounded-none font-bold uppercase transition-all duration-300">
                      INITIALIZE_GAME
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-20 glass-panel border-dashed border-white/10">
            <p className="text-cool-gray font-mono uppercase tracking-widest">
              // NO_DATA_FOUND_IN_SECTOR //
            </p>
          </div>
        )}
      </main>

      {/* Game Viewer Modal */}
      <Dialog open={!!activeGame} onOpenChange={(open) => !open && setActiveGame(null)}>
        <DialogContent className="max-w-6xl h-[90vh] p-0 bg-navy-deep/95 backdrop-blur-xl border border-white/10 rounded-none overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <DialogHeader className="p-4 border-b border-white/10 flex flex-row items-center justify-between space-y-0">
            <DialogTitle className="text-3xl font-display uppercase tracking-tighter flex items-center gap-3">
              <Gamepad2 className="w-8 h-8 glow-text" />
              {activeGame?.title}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="glass-panel hover:bg-navy-accent hover:text-white rounded-none"
                onClick={() => window.open(activeGame?.iframeUrl, '_blank')}
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="glass-panel hover:bg-red-500/50 hover:text-white rounded-none"
                onClick={() => setActiveGame(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-grow bg-white relative">
            {activeGame && (
              <iframe
                src={activeGame.iframeUrl}
                className="w-full h-full border-none"
                title={activeGame.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
          <div className="p-4 glass-panel border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge className="bg-navy-accent text-white rounded-none font-mono uppercase shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                {activeGame?.category}
              </Badge>
              <span className="text-cool-gray font-mono text-xs uppercase">
                SYSTEM_STATUS: NOMINAL
              </span>
            </div>
            <p className="text-cool-gray text-sm font-mono hidden md:block">
              {activeGame?.description}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 pb-8 relative z-10">
        <p className="font-mono text-xs text-cool-gray uppercase tracking-widest">
          © 2026 NANO_GAMES // NEURAL_ARCADE_INTERFACE
        </p>
        <div className="flex gap-6">
          <a href="#" className="font-mono text-xs text-cool-gray hover:text-navy-accent transition-colors uppercase tracking-widest">NETWORK</a>
          <a href="#" className="font-mono text-xs text-cool-gray hover:text-navy-accent transition-colors uppercase tracking-widest">UPLINK</a>
          <a href="#" className="font-mono text-xs text-cool-gray hover:text-navy-accent transition-colors uppercase tracking-widest">PROTOCOLS</a>
        </div>
      </footer>
    </div>
  );
}

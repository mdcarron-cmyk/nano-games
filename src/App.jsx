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
    <div className="min-h-screen bg-brutal-black text-gallery-white p-4 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter leading-none mb-4"
          >
            Void <span className="neon-text">Arcade</span>
          </motion.h1>
          <p className="text-gallery-white/60 font-mono text-sm uppercase tracking-widest">
            [ Unblocked & Unfiltered Gaming ]
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-96">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gallery-white/40" />
            <Input
              placeholder="SEARCH GAMES..."
              className="pl-10 brutal-border bg-transparent border-gallery-white focus:ring-neon-green focus:border-neon-green placeholder:text-gallery-white/20 uppercase font-mono"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Categories */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => setSelectedCategory(null)}
          className={`font-mono uppercase ${selectedCategory === null ? 'bg-neon-green text-brutal-black hover:bg-neon-green/90' : 'brutal-border hover:bg-gallery-white/10'}`}
        >
          ALL_GAMES
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            onClick={() => setSelectedCategory(cat)}
            className={`font-mono uppercase ${selectedCategory === cat ? 'bg-neon-green text-brutal-black hover:bg-neon-green/90' : 'brutal-border hover:bg-gallery-white/10'}`}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Game Grid */}
      <main className="max-w-7xl mx-auto">
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
                  className="brutal-card h-full flex flex-col group cursor-pointer"
                  onClick={() => setActiveGame(game)}
                >
                  <div className="relative aspect-video overflow-hidden border-b-2 border-gallery-white">
                    <img
                      src={game.thumbnail}
                      alt={game.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-neon-green/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Gamepad2 className="w-12 h-12 text-brutal-black" />
                    </div>
                    <Badge className="absolute top-2 right-2 bg-brutal-black text-neon-green border-neon-green rounded-none font-mono">
                      {game.category}
                    </Badge>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-2xl font-display uppercase tracking-tight group-hover:neon-text transition-colors">
                      {game.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 flex-grow">
                    <p className="text-gallery-white/60 text-sm font-mono leading-relaxed">
                      {game.description}
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 border-t border-gallery-white/20">
                    <Button className="w-full bg-gallery-white text-brutal-black hover:bg-neon-green hover:text-brutal-black rounded-none font-bold uppercase transition-colors">
                      PLAY_NOW
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-gallery-white/20">
            <p className="text-gallery-white/40 font-mono uppercase tracking-widest">
              NO_GAMES_FOUND_IN_THE_VOID
            </p>
          </div>
        )}
      </main>

      {/* Game Viewer Modal */}
      <Dialog open={!!activeGame} onOpenChange={(open) => !open && setActiveGame(null)}>
        <DialogContent className="max-w-6xl h-[90vh] p-0 bg-brutal-black border-4 border-gallery-white rounded-none overflow-hidden flex flex-col">
          <DialogHeader className="p-4 border-b-4 border-gallery-white flex flex-row items-center justify-between space-y-0">
            <DialogTitle className="text-3xl font-display uppercase tracking-tighter flex items-center gap-3">
              <Gamepad2 className="w-8 h-8 neon-text" />
              {activeGame?.title}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="brutal-border hover:bg-neon-green hover:text-brutal-black"
                onClick={() => window.open(activeGame?.iframeUrl, '_blank')}
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="brutal-border hover:bg-red-500 hover:text-white"
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
          <div className="p-4 bg-brutal-black border-t-4 border-gallery-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge className="bg-neon-green text-brutal-black rounded-none font-mono uppercase">
                {activeGame?.category}
              </Badge>
              <span className="text-gallery-white/40 font-mono text-xs uppercase">
                STATUS: RUNNING_IN_SANDBOX
              </span>
            </div>
            <p className="text-gallery-white/60 text-sm font-mono hidden md:block">
              {activeGame?.description}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-20 pt-8 border-t-2 border-gallery-white/20 flex flex-col md:flex-row justify-between items-center gap-4 pb-8">
        <p className="font-mono text-xs text-gallery-white/40 uppercase tracking-widest">
          © 2026 VOID_ARCADE // BUILT_FOR_FREEDOM
        </p>
        <div className="flex gap-6">
          <a href="#" className="font-mono text-xs text-gallery-white/40 hover:text-neon-green transition-colors uppercase">GITHUB</a>
          <a href="#" className="font-mono text-xs text-gallery-white/40 hover:text-neon-green transition-colors uppercase">DISCORD</a>
          <a href="#" className="font-mono text-xs text-gallery-white/40 hover:text-neon-green transition-colors uppercase">TERMS</a>
        </div>
      </footer>
    </div>
  );
}

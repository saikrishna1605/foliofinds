// src/components/home-model-viewer.tsx
"use client";
import React from "react";

export function HomeModelViewer() {
  return (
    <div className="w-full h-[500px] flex items-center justify-center bg-gradient-to-br from-background via-card to-muted dark:from-background dark:via-card dark:to-muted rounded-lg border-2 border-dashed border-primary/20 dark:border-primary/30 shadow-lg">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">📚</div>
        <h3 className="text-2xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-2">Welcome to FolioFinds</h3>
        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
          Discover thousands of used books from sellers near you. Your next adventure is just a page turn away.
        </p>
        <div className="mt-8 flex justify-center space-x-8">
          <div className="text-center group hover:scale-105 transition-transform duration-200">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">🔍</div>
            <p className="text-sm text-muted-foreground font-medium">Find Books</p>
          </div>
          <div className="text-center group hover:scale-105 transition-transform duration-200">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">💰</div>
            <p className="text-sm text-muted-foreground font-medium">Great Prices</p>
          </div>
          <div className="text-center group hover:scale-105 transition-transform duration-200">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">🚚</div>
            <p className="text-sm text-muted-foreground font-medium">Fast Delivery</p>
          </div>
        </div>
        <div className="mt-6">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full text-sm text-primary dark:text-primary-foreground border border-primary/20 dark:border-primary/30">
            <span className="mr-2">✨</span>
            Start your book journey today!
          </div>
        </div>
      </div>
    </div>
  );
}

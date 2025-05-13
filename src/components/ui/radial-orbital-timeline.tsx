"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
    {}
  );
  const [viewMode, setViewMode] = useState<"orbital">("orbital");
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [centerOffset, setCenterOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [radius, setRadius] = useState<number>(160);

  // Nouvel état pour le contenu fixe en bas
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

  // Ajuster automatiquement le rayon selon la taille de l'écran
  useEffect(() => {
    function handleResize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setRadius(Math.max(120, Math.min(w, h) / 4));
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
      // Réinitialiser le contenu fixe
      setSelectedContent(null);
      setSelectedTitle(null);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) {
          newState[parseInt(key)] = false;
        }
      });

      newState[id] = !prev[id];

      if (!prev[id]) {
        // Mettre à jour le contenu fixe
        const item = timelineData.find(item => item.id === id);
        if (item) {
          setSelectedContent(item.content);
          setSelectedTitle(item.title);
        }
        
        setActiveNodeId(id);
        setAutoRotate(false);

        const relatedItems = getRelatedItems(id);
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => {
          newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);

        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
        setSelectedContent(null);
        setSelectedTitle(null);
      }

      return newState;
    });
  };

  useEffect(() => {
    let rotationTimer: NodeJS.Timeout;

    if (autoRotate && viewMode === "orbital") {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => {
          const newAngle = (prev + 0.3) % 360;
          return Number(newAngle.toFixed(3));
        });
      }, 100);
    }

    return () => {
      if (rotationTimer) {
        clearInterval(rotationTimer);
      }
    };
  }, [autoRotate, viewMode]);

  const centerViewOnNode = (nodeId: number) => {
    if (viewMode !== "orbital" || !nodeRefs.current[nodeId]) return;

    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;

    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const r = radius;
    const radian = (angle * Math.PI) / 180;

    const x = r * Math.cos(radian) + centerOffset.x;
    const y = r * Math.sin(radian) + centerOffset.y;

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(
      0.4,
      Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))
    );

    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  };

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed":
        return "text-white bg-black border-white";
      case "in-progress":
        return "text-black bg-white border-black";
      case "pending":
        return "text-white bg-black/40 border-white/50";
      default:
        return "text-white bg-black/40 border-white/50";
    }
  };

  return (
    <div
      className="w-full min-h-[900px] md:min-h-[1000px] flex flex-col items-center justify-start overflow-visible p-4"
      ref={containerRef}
      onClick={handleContainerClick}
      style={{ backgroundColor: 'transparent' }}
    >
      {/* Contenu en deux parties: orbite et carte fixe en bas */}
      <div className="flex flex-col h-full w-full max-w-4xl">
        {/* Orbite */}
        <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center mt-8">
          <div
            className="absolute w-full h-full flex items-center justify-center"
            ref={orbitRef}
            style={{
              perspective: "1000px",
              transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
            }}
          >
            {/* Cercle extérieur visuel (léger) */}
            <div className="absolute w-[calc(var(--radius)*2px)] h-[calc(var(--radius)*2px)] rounded-full border border-white/10" style={{'--radius': radius} as React.CSSProperties} />

            {timelineData.map((item, index) => {
              const position = calculateNodePosition(index, timelineData.length);
              const isExpanded = expandedItems[item.id];
              const isRelated = isRelatedToActive(item.id);
              const isPulsing = pulseEffect[item.id];
              const Icon = item.icon;

              const nodeStyle = {
                transform: `translate(${position.x}px, ${position.y}px)`,
                zIndex: isExpanded ? 200 : position.zIndex,
                opacity: isExpanded ? 1 : position.opacity,
              };

              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    if (el) nodeRefs.current[item.id] = el;
                  }}
                  className="absolute transition-all duration-700 cursor-pointer"
                  style={nodeStyle}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleItem(item.id);
                  }}
                >
                  <div
                    className={`absolute rounded-full -inset-1 ${
                      isPulsing ? "animate-pulse duration-1000" : ""
                    }`}
                    style={{
                      background: `radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)`,
                      width: `${item.energy * 0.5 + 40}px`,
                      height: `${item.energy * 0.5 + 40}px`,
                      left: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                      top: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                    }}
                  ></div>

                  <div
                    className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${
                      isExpanded
                        ? "bg-white text-black"
                        : isRelated
                        ? "bg-white/50 text-black"
                        : "bg-black text-white"
                    }
                    border-2 
                    ${
                      isExpanded
                        ? "border-white shadow-lg shadow-white/30"
                        : isRelated
                        ? "border-white animate-pulse"
                        : "border-white/40"
                    }
                    transition-all duration-300 transform
                    ${isExpanded ? "scale-125" : ""} 
                  `}
                  >
                    <Icon size={16} />
                  </div>

                  <div
                    className={`
                    absolute top-12 whitespace-nowrap
                    text-xs font-semibold tracking-wider
                    transition-all duration-300
                    ${isExpanded ? "text-white" : "text-white/70"}
                    transform ${isExpanded ? "scale-110" : ""}
                  `}
                  >
                    {item.title}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
        
        {/* Carte fixe en bas */}
        <div className="w-full mt-72 md:mt-96 mb-24">
          {selectedContent && (
            <Card 
              className="w-full mx-auto bg-black/95 backdrop-blur-lg border-white/10 shadow-2xl shadow-black/40 rounded-xl transition-all duration-500 max-w-3xl"
            >
              <CardHeader className="pb-1 pt-6 bg-transparent">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold text-white text-center w-full">
                    {selectedTitle}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-base text-white/90 pt-2 px-8 pb-10">
                {selectedContent.split('\n').map((line, i) => (
                  <p key={i} className="my-2 text-left leading-relaxed">{line}</p>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 
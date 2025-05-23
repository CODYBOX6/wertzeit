"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Interface pour ShineBorder
interface ShineBorderProps {
  borderRadius?: number;
  borderWidth?: number;
  duration?: number;
  color?: string | string[];
  className?: string;
  children: React.ReactNode;
}

// Composant ShineBorder simplifié pour la bordure lumineuse
function ShineBorder({
  borderRadius = 8,
  borderWidth = 1,
  duration = 14,
  color = "#000000",
  className,
  children,
}: ShineBorderProps) {
  // Convertir le tableau de couleurs en une chaîne utilisable dans un gradient
  const colorStr = color instanceof Array ? color.join(", ") : color;
  
  return (
    <div
      className={`relative rounded-xl ${className} overflow-hidden p-[3px]`}
      style={{
        background: `linear-gradient(90deg, ${colorStr} 0%, transparent 40%, transparent 60%, ${colorStr} 100%)`,
        backgroundSize: "200% 100%",
        animation: `shine ${duration}s linear infinite`,
        borderRadius: `${borderRadius}px`,
      }}
    >
      <div className="relative rounded-xl overflow-hidden h-full w-full">{children}</div>
    </div>
  );
}

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
      // Réduction de 20% du rayon
      setRadius(Math.max(96, Math.min(w, h) / 5)); // 120 * 0.8 = 96, division par 5 au lieu de 4
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

    return { 
      x: Math.round(x * 100) / 100, 
      y: Math.round(y * 100) / 100, 
      angle: Math.round(angle * 100) / 100, 
      zIndex, 
      opacity: Number(opacity.toFixed(2)) 
    };
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
      // Réduction de la hauteur minimale
      className="w-full min-h-[600px] md:min-h-[640px] flex flex-col items-center justify-start overflow-visible p-4"
      ref={containerRef}
      onClick={handleContainerClick}
      style={{ backgroundColor: 'transparent' }}
    >
      {/* Contenu en deux parties: orbite et carte fixe en bas */}
      <div className="flex flex-col h-full w-full max-w-4xl">
        {/* Orbite - hauteur ajustée */}
        <div className="relative w-full h-[320px] md:h-[360px] flex items-center justify-center mt-4">
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
                    className="absolute rounded-full -inset-1"
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
                    w-8 h-8 rounded-full flex items-center justify-center
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
                        ? "border-white"
                        : "border-white/40"
                    }
                    transition-all duration-300 transform
                    ${isExpanded ? "scale-125" : ""} 
                  `}
                  >
                    <Icon size={13} />
                  </div>

                  <div
                    className={`
                    absolute top-10 whitespace-nowrap
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
        
        {/* Carte fixe en bas - réduction significative des marges */}
        <div className="w-full mt-16 md:mt-28 mb-12 timeline-card-spacing">
          {selectedContent && (
            <ShineBorder
              borderWidth={2}
              borderRadius={12}
              duration={10}
              color={["#3ddc97", "#5ef0c1", "#a2fff3"]}
              className="w-full mx-auto max-w-3xl"
            >
              <Card 
                className="w-full bg-black/95 backdrop-blur-lg border-transparent shadow-2xl shadow-black/40 rounded-xl transition-all duration-500 overflow-hidden"
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
            </ShineBorder>
          )}
        </div>
      </div>
    </div>
  );
} 
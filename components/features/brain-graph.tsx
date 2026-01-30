"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { BrainNote } from "@/hooks/useBrain";
import * as THREE from "three";

// Dynamically import to avoid SSR issues
const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-muted-foreground animate-pulse">
      Initializing Neural Core...
    </div>
  ),
});

// --- Theme Helper ---
// Helper to detect changes in the data-theme attribute used by your ThemeToggle
function useCurrentTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // 1. Initial check
    const getTheme = () =>
      document.documentElement.getAttribute("data-theme") as "light" | "dark" || "light";
    
    setTheme(getTheme());

    // 2. Observer for changes
    const observer = new MutationObserver(() => {
      setTheme(getTheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return theme;
}

// --- Color Generator ---
// Generates a consistent pastel/neon color based on a string (tag or id)
const getNodeColor = (note: BrainNote, isDark: boolean) => {
  const str = note.tags?.[0] || note.title || "default";
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // HSL colors allow us to control brightness easily based on theme
  const hue = Math.abs(hash % 360);
  const saturation = isDark ? 80 : 70;
  const lightness = isDark ? 60 : 50;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export function BrainGraph3D({
  notes,
}: {
  notes: BrainNote[];
}) {
  const theme = useCurrentTheme();
  const fgRef = useRef<any>(null);
  const [hoveredNode, setHoveredNode] = useState<BrainNote | null>(null);
  const [selectedNode, setSelectedNode] = useState<BrainNote | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Transform Data
  const data = useMemo(() => {
    const nodes = notes.map((n) => ({ ...n, id: n.id }));
    const links: { source: string | number; target: string | number }[] = [];

    // Create links based on shared tags
    for (let i = 0; i < notes.length; i++) {
      for (let j = i + 1; j < notes.length; j++) {
        const a = notes[i];
        const b = notes[j];
        const tagsA = a.tags || [];
        const tagsB = b.tags || [];

        const intersection = tagsA.filter((t) => tagsB.includes(t));
        if (intersection.length > 0) {
          links.push({ source: a.id, target: b.id });
        }
      }
    }
    return { nodes, links };
  }, [notes]);

  const isDark = theme === "dark";

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full rounded-2xl overflow-hidden bg-surface border border-border"
    >
      {/* Dotted background overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(120,120,120,0.20) 1px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Graph sits above the dotted background */}
      <ForceGraph3D
        ref={fgRef}
        graphData={data}
        
        // --- Visuals ---
        backgroundColor="rgba(0,0,0,0)" // Transparent to let CSS background show
        showNavInfo={false}
        
        // --- Nodes (Spheres) ---
        nodeLabel="" // Disable default text tooltip
        nodeRelSize={6} // Sphere size
        nodeResolution={16} // Geometry detail
        nodeColor={(node: any) => getNodeColor(node, isDark)}
        nodeOpacity={1}
        
        // --- Edges (Lines) ---
        linkColor={() => isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)"}
        linkWidth={1}
        linkDirectionalParticleWidth={0.1}

        // --- Interaction ---
        onNodeClick={(node: any) => {
          // Animate camera
          const distance = 40;
          const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
          if (fgRef.current) {
            fgRef.current.cameraPosition(
              { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
              node,
              3000
            );
          }
          setSelectedNode(node);
          setHoveredNode(null); // Remove any hover when clicking
        }}
        onNodeHover={(node: any) => {
          document.body.style.cursor = node ? "pointer" : "auto";
          setHoveredNode(node || null);
          if (node) setSelectedNode(null); // Remove persisting tooltip if hovering any node
        }}

        // --- Physics ---
        // Slower, floaty physics closer to word embedding visualizations
        d3VelocityDecay={0.4}
        warmupTicks={100} 
        cooldownTicks={0}
      />

      {/* --- Tooltip Card (hovered has priority, else selected) --- */}
      {(hoveredNode || selectedNode) && (
        <div className="absolute top-4 right-4 z-10 w-[240px] animate-in fade-in slide-in-from-right-4 duration-200">
          <div className="p-4 rounded-xl border bg-surface/90 backdrop-blur-md shadow-xl flex flex-col gap-2 relative">
            {/* Close button if selected and not hovering */}
            {selectedNode && !hoveredNode && (
              <button
                className="absolute top-2 right-2 text-xs text-muted-foreground hover:text-foreground"
                style={{ background: "none", border: "none", cursor: "pointer" }}
                onClick={() => setSelectedNode(null)}
                tabIndex={0}
                aria-label="Close"
              >
                ×
              </button>
            )}
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold leading-tight text-foreground">
                {(hoveredNode || selectedNode)?.title}
              </h3>
            </div>
            {(hoveredNode || selectedNode)?.summary && (
              <p className="text-xs text-muted-foreground">
                {(hoveredNode || selectedNode)?.summary}
              </p>
            )}
            {(hoveredNode || selectedNode)?.file_url && (
              <>
                {/\.(jpg|jpeg|png|gif|webp)$/i.test(
                  (hoveredNode || selectedNode)?.file_name ?? (hoveredNode || selectedNode)?.file_url ?? ""
                ) ? (
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border mt-2">
                    <img
                      src={(hoveredNode || selectedNode)?.file_url || "#"}
                      alt={(hoveredNode || selectedNode)?.file_name || "Attachment"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <a
                    href={(hoveredNode || selectedNode)?.file_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-border bg-surface-solid p-2 text-xs transition hover:bg-surface-hover mt-2"
                  >
                    {/* You can use a file icon here if you want */}
                    <span className="truncate">{(hoveredNode || selectedNode)?.file_name || "Attachment"}</span>
                  </a>
                )}
              </>
            )}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {((hoveredNode || selectedNode)?.tags || []).slice(0, 3).map((tag) => (
                <span 
                  key={tag} 
                  className="px-1.5 py-0.5 rounded-md bg-accent/50 text-accent-foreground text-[10px] font-medium border border-border/50"
                >
                  #{tag}
                </span>
              ))}
              {(((hoveredNode || selectedNode)?.tags?.length || 0) > 3) && (
                <span className="text-[10px] text-muted-foreground flex items-center">
                  +{((hoveredNode || selectedNode)?.tags?.length || 0) - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Instructions Overlay */}
      <div className="absolute bottom-4 left-6 text-[10px] font-medium text-muted-foreground/60 select-none pointer-events-none">
        {notes.length} NODES • {data.links.length} CONNECTIONS
      </div>
    </div>
  );
}
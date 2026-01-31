"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { BrainNote } from "@/hooks/useBrain";
import * as THREE from "three";

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dot = 0,
    normA = 0,
    normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

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
function useCurrentTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const getTheme = () =>
      (document.documentElement.getAttribute("data-theme") as
        | "light"
        | "dark") || "light";

    setTheme(getTheme());

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
const getNodeColor = (note: BrainNote, isDark: boolean) => {
  const str = note.tags?.[0] || note.title || "default";
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash % 360);
  const saturation = isDark ? 80 : 70;
  const lightness = isDark ? 60 : 50;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export function BrainGraph3D({ notes }: { notes: BrainNote[] }) {
  const theme = useCurrentTheme();
  const fgRef = useRef<any>(null);
  const [hoveredNode, setHoveredNode] = useState<BrainNote | null>(null);
  const [selectedNode, setSelectedNode] = useState<BrainNote | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    resizeObserver.observe(containerRef.current);

    // Force header-like re-measurement when container size changes via transition
    // We can also poll or use a timeout if the transition is CSS based

    return () => resizeObserver.disconnect();
  }, []);

  // Force update when sidebar likely toggles (we don't have the prop here,
  // but the ResizeObserver SHOULD handle it. If not, the transition might be the cause).
  // Let's rely on ResizeObserver but ensure the container is compliant.

  // Control rotation state without triggering re-renders
  const isRotationActive = useRef(true);

  // 1. Transform Data
  const data = useMemo(() => {
    const nodes = notes.map((n) => ({ ...n, id: n.id }));
    const links: { source: string | number; target: string | number }[] = [];

    for (let i = 0; i < notes.length; i++) {
      for (let j = i + 1; j < notes.length; j++) {
        const a = notes[i];
        const b = notes[j];

        // Check semantic similarity of note embeddings
        if (a.embedding && b.embedding) {
          const similarity = cosineSimilarity(a.embedding, b.embedding);
          if (similarity > 0.5) {
            // Adjust threshold as needed
            links.push({ source: a.id, target: b.id });
          }
        }
      }
    }
    return { nodes, links };
  }, [notes]);

  const isDark = theme === "dark";

  // 2. Camera Rotation Logic
  useEffect(() => {
    let frameId: number;

    const rotate = () => {
      // Only rotate if the graph is loaded, we aren't hovering, and no node is selected
      if (fgRef.current && isRotationActive.current) {
        // Get current camera position
        const camera = fgRef.current.camera();
        const x = camera.position.x;
        const z = camera.position.z;

        // Convert to polar coordinates (radius and angle)
        // We use the current distance so user zoom level is preserved!
        const distance = Math.hypot(x, z);
        const angle = Math.atan2(x, z);

        // Increment angle (Speed: 0.001 is slow & smooth. 0.1 is very fast!)
        const newAngle = angle + 0.001;

        // Convert back to Cartesian
        fgRef.current.cameraPosition(
          {
            x: distance * Math.sin(newAngle),
            z: distance * Math.cos(newAngle),
          },
          null, // null = Keep looking at the current center
          0, // 0ms transition = Instant update for smooth animation loop
        );
      }

      frameId = requestAnimationFrame(rotate);
    };

    rotate();

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-lenis-prevent
      className="relative w-full h-full rounded-2xl overflow-hidden bg-surface border border-border"
      onWheel={(e) => {
        // Prevent page scroll when zooming in the graph
        if (e.target instanceof HTMLCanvasElement) {
          e.preventDefault();
        }
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(120,120,120,0.20) 1px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />
      <ForceGraph3D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={data}
        // --- Visuals ---
        backgroundColor="rgba(0,0,0,0)"
        showNavInfo={false}
        // --- Nodes ---
        nodeLabel=""
        nodeRelSize={6}
        nodeResolution={16}
        nodeColor={(node: any) => getNodeColor(node, isDark)}
        nodeOpacity={1}
        // --- Edges ---
        linkColor={() =>
          isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)"
        }
        linkWidth={1}
        linkDirectionalParticleWidth={0.1}
        // --- Interaction ---
        onNodeClick={(node: any) => {
          // 1. Move camera to node
          const distance = 40;
          const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
          if (fgRef.current) {
            fgRef.current.cameraPosition(
              {
                x: node.x * distRatio,
                y: node.y * distRatio,
                z: node.z * distRatio,
              },
              node,
              3000,
            );
          }
          // 2. Select node and Stop rotation
          setSelectedNode(node);
          setHoveredNode(null);
          isRotationActive.current = false;
        }}
        onNodeHover={(node: any) => {
          document.body.style.cursor = node ? "pointer" : "auto";
          setHoveredNode(node || null);

          // Pause rotation while hovering a node so user can click it
          if (node) {
            isRotationActive.current = false;
            // Also clear selection if just browsing
            setSelectedNode(null);
          } else {
            // Resume rotation only if no node is explicitly selected (clicked)
            if (!selectedNode) {
              isRotationActive.current = true;
            }
          }
        }}
        // --- Background Click ---
        onBackgroundClick={() => {
          setSelectedNode(null);
          setHoveredNode(null);
          isRotationActive.current = true; // Resume rotation when clicking empty space
        }}
        // --- Physics ---
        d3VelocityDecay={0.4}
        warmupTicks={100}
        cooldownTicks={0}
      />

      {/* --- Tooltip Card --- */}
      {(hoveredNode || selectedNode) && (
        <div className="absolute top-4 right-4 z-10 w-[240px] animate-in fade-in slide-in-from-right-4 duration-200">
          <div className="p-4 rounded-xl border bg-surface/90 backdrop-blur-md shadow-xl flex flex-col gap-2 relative">
            {/* Close button */}
            {selectedNode && !hoveredNode && (
              <button
                className="absolute top-2 right-2 text-xs text-muted-foreground hover:text-foreground"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedNode(null);
                  isRotationActive.current = true; // Resume rotation on close
                }}
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
            {/* File Handling Logic - Same as before */}
            {(hoveredNode || selectedNode)?.file_url && (
              <>
                {/\.(jpg|jpeg|png|gif|webp)$/i.test(
                  (hoveredNode || selectedNode)?.file_name ??
                    (hoveredNode || selectedNode)?.file_url ??
                    "",
                ) ? (
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border mt-2">
                    <img
                      src={(hoveredNode || selectedNode)?.file_url || "#"}
                      alt={
                        (hoveredNode || selectedNode)?.file_name || "Attachment"
                      }
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
                    <span className="truncate">
                      {(hoveredNode || selectedNode)?.file_name || "Attachment"}
                    </span>
                  </a>
                )}
              </>
            )}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {((hoveredNode || selectedNode)?.tags || [])
                .slice(0, 3)
                .map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 rounded-md bg-accent/50 text-accent-foreground text-[10px] font-medium border border-border/50"
                  >
                    #{tag}
                  </span>
                ))}
              {((hoveredNode || selectedNode)?.tags?.length || 0) > 3 && (
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

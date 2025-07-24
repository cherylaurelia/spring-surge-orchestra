import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useRef } from "react";

interface SpringConfig {
  k: number;
  damping: number;
  mass: number;
  connections: string;
}

interface SpringSimulationProps {
  config: SpringConfig;
  onConfigChange: (config: SpringConfig) => void;
}

export const SpringSimulation = ({ config, onConfigChange }: SpringSimulationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let t = 0;
    let position = 0;
    let velocity = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background grid
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Physics calculations - proper spring-mass system
      const dt = 0.016; // 60fps
      const omega = Math.sqrt(config.k / config.mass); // natural frequency
      const dampingRatio = config.damping / (2 * Math.sqrt(config.k * config.mass));
      
      // Calculate new position using proper spring physics
      const force = -config.k * position - config.damping * velocity;
      const acceleration = force / config.mass;
      velocity += acceleration * dt;
      position += velocity * dt;
      
      // Add small initial displacement if at rest
      if (Math.abs(position) < 0.1 && Math.abs(velocity) < 0.1 && t === 0) {
        position = 30;
      }

      if (config.connections === "series") {
        drawSeriesSprings(ctx, centerX, centerY, position);
      } else if (config.connections === "parallel") {
        drawParallelSprings(ctx, centerX, centerY, position);
      } else {
        drawNetworkSprings(ctx, centerX, centerY, position);
      }

      // Draw force vector
      drawForceVector(ctx, centerX + position, centerY, force);

      // Labels with proper physics values
      ctx.fillStyle = '#ffffff';
      ctx.font = '11px monospace';
      ctx.fillText(`F = -kx = ${force.toFixed(1)} N`, 10, 20);
      ctx.fillText(`k = ${config.k} N/m`, 10, 35);
      ctx.fillText(`ζ = ${dampingRatio.toFixed(3)} (damping ratio)`, 10, 50);
      ctx.fillText(`m = ${config.mass} kg`, 10, 65);
      ctx.fillText(`ω = ${omega.toFixed(2)} rad/s (natural freq)`, 10, 80);
      ctx.fillText(`x = ${position.toFixed(1)} cm`, 10, 95);

      t += dt;
      animationId = requestAnimationFrame(animate);
    };

    const drawSeriesSprings = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, displacement: number) => {
      // Fixed wall
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(50, centerY - 20);
      ctx.lineTo(50, centerY + 20);
      ctx.stroke();

      // First spring
      drawSpring(ctx, 50, centerX - 50 + displacement/2, centerY, '#00ff88');
      
      // Middle mass
      ctx.fillStyle = '#4488ff';
      ctx.beginPath();
      ctx.arc(centerX - 50 + displacement/2, centerY, 6, 0, Math.PI * 2);
      ctx.fill();
      
      // Second spring
      drawSpring(ctx, centerX - 50 + displacement/2, centerX + displacement, centerY, '#00ff88');
      
      // End mass (the one we're tracking)
      ctx.fillStyle = '#ff6600';
      ctx.beginPath();
      ctx.arc(centerX + displacement, centerY, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ff6600';
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    const drawParallelSprings = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, displacement: number) => {
      // Fixed wall
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(50, centerY - 30);
      ctx.lineTo(50, centerY + 30);
      ctx.stroke();

      // Top spring
      drawSpring(ctx, 50, centerX + displacement, centerY - 15, '#00ff88');
      
      // Bottom spring  
      drawSpring(ctx, 50, centerX + displacement, centerY + 15, '#00aa55');
      
      // Mass connected to both springs
      ctx.fillStyle = '#ff6600';
      ctx.beginPath();
      ctx.arc(centerX + displacement, centerY, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ff6600';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Connection lines
      ctx.strokeStyle = '#888';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX + displacement, centerY - 15);
      ctx.lineTo(centerX + displacement, centerY - 12);
      ctx.moveTo(centerX + displacement, centerY + 15);
      ctx.lineTo(centerX + displacement, centerY + 12);
      ctx.stroke();
    };

    const drawNetworkSprings = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, displacement: number) => {
      // Multiple connected springs in a network
      const positions = [
        { x: centerX + displacement * 0.8, y: centerY },
        { x: centerX + displacement * 0.4, y: centerY - 20 },
        { x: centerX + displacement * 0.4, y: centerY + 20 }
      ];
      
      // Draw connections
      positions.forEach((pos, i) => {
        if (i === 0) {
          drawSpring(ctx, 50, pos.x, pos.y, '#00ff88');
        } else {
          drawSpring(ctx, positions[0].x, pos.x, pos.y, '#00aa88');
        }
      });
      
      // Draw masses
      positions.forEach((pos, i) => {
        ctx.fillStyle = i === 0 ? '#ff6600' : '#4488ff';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, i === 0 ? 10 : 6, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawSpring = (ctx: CanvasRenderingContext2D, x1: number, x2: number, y: number, color: string) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      const length = Math.abs(x2 - x1);
      const coils = Math.max(6, Math.floor(length / 15));
      const coilWidth = 12;
      
      for (let i = 0; i <= coils * 4; i++) {
        const progress = i / (coils * 4);
        const x = x1 + progress * (x2 - x1);
        const yOffset = coilWidth * Math.sin(i * Math.PI / 2);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else if (i === coils * 4) {
          ctx.lineTo(x, y);
        } else {
          ctx.lineTo(x, y + yOffset);
        }
      }
      ctx.stroke();
    };

    const drawForceVector = (ctx: CanvasRenderingContext2D, x: number, y: number, force: number) => {
      if (Math.abs(force) < 1) return;
      
      ctx.strokeStyle = '#ff4444';
      ctx.fillStyle = '#ff4444';
      ctx.lineWidth = 2;
      
      const scale = 0.5;
      const arrowLength = force * scale;
      
      // Arrow body
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + arrowLength, y);
      ctx.stroke();
      
      // Arrow head
      if (Math.abs(arrowLength) > 5) {
        const headSize = 4;
        const direction = arrowLength > 0 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(x + arrowLength, y);
        ctx.lineTo(x + arrowLength - headSize * direction, y - headSize);
        ctx.lineTo(x + arrowLength - headSize * direction, y + headSize);
        ctx.closePath();
        ctx.fill();
      }
    };

    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [config]);

  return (
    <Card className="p-6 border-physics-green/20">
      <h2 className="text-2xl font-semibold mb-4 text-physics-green">
        Spring Dynamics Preview
      </h2>
      
      <canvas 
        ref={canvasRef}
        width={350}
        height={200}
        className="w-full border border-physics-green/30 rounded bg-black/20 mb-4"
      />
      
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Spring Constant (k): {config.k} N/m</Label>
          <Slider
            value={[config.k]}
            onValueChange={(value) => onConfigChange({ ...config, k: value[0] })}
            max={200}
            min={10}
            step={5}
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Damping: {config.damping}</Label>
          <Slider
            value={[config.damping]}
            onValueChange={(value) => onConfigChange({ ...config, damping: value[0] })}
            max={1}
            min={0}
            step={0.05}
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Mass: {config.mass} kg</Label>
          <Slider
            value={[config.mass]}
            onValueChange={(value) => onConfigChange({ ...config, mass: value[0] })}
            max={5}
            min={0.1}
            step={0.1}
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Spring Configuration</Label>
          <Select value={config.connections} onValueChange={(value) => onConfigChange({ ...config, connections: value })}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="series">Series Springs</SelectItem>
              <SelectItem value="parallel">Parallel Springs</SelectItem>
              <SelectItem value="network">Spring Network</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};
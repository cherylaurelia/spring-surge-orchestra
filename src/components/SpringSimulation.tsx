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

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background grid
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
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

      // Spring visualization
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Calculate spring displacement using Hooke's law
      const amplitude = 50;
      const frequency = config.k / 50;
      const displacement = amplitude * Math.sin(t * frequency) * Math.exp(-config.damping * t);
      
      // Draw spring
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      const springLength = 100;
      const coils = 8;
      for (let i = 0; i <= coils * 20; i++) {
        const x = centerX - springLength/2 + (i / (coils * 20)) * springLength;
        const y = centerY + 15 * Math.sin(i * 0.5) + displacement;
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw masses
      ctx.fillStyle = '#4488ff';
      ctx.beginPath();
      ctx.arc(centerX - springLength/2, centerY + displacement, 8, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(centerX + springLength/2, centerY + displacement, 8, 0, Math.PI * 2);
      ctx.fill();

      // Draw force vectors
      ctx.strokeStyle = '#ff4444';
      ctx.lineWidth = 2;
      const forceScale = displacement * 0.5;
      
      // Force on left mass
      ctx.beginPath();
      ctx.moveTo(centerX - springLength/2, centerY + displacement);
      ctx.lineTo(centerX - springLength/2 + forceScale, centerY + displacement);
      ctx.stroke();
      
      // Arrow head
      ctx.beginPath();
      ctx.moveTo(centerX - springLength/2 + forceScale, centerY + displacement);
      ctx.lineTo(centerX - springLength/2 + forceScale - 5, centerY + displacement - 3);
      ctx.lineTo(centerX - springLength/2 + forceScale - 5, centerY + displacement + 3);
      ctx.closePath();
      ctx.fill();

      // Labels
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      ctx.fillText(`F = -kx = -${config.k} × ${displacement.toFixed(2)}`, 10, 20);
      ctx.fillText(`k = ${config.k} N/m`, 10, 40);
      ctx.fillText(`damping = ${config.damping}`, 10, 60);
      ctx.fillText(`mass = ${config.mass} kg`, 10, 80);

      t += 0.02;
      animationId = requestAnimationFrame(animate);
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
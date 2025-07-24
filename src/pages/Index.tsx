import { useState } from "react";
import { PhysicsOrchestrator } from "@/components/PhysicsOrchestrator";
import { SpringSimulation } from "@/components/SpringSimulation";
import { AgentPanel } from "@/components/AgentPanel";
import { CodeGenerator } from "@/components/CodeGenerator";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<string>("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [springConfig, setSpringConfig] = useState({
    k: 50,
    damping: 0.1,
    mass: 1,
    connections: "series"
  });

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast("Please enter a physics prompt!");
      return;
    }

    setIsProcessing(true);
    setCurrentPhase("Initializing agents...");
    
    // Simulate agent orchestration pipeline
    const phases = [
      "Analyzing physics requirements...",
      "Calculating spring dynamics...",
      "Applying Hooke's law...",
      "Configuring spring network...",
      "Generating HTML/JS code...",
      "Optimizing simulation..."
    ];

    for (let i = 0; i < phases.length; i++) {
      setCurrentPhase(phases[i]);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Generate code based on prompt
    const code = generatePhysicsCode(prompt, springConfig);
    setGeneratedCode(code);
    setCurrentPhase("Simulation ready!");
    setIsProcessing(false);
    
    toast("Physics simulation generated successfully!");
  };

  const generatePhysicsCode = (prompt: string, config: any) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Spring Physics Simulation</title>
    <style>
        body { margin: 0; background: #0a0a0a; color: white; font-family: monospace; }
        canvas { border: 1px solid #333; background: #111; }
        .controls { padding: 20px; }
        .info { margin: 10px 0; }
    </style>
</head>
<body>
    <div class="controls">
        <h2>Spring Physics: ${prompt}</h2>
        <div class="info">Spring Constant (k): ${config.k} N/m</div>
        <div class="info">Damping: ${config.damping}</div>
        <div class="info">Mass: ${config.mass} kg</div>
        <div class="info">Configuration: ${config.connections}</div>
    </div>
    <canvas id="canvas" width="800" height="600"></canvas>
    
    <script>
        // Hooke's Law Implementation: F = -kx
        class Spring {
            constructor(k, restLength, damping) {
                this.k = k; // Spring constant
                this.restLength = restLength;
                this.damping = damping;
            }
            
            calculateForce(displacement, velocity) {
                const springForce = -this.k * displacement;
                const dampingForce = -this.damping * velocity;
                return springForce + dampingForce;
            }
        }
        
        class Mass {
            constructor(x, y, mass) {
                this.x = x;
                this.y = y;
                this.vx = 0;
                this.vy = 0;
                this.mass = mass;
                this.fixed = false;
            }
            
            update(dt) {
                if (!this.fixed) {
                    this.x += this.vx * dt;
                    this.y += this.vy * dt;
                }
            }
            
            applyForce(fx, fy) {
                if (!this.fixed) {
                    this.vx += fx / this.mass;
                    this.vy += fy / this.mass;
                }
            }
        }
        
        // Simulation setup
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        
        const spring = new Spring(${config.k}, 100, ${config.damping});
        const masses = [
            new Mass(200, 300, ${config.mass}),
            new Mass(400, 300, ${config.mass}),
            new Mass(600, 300, ${config.mass})
        ];
        
        masses[0].fixed = true; // Fixed anchor point
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Calculate spring forces between connected masses
            for (let i = 0; i < masses.length - 1; i++) {
                const m1 = masses[i];
                const m2 = masses[i + 1];
                
                const dx = m2.x - m1.x;
                const dy = m2.y - m1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const displacement = distance - spring.restLength;
                
                const force = spring.calculateForce(displacement, 0);
                const fx = force * dx / distance;
                const fy = force * dy / distance;
                
                m1.applyForce(fx, fy);
                m2.applyForce(-fx, -fy);
            }
            
            // Update masses
            masses.forEach(mass => mass.update(0.016));
            
            // Draw springs
            ctx.strokeStyle = '#00ff88';
            ctx.lineWidth = 2;
            for (let i = 0; i < masses.length - 1; i++) {
                ctx.beginPath();
                ctx.moveTo(masses[i].x, masses[i].y);
                ctx.lineTo(masses[i + 1].x, masses[i + 1].y);
                ctx.stroke();
            }
            
            // Draw masses
            masses.forEach((mass, i) => {
                ctx.fillStyle = mass.fixed ? '#ff4444' : '#4488ff';
                ctx.beginPath();
                ctx.arc(mass.x, mass.y, 8, 0, Math.PI * 2);
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        }
        
        animate();
    </script>
</body>
</html>`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-r from-physics-blue/10 to-physics-purple/10">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-physics-blue to-physics-purple bg-clip-text text-transparent">
            Physics Agent Orchestrator
          </h1>
          <p className="text-muted-foreground mt-2">
            AI-powered spring dynamics simulation with Hooke's law implementation
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="p-6 border-physics-blue/20">
              <h2 className="text-2xl font-semibold mb-4 text-physics-blue">
                Physics Prompt
              </h2>
              <Textarea
                placeholder="Describe your spring physics simulation... e.g., 'Create a double pendulum with springs', 'Show parallel spring system with different constants', 'Demonstrate Hooke's law with damping'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] bg-secondary/50 border-physics-blue/30"
                disabled={isProcessing}
              />
              <Button
                onClick={handleSubmit}
                disabled={isProcessing || !prompt.trim()}
                className="w-full mt-4 bg-gradient-to-r from-physics-blue to-physics-purple hover:from-physics-blue/80 hover:to-physics-purple/80"
              >
                {isProcessing ? "Processing..." : "Generate Physics Simulation"}
              </Button>
            </Card>

            <AgentPanel currentPhase={currentPhase} isProcessing={isProcessing} />
            
            <SpringSimulation 
              config={springConfig}
              onConfigChange={setSpringConfig}
            />
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <PhysicsOrchestrator 
              isActive={isProcessing}
              currentPhase={currentPhase}
            />
            
            <CodeGenerator 
              code={generatedCode}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
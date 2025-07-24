import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Agent {
  id: string;
  name: string;
  status: "idle" | "active" | "complete";
  task: string;
}

interface PhysicsOrchestratorProps {
  isActive: boolean;
  currentPhase: string;
}

export const PhysicsOrchestrator = ({ isActive, currentPhase }: PhysicsOrchestratorProps) => {
  const agents: Agent[] = [
    {
      id: "analyzer",
      name: "Physics Analyzer",
      status: isActive ? "active" : "idle",
      task: "Analyzing spring dynamics and force requirements"
    },
    {
      id: "calculator",
      name: "Dynamics Calculator", 
      status: isActive ? "active" : "idle",
      task: "Computing Hooke's law and differential equations"
    },
    {
      id: "configurator",
      name: "Spring Configurator",
      status: isActive ? "active" : "idle", 
      task: "Setting up series/parallel spring networks"
    },
    {
      id: "generator",
      name: "Code Generator",
      status: isActive ? "active" : "idle",
      task: "Generating HTML/JS simulation code"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-physics-blue";
      case "complete": return "bg-physics-green";
      default: return "bg-muted";
    }
  };

  const progress = isActive ? Math.min(90, Math.random() * 100) : 0;

  return (
    <Card className="p-6 border-physics-purple/20">
      <h2 className="text-2xl font-semibold mb-4 text-physics-purple">
        Agent Orchestrator
      </h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Pipeline Status</span>
          <Badge className={isActive ? "bg-physics-blue" : "bg-muted"}>
            {isActive ? "ACTIVE" : "IDLE"}
          </Badge>
        </div>

        {isActive && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-physics-blue">
              {currentPhase}
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="space-y-3">
          {agents.map((agent) => (
            <div key={agent.id} className="p-3 bg-secondary/30 rounded-lg border border-physics-purple/10">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{agent.name}</span>
                <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
              </div>
              <p className="text-xs text-muted-foreground">{agent.task}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-physics-blue/10 rounded-lg border border-physics-blue/20">
          <h4 className="text-sm font-semibold text-physics-blue mb-2">Active Pipeline</h4>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>• Input parsing & physics analysis</div>
            <div>• Spring constant optimization</div>
            <div>• Force calculation with Hooke's law</div>
            <div>• Network topology configuration</div>
            <div>• Real-time simulation generation</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
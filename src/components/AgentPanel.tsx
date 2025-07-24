import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";

interface AgentLog {
  id: string;
  agent: string;
  message: string;
  timestamp: string;
  type: "info" | "success" | "warning" | "error";
}

interface AgentPanelProps {
  currentPhase: string;
  isProcessing: boolean;
}

export const AgentPanel = ({ currentPhase, isProcessing }: AgentPanelProps) => {
  const [logs, setLogs] = useState<AgentLog[]>([]);

  useEffect(() => {
    if (isProcessing && currentPhase) {
      const newLog: AgentLog = {
        id: Date.now().toString(),
        agent: getAgentFromPhase(currentPhase),
        message: currentPhase,
        timestamp: new Date().toLocaleTimeString(),
        type: "info"
      };
      
      setLogs(prev => [...prev, newLog].slice(-10)); // Keep last 10 logs
    }
  }, [currentPhase, isProcessing]);

  const getAgentFromPhase = (phase: string): string => {
    if (phase.includes("Analyzing")) return "Physics Analyzer";
    if (phase.includes("Calculating")) return "Dynamics Calculator";
    if (phase.includes("Hooke")) return "Force Calculator";
    if (phase.includes("Configuring")) return "Spring Configurator";
    if (phase.includes("Generating")) return "Code Generator";
    if (phase.includes("Optimizing")) return "Optimizer";
    return "System";
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success": return "bg-physics-green text-background";
      case "warning": return "bg-physics-orange text-background";
      case "error": return "bg-physics-red text-background";
      default: return "bg-physics-blue text-background";
    }
  };

  return (
    <Card className="p-6 border-physics-orange/20">
      <h2 className="text-2xl font-semibold mb-4 text-physics-orange">
        Agent Activity Monitor
      </h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-physics-green/10 rounded-lg border border-physics-green/20">
            <div className="text-sm font-medium text-physics-green">Active Agents</div>
            <div className="text-2xl font-bold">{isProcessing ? "4" : "0"}</div>
          </div>
          <div className="p-3 bg-physics-blue/10 rounded-lg border border-physics-blue/20">
            <div className="text-sm font-medium text-physics-blue">Tasks Completed</div>
            <div className="text-2xl font-bold">{logs.length}</div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Real-time Agent Logs</h3>
          <ScrollArea className="h-48 bg-secondary/30 rounded-lg border border-physics-orange/20">
            <div className="p-4 space-y-2">
              {logs.length === 0 ? (
                <div className="text-muted-foreground text-sm">
                  No agent activity yet. Submit a prompt to begin orchestration.
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 p-2 rounded bg-background/50">
                    <Badge className={`${getTypeColor(log.type)} text-xs`}>
                      {log.agent}
                    </Badge>
                    <div className="flex-1">
                      <div className="text-sm">{log.message}</div>
                      <div className="text-xs text-muted-foreground">{log.timestamp}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="p-3 bg-physics-orange/10 rounded-lg border border-physics-orange/20">
          <h4 className="text-sm font-semibold text-physics-orange mb-2">Agent Capabilities</h4>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>• <strong>Physics Analyzer:</strong> Parses natural language for physics concepts</div>
            <div>• <strong>Dynamics Calculator:</strong> Applies Hooke's law F = -kx</div>
            <div>• <strong>Spring Configurator:</strong> Sets up series/parallel networks</div>
            <div>• <strong>Code Generator:</strong> Creates interactive HTML/JS simulations</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
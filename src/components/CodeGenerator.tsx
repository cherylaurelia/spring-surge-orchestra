import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState } from "react";

interface CodeGeneratorProps {
  code: string;
  isProcessing: boolean;
}

export const CodeGenerator = ({ code, isProcessing }: CodeGeneratorProps) => {
  const [activeTab, setActiveTab] = useState("preview");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast("Code copied to clipboard!");
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'physics_simulation.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast("Code downloaded as HTML file!");
  };

  const openInNewTab = () => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(code);
      newWindow.document.close();
    }
  };

  return (
    <Card className="p-6 border-physics-red/20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-physics-red">
          Generated Physics Code
        </h2>
        {code && (
          <div className="flex gap-2">
            <Badge className="bg-physics-green text-background">
              HTML/JS Ready
            </Badge>
          </div>
        )}
      </div>

      {isProcessing ? (
        <div className="flex items-center justify-center h-96 bg-secondary/30 rounded-lg border border-physics-red/20">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-physics-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Generating physics simulation code...</p>
          </div>
        </div>
      ) : !code ? (
        <div className="flex items-center justify-center h-96 bg-secondary/30 rounded-lg border border-physics-red/20">
          <div className="text-center">
            <div className="text-6xl text-muted-foreground mb-4">⚗️</div>
            <p className="text-muted-foreground">Submit a physics prompt to generate code</p>
          </div>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Live Preview</TabsTrigger>
            <TabsTrigger value="code">Source Code</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-4">
            <div className="border border-physics-red/30 rounded-lg overflow-hidden">
              <iframe
                srcDoc={code}
                className="w-full h-96 bg-white"
                title="Physics Simulation Preview"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={openInNewTab} className="bg-physics-red hover:bg-physics-red/80">
                Open in New Tab
              </Button>
              <Button onClick={downloadCode} variant="outline" className="border-physics-red/30">
                Download HTML
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="code" className="mt-4">
            <ScrollArea className="h-96 bg-secondary/30 rounded-lg border border-physics-red/20">
              <pre className="p-4 text-sm">
                <code className="text-physics-green">{code}</code>
              </pre>
            </ScrollArea>
            <div className="flex gap-2 mt-4">
              <Button onClick={copyToClipboard} className="bg-physics-red hover:bg-physics-red/80">
                Copy Code
              </Button>
              <Button onClick={downloadCode} variant="outline" className="border-physics-red/30">
                Download HTML
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {code && (
        <div className="mt-4 p-3 bg-physics-red/10 rounded-lg border border-physics-red/20">
          <h4 className="text-sm font-semibold text-physics-red mb-2">Code Features</h4>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>• <strong>Hooke's Law Implementation:</strong> F = -kx with proper force calculations</div>
            <div>• <strong>Real-time Animation:</strong> 60fps canvas-based physics simulation</div>
            <div>• <strong>Interactive Controls:</strong> Adjustable spring constants and damping</div>
            <div>• <strong>Visual Force Vectors:</strong> Real-time force visualization</div>
            <div>• <strong>Series/Parallel Support:</strong> Multiple spring configurations</div>
          </div>
        </div>
      )}
    </Card>
  );
};
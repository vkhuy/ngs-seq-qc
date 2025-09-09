import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, CheckCircle, Terminal } from "lucide-react";
import { apiClient } from "@/lib/api";

interface BackendStatusProps {
  className?: string;
}

const BackendStatus = ({ className }: BackendStatusProps) => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkBackendHealth = async () => {
    setIsChecking(true);
    try {
      await apiClient.checkHealth();
      setIsOnline(true);
    } catch (error) {
      setIsOnline(false);
    } finally {
      setIsChecking(false);
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    checkBackendHealth();
    
    // Check backend health every 30 seconds
    const interval = setInterval(checkBackendHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isOnline === null) {
    return (
      <Alert className={className}>
        <RefreshCw className="h-4 w-4 animate-spin" />
        <AlertDescription>
          Checking backend server connection...
        </AlertDescription>
      </Alert>
    );
  }

  if (isOnline) {
    return (
      <Alert className={`border-green-200 bg-green-50 ${className || ''}`}>
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Backend server is online.</strong> Ready to process your FASTQ files.
          {lastChecked && (
            <span className="text-xs text-green-600 ml-2">
              (Last checked: {lastChecked.toLocaleTimeString()})
            </span>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className={`border-red-200 bg-red-50 ${className || ''}`}>
      <AlertTriangle className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-800">
        <strong>Backend server is not running.</strong> File uploads will fail until the backend is started.
        <div className="mt-3 space-y-2">
          <div className="text-sm">
            <strong>To fix this issue:</strong>
          </div>
          <div className="text-sm space-y-1">
            <div className="flex items-center gap-2">
              <Terminal className="h-3 w-3" />
              <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">npm run dev:backend</code>
              <span className="text-xs">- Start backend only</span>
            </div>
            <div className="flex items-center gap-2">
              <Terminal className="h-3 w-3" />
              <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">npm run dev:fullstack</code>
              <span className="text-xs">- Start both frontend & backend</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={checkBackendHealth}
              disabled={isChecking}
              className="text-xs"
            >
              {isChecking ? (
                <>
                  <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                  Checking...
                </>
              ) : (
                <>
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Check Again
                </>
              )}
            </Button>
            {lastChecked && (
              <span className="text-xs text-red-600">
                Last checked: {lastChecked.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default BackendStatus;
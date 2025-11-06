"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface InputBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string;
}

export function InputBox({ value, onChange, onSubmit, loading, error }: InputBoxProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      onSubmit();
    }
  };

  return (
    <Card className="p-6 shadow-lg">
      <div className="space-y-4">
        <div className="flex gap-3">
          <Input
            type="url"
            placeholder="Paste YouTube video URL here..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="flex-1"
          />
          <Button
            onClick={onSubmit}
            disabled={loading || !value.trim()}
            className="px-8"
          >
            {loading ? "Processing..." : "Summarize"}
          </Button>
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    </Card>
  );
}

"use client";

import { useTheme } from "next-themes";
import { Switch } from "./ui/Switch";
import { Label } from "./ui/Label";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function DarkModeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="dark-mode"
        checked={theme === "dark"}
        defaultChecked={true}
        onCheckedChange={() => {
          theme === "dark" ? setTheme("light") : setTheme("dark");
        }}
      />
      <Label htmlFor="dark-mode" className="relative flex items-center">
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        <span className="sr-only">Toggle theme</span>
      </Label>
    </div>
  );
}

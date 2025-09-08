import { UserButton } from "@clerk/clerk-react";
import { ArrowLeft, Palette, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { toast } from "sonner";

export default function SettingsView() {
  const navigate = useNavigate();

  const { theme, setTheme } = useTheme();

  const colorThemes = [
    { value: "blue", label: "Blue", color: "bg-blue-600" },
    { value: "green", label: "Green", color: "bg-green-600" },
    { value: "purple", label: "Purple", color: "bg-purple-600" },
    { value: "orange", label: "Orange", color: "bg-orange-600" },
    { value: "red", label: "Red", color: "bg-red-600" },
    { value: "pink", label: "Pink", color: "bg-pink-600" },
    { value: "teal", label: "Teal", color: "bg-teal-600" },
    { value: "yellow", label: "Yellow", color: "bg-yellow-500" },
    { value: "indigo", label: "Indigo", color: "bg-indigo-600" },
    { value: "cyan", label: "Cyan", color: "bg-cyan-600" },
    { value: "slate", label: "Slate", color: "bg-slate-600" },
  ];

  const fontThemes = [
    { value: "inter", label: "Inter", className: "font-sans" },
    { value: "roboto", label: "Roboto", className: "font-sans" },
    { value: "poppins", label: "Poppins", className: "font-sans" },
    { value: "geist", label: "Geist", className: "font-geist" },
    { value: "catamaran", label: "Catamaran", className: "font-catamaran" },
    { value: "mono", label: "Monospace", className: "font-mono" },
  ];

  const handleColorThemeChange = async (value) => {
    try {
      await setTheme({ colorTheme: value });
      toast.success("Color theme updated");
    } catch {
      toast.error("Failed to update theme");
    }
  };

  const handleFontThemeChange = async (value) => {
    try {
      await setTheme({ fontTheme: value });
      toast.success("Font theme updated");
    } catch {
      toast.error("Failed to update theme");
    }
  };

  return (
    <div className="h-screen bg-white overflow-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2 text-gray-700"
            >
              <ArrowLeft className="size-4" />
              Go Back
            </Button>
            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          </div>

          <UserButton />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-2xl">
        <div className="space-y-6">
          {/* User profile */}

          {/* Color theme */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Color Theme
              </CardTitle>
              <CardDescription>
                Choose your preferred color scheme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={theme.colorTheme}
                onValueChange={handleColorThemeChange}
                className="grid grid-cols-2 gap-4"
              >
                {colorThemes.map((colorTheme) => (
                  <div
                    key={colorTheme.value}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      value={colorTheme.value}
                      id={`color-${colorTheme.value}`}
                    />
                    <Label
                      htmlFor={`color-${colorTheme.value}`}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div className={`w-4 h-4 rounded ${colorTheme.color}`} />
                      {colorTheme.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Font theme */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="w-5 h-5" />
                Font Theme
              </CardTitle>
              <CardDescription>
                Choose your preferred font family
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={theme.fontTheme}
                onValueChange={handleFontThemeChange}
                className="grid grid-cols-2 gap-4"
              >
                {fontThemes.map((fontTheme) => (
                  <div
                    key={fontTheme.value}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      value={fontTheme.value}
                      id={`font-${fontTheme.value}`}
                    />
                    <Label
                      htmlFor={`font-${fontTheme.value}`}
                      className={`cursor-pointer ${fontTheme.className}`}
                    >
                      {fontTheme.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

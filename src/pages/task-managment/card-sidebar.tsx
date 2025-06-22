import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Archive,
  CheckCircle,
  Clock,
  ListChecks,
  Palette,
  Share2,
  Users,
} from "lucide-react";
import type React from "react";

interface Label {
  id: string;
  text: string;
  color: string;
}

interface SidebarButtonProps {
  icon: React.ElementType;
  label: string;
  badgeText?: string;
  badgeVariant?: "solid" | "faded" | "flat" | "shadow";
  onClick?: () => void;
  disabled?: boolean;
}

const SidebarButton = ({
  icon: Icon,
  label,
  badgeText,
  badgeVariant,
  onClick,
  disabled,
}: SidebarButtonProps) => (
  <Button
    className="w-full justify-start space-x-2"
    onClick={onClick}
    disabled={disabled}
  >
    <Icon className="h-4 w-4" />
    <span>{label}</span>
    {badgeText && (
      <Badge
        variant={badgeVariant === "flat" ? "default" : "secondary"}
        className={cn(
          badgeVariant === "flat"
            ? "bg-purple-600 text-white ml-auto"
            : "ml-auto",
          "py-0.5",
        )}
      >
        {badgeText}
      </Badge>
    )}
  </Button>
);

interface TrelloCardSidebarProps {
  onAddLabelClick?: () => void; 
  availableLabels: Label[];
  selectedLabels: Label[];
  onToggleLabel: (label: Label) => void;
  onAddChecklist: () => void;
  hasChecklist: boolean;
}

export function CardSidebar({
  availableLabels,
  selectedLabels,
  onToggleLabel,
  onAddChecklist,
  hasChecklist,
}: TrelloCardSidebarProps) {
  return (
    <div className="space-y-2">
      <p className="font-semibold  px-2">Kartaga qo'shish</p>
      <SidebarButton icon={Users} label="Members" />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="default" className="w-full justify-start space-x-2">
            <Palette className="h-4 w-4" />
            <span>Yorliqlar</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-0 ">
          <div className="pt-2 text-center  font-medium ">
            Yorliqlar
          </div>
          <div className="p-2 space-y-1 max-h-60 overflow-y-auto  w-full ">
            {availableLabels.map((label) => {
              const isSelected = selectedLabels.some(
                (sl) => sl.id === label.id,
              );
              return (
                <div
                  key={label.id}
                  className="flex items-center space-x-2 cursor-pointer p-1 w-full"
                  onClick={() => onToggleLabel(label)}
                >
                  <div
                    className={cn(
                      "w-full h-8 rounded-md flex items-center px-2",
                      label.color,
                      "hover:opacity-80 transition-opacity",
                    )}
                  >
                    <span className="text-sm text-white font-medium">
                      {label.text}
                    </span>
                  </div>
                  {isSelected && (
                    <CheckCircle className="h-5 w-5 text-slate-100 ml-auto absolute right-3" />
                  )}
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
      <SidebarButton
        icon={ListChecks}
        label="Checklist"
        onClick={onAddChecklist}
        disabled={hasChecklist}
      />
      <SidebarButton icon={Clock} label="Dates" />{" "}
      <SidebarButton icon={Archive} label="Archive" />
      <SidebarButton icon={Share2} label="Share" />
    </div>
  );
}

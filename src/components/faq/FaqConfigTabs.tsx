import { useState, type FC } from "react";
import {
  Plus,
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp,
  Sparkles,
  MoveUp,
  MoveDown,
  LayoutGrid,
  FileText,
  Palette,
  Sliders,
  Search,
  Tag,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Columns,
  Grid,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaqTemplateGallery } from "./FaqTemplateGallery";
import type { FaqWidgetConfig, FaqItem, FaqTemplateId } from "@/lib/faq/types";
import { FAQ_TEMPLATES, type FaqTemplateDefinition } from "@/lib/faq/templates";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export type FaqEditorTab = "templates" | "content" | "layout" | "settings";

interface FaqConfigTabsProps {
  config: FaqWidgetConfig;
  onChange: <K extends keyof FaqWidgetConfig>(key: K, value: FaqWidgetConfig[K]) => void;
  onSelectTemplate: (template: FaqTemplateDefinition) => void;
  errors: Record<string, string>;
  onPublish: () => void;
  isPublishing: boolean;
  onCancel: () => void;
  initialTab?: FaqEditorTab;
  activeTab?: FaqEditorTab;
  onTabChange?: (tab: FaqEditorTab) => void;
}

const COLOR_PRESETS = [
  { name: "Studio Purple", accent: "#7c3aed", bg: "#ffffff", card: "#ffffff", text: "#0f172a" },
  { name: "Ocean Blue", accent: "#2563eb", bg: "#ffffff", card: "#f8fafc", text: "#0f172a" },
  { name: "Emerald", accent: "#059669", bg: "#ffffff", card: "#f0fdf4", text: "#0f172a" },
  { name: "Sunset Amber", accent: "#d97706", bg: "#ffffff", card: "#fffbeb", text: "#0f172a" },
  { name: "Rose Pink", accent: "#e11d48", bg: "#ffffff", card: "#fff1f2", text: "#0f172a" },
  { name: "Midnight Dark", accent: "#a855f7", bg: "#0f172a", card: "#1e293b", text: "#f8fafc" },
];

export const FaqConfigTabs: FC<FaqConfigTabsProps> = ({
  config,
  onChange,
  onSelectTemplate,
  errors,
  onPublish,
  isPublishing,
  onCancel,
  initialTab = "templates",
  activeTab: activeTabProp,
  onTabChange,
}) => {
  const [internalTab, setInternalTab] = useState<FaqEditorTab>(initialTab);
  const activeTab = activeTabProp ?? internalTab;
  const setActiveTab = (tab: FaqEditorTab) => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };
  const [expandedItemId, setExpandedItemId] = useState<string | null>(
    config.items[0]?.id || null
  );
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  // FAQ Items Handlers
  const handleAddItem = () => {
    const newId = `faq_${Date.now()}`;
    const newItem: FaqItem = {
      id: newId,
      question: "New question",
      answer: "",
      category: config.categories.find((c) => c !== "All") || "General",
    };
    onChange("items", [...config.items, newItem]);
    setExpandedItemId(newId);
    setNewlyAddedId(newId);

    // Auto-scroll, auto-expand, move keyboard focus, and highlight
    setTimeout(() => {
      const cardEl = document.getElementById(`faq-card-${newId}`);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      const inputEl = document.getElementById(
        `faq-input-question-${newId}`
      ) as HTMLInputElement | null;
      if (inputEl) {
        inputEl.focus();
        inputEl.select();
      }
    }, 120);

    setTimeout(() => {
      setNewlyAddedId((curr) => (curr === newId ? null : curr));
    }, 1600);
  };

  const handleUpdateItem = (id: string, updates: Partial<FaqItem>) => {
    const updated = config.items.map((it) => (it.id === id ? { ...it, ...updates } : it));
    onChange("items", updated);
  };

  const handleDeleteItem = (id: string) => {
    if (config.items.length <= 1) return;
    const filtered = config.items.filter((it) => it.id !== id);
    onChange("items", filtered);
    if (expandedItemId === id) {
      setExpandedItemId(filtered[0]?.id || null);
    }
  };

  const handleDuplicateItem = (item: FaqItem) => {
    const newId = `faq_${Date.now()}`;
    const duplicated: FaqItem = {
      ...item,
      id: newId,
      question: `${item.question} (Copy)`,
    };
    const index = config.items.findIndex((it) => it.id === item.id);
    const newItems = [...config.items];
    newItems.splice(index + 1, 0, duplicated);
    onChange("items", newItems);
    setExpandedItemId(newId);
  };

  const handleMoveItem = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= config.items.length) return;
    const newItems = [...config.items];
    const [moved] = newItems.splice(index, 1);
    if (moved) {
      newItems.splice(targetIdx, 0, moved);
      onChange("items", newItems);
    }
  };

  // Category Management Handlers
  const handleAddCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed || config.categories.includes(trimmed)) return;
    onChange("categories", [...config.categories, trimmed]);
    setNewCategoryName("");
  };

  const handleDeleteCategory = (cat: string) => {
    if (cat === "All" || config.categories.length <= 2) return;
    onChange(
      "categories",
      config.categories.filter((c) => c !== cat)
    );
    // Unassign deleted category from items
    const updatedItems = config.items.map((it) =>
      it.category === cat ? { ...it, category: undefined } : it
    );
    onChange("items", updatedItems);
  };

  const handleApplyPreset = (preset: (typeof COLOR_PRESETS)[0]) => {
    onChange("accentColor", preset.accent);
    onChange("bgColor", preset.bg);
    onChange("cardBgColor", preset.card);
    onChange("questionColor", preset.text);
    onChange("answerColor", preset.text);
    onChange("iconColor", preset.accent);
  };

  return (
    <div className="flex h-full flex-col bg-card rounded-2xl border border-border/70 shadow-xs overflow-hidden">
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as FaqEditorTab)}
        className="flex h-full flex-col min-h-0"
      >
        {/* 4 Clean Tabs: Templates, Content, Layout, Settings */}
        <div className="border-b border-border/70 bg-muted/40 px-3 py-2 shrink-0">
          <TabsList className="grid w-full grid-cols-4 bg-muted/70 p-1">
            <TabsTrigger
              value="templates"
              className="flex items-center gap-1.5 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs"
            >
              <LayoutGrid className="h-3.5 w-3.5 text-purple-600" />
              <span>Templates</span>
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="flex items-center gap-1.5 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs"
            >
              <FileText className="h-3.5 w-3.5 text-blue-600" />
              <span>Content</span>
            </TabsTrigger>
            <TabsTrigger
              value="layout"
              className="flex items-center gap-1.5 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs"
            >
              <Palette className="h-3.5 w-3.5 text-emerald-600" />
              <span>Layout</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center gap-1.5 text-xs font-semibold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs"
            >
              <Sliders className="h-3.5 w-3.5 text-amber-600" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Templates */}
        <TabsContent
          value="templates"
          className="m-0 flex-1 min-h-0 flex flex-col focus-visible:outline-hidden"
        >
          <FaqTemplateGallery
            selectedTemplate={config.template}
            onSelectTemplate={onSelectTemplate}
            onConfirmTemplate={(template) => {
              onSelectTemplate(template);
              setActiveTab("content");
              toast.success(`Selected ${template.name}`, {
                description: "Ready to customize questions and header content.",
              });
            }}
          />
        </TabsContent>

        {/* Tab 2: Content (Dedicated exclusively to FAQ content) */}
        <TabsContent
          value="content"
          className="m-0 flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin focus-visible:outline-hidden"
        >
          {/* Section: Header Content */}
          <div className="rounded-xl border border-border/70 bg-card p-3.5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between border-b border-border/50 pb-2">
              <span className="text-xs font-bold text-foreground">Header & Description</span>
              <span className="text-[10px] text-muted-foreground">Title details</span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="faq-heading" className="text-[11px] font-semibold text-muted-foreground">
                  FAQ Heading *
                </Label>
                <Input
                  id="faq-heading"
                  value={config.heading}
                  onChange={(e) => onChange("heading", e.target.value)}
                  placeholder="Frequently Asked Questions"
                  className="h-8.5 text-xs font-semibold"
                />
                {errors["heading"] && (
                  <p className="text-[10px] text-destructive">{errors["heading"]}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="faq-sub" className="text-[11px] font-semibold text-muted-foreground">
                  Subtitle / Description (optional)
                </Label>
                <Input
                  id="faq-sub"
                  value={config.subtitle}
                  onChange={(e) => onChange("subtitle", e.target.value)}
                  placeholder="Find quick answers to common questions about our products."
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="faq-intro" className="text-[11px] font-semibold text-muted-foreground">
                  Introductory Note (optional)
                </Label>
                <Textarea
                  id="faq-intro"
                  value={config.introText}
                  onChange={(e) => onChange("introText", e.target.value)}
                  placeholder="Have more questions? Contact our 24/7 customer support."
                  rows={2}
                  className="text-xs resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section: FAQ Questions (Sticky toolbar ensures Add Question is always accessible) */}
          <div className="space-y-3 relative">
            {/* Sticky Header Toolbar */}
            <div className="sticky top-0 z-20 flex items-center justify-between bg-card/95 backdrop-blur-xs py-2.5 px-3 border-y border-border/70 -mx-4 shadow-2xs">
              <div>
                <h3 className="text-xs font-bold text-foreground">
                  FAQ Questions ({config.items.length})
                </h3>
                <p className="text-[10px] text-muted-foreground">
                  Add, edit, reorder, or duplicate questions.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={handleAddItem}
                className="h-7.5 px-3 text-xs bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5 shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Question</span>
              </Button>
            </div>

            {errors["items"] && (
              <p className="text-[11px] text-destructive px-1">{errors["items"]}</p>
            )}

            {/* Questions List */}
            <div className="space-y-2 pt-1">
              {config.items.map((item, idx) => {
                const isExpanded = expandedItemId === item.id;
                const isNewlyAdded = newlyAddedId === item.id;
                const itemErrQuestion = errors[`item_${item.id}_question`];
                const itemErrAnswer = errors[`item_${item.id}_answer`];

                return (
                  <div
                    key={item.id}
                    id={`faq-card-${item.id}`}
                    className={cn(
                      "rounded-xl border bg-card transition-all duration-300",
                      isNewlyAdded
                        ? "border-purple-500 ring-2 ring-purple-500/60 bg-purple-500/5 shadow-md"
                        : isExpanded
                        ? "border-purple-500/40 shadow-xs"
                        : "border-border/70 hover:border-border"
                    )}
                  >
                    {/* Collapsed Header Bar */}
                    <div
                      className={cn(
                        "flex items-center justify-between p-2.5 cursor-pointer select-none rounded-t-xl transition-colors",
                        isExpanded ? "bg-muted/40 border-b border-border/50" : "hover:bg-muted/30"
                      )}
                      onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                        {/* Reorder Buttons */}
                        <div
                          className="flex flex-col shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            aria-label="Move question up"
                            disabled={idx === 0}
                            onClick={() => handleMoveItem(idx, "up")}
                            className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"
                          >
                            <ChevronUp className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            aria-label="Move question down"
                            disabled={idx === config.items.length - 1}
                            onClick={() => handleMoveItem(idx, "down")}
                            className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors"
                          >
                            <ChevronDown className="h-3 w-3" />
                          </button>
                        </div>

                        <span className="shrink-0 text-[10px] font-bold text-muted-foreground w-4">
                          #{idx + 1}
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-foreground truncate">
                            {item.question || "Untitled Question"}
                          </p>
                          {item.category && item.category !== "All" && (
                            <span className="inline-block mt-0.5 rounded bg-purple-500/10 px-1.5 py-0.2 text-[9px] font-medium text-purple-700 dark:text-purple-300">
                              {item.category}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Header Actions */}
                      <div
                        className="flex items-center gap-1 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          aria-label="Duplicate question"
                          onClick={() => handleDuplicateItem(item)}
                          className="h-6 w-6 grid place-items-center rounded text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          aria-label="Delete question"
                          disabled={config.items.length <= 1}
                          onClick={() => handleDeleteItem(item.id)}
                          className="h-6 w-6 grid place-items-center rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-30 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          aria-label={isExpanded ? "Collapse item" : "Expand item"}
                          onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                          className="h-6 w-6 grid place-items-center rounded text-muted-foreground hover:text-foreground transition-colors ml-0.5"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Content Fields */}
                    {isExpanded && (
                      <div className="p-3.5 space-y-3 bg-card/60 rounded-b-xl animate-in slide-in-from-top-1 duration-150">
                        <div className="space-y-1">
                          <Label
                            htmlFor={`faq-input-question-${item.id}`}
                            className="text-[11px] font-semibold text-muted-foreground"
                          >
                            Question *
                          </Label>
                          <Input
                            id={`faq-input-question-${item.id}`}
                            value={item.question}
                            onChange={(e) =>
                              handleUpdateItem(item.id, { question: e.target.value })
                            }
                            placeholder="e.g. What is your refund policy?"
                            className="h-8.5 text-xs font-medium"
                          />
                          {itemErrQuestion && (
                            <p className="text-[10px] text-destructive">{itemErrQuestion}</p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <Label
                            htmlFor={`faq-input-answer-${item.id}`}
                            className="text-[11px] font-semibold text-muted-foreground"
                          >
                            Answer *
                          </Label>
                          <Textarea
                            id={`faq-input-answer-${item.id}`}
                            value={item.answer}
                            onChange={(e) =>
                              handleUpdateItem(item.id, { answer: e.target.value })
                            }
                            placeholder="Provide a clear, helpful response..."
                            rows={3}
                            className="text-xs resize-y"
                          />
                          {itemErrAnswer && (
                            <p className="text-[10px] text-destructive">{itemErrAnswer}</p>
                          )}
                        </div>

                        {/* Optional Meta: Category & Badge */}
                        <div className="grid grid-cols-2 gap-2.5 pt-1 border-t border-border/40">
                          <div className="space-y-1">
                            <Label className="text-[10px] font-medium text-muted-foreground">
                              Category
                            </Label>
                            <Select
                              value={item.category || "General"}
                              onValueChange={(val) =>
                                handleUpdateItem(item.id, {
                                  category: val === "None" ? undefined : val,
                                })
                              }
                            >
                              <SelectTrigger className="h-7 text-xs bg-background">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="None">None</SelectItem>
                                {config.categories
                                  .filter((c) => c !== "All")
                                  .map((c) => (
                                    <SelectItem key={c} value={c}>
                                      {c}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1">
                            <Label
                              htmlFor={`faq-input-badge-${item.id}`}
                              className="text-[10px] font-medium text-muted-foreground"
                            >
                              Badge (optional)
                            </Label>
                            <Input
                              id={`faq-input-badge-${item.id}`}
                              value={item.badge || ""}
                              onChange={(e) =>
                                handleUpdateItem(item.id, {
                                  badge: e.target.value || undefined,
                                })
                              }
                              placeholder="e.g. Popular, New"
                              className="h-7 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Layout (Structure, sizing, presets, colors & borders) */}
        <TabsContent
          value="layout"
          className="m-0 flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin focus-visible:outline-hidden"
        >
          {/* Quick Color Presets */}
          <div className="rounded-xl border border-border/70 bg-card p-3.5 space-y-2.5 shadow-2xs">
            <span className="text-xs font-bold text-foreground">Color Themes</span>
            <div className="grid grid-cols-3 gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="flex items-center gap-2 rounded-lg border border-border/60 p-2 text-left hover:border-border hover:bg-muted/40 transition-colors"
                >
                  <span
                    className="h-4 w-4 rounded-full border border-black/10 shrink-0 shadow-2xs"
                    style={{ backgroundColor: preset.accent }}
                  />
                  <span className="text-[11px] font-medium text-foreground truncate">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Sizing & Columns */}
          <div className="rounded-xl border border-border/70 bg-card p-3.5 space-y-3.5 shadow-2xs">
            <span className="text-xs font-bold text-foreground">Layout & Grid</span>

            <div className="space-y-2">
              <Label className="text-[11px] font-semibold text-muted-foreground">
                Columns Display
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={config.columns === 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => onChange("columns", 1)}
                  className={cn(
                    "h-8 text-xs font-medium justify-center gap-1.5",
                    config.columns === 1 && "bg-purple-600 hover:bg-purple-700 text-white"
                  )}
                >
                  <Columns className="h-3.5 w-3.5" />
                  1 Column
                </Button>
                <Button
                  type="button"
                  variant={config.columns === 2 ? "default" : "outline"}
                  size="sm"
                  onClick={() => onChange("columns", 2)}
                  className={cn(
                    "h-8 text-xs font-medium justify-center gap-1.5",
                    config.columns === 2 && "bg-purple-600 hover:bg-purple-700 text-white"
                  )}
                >
                  <Grid className="h-3.5 w-3.5" />
                  2 Columns
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-[11px] font-semibold text-muted-foreground">
                  Max Container Width
                </Label>
                <span className="text-xs font-bold font-mono text-foreground">
                  {config.maxWidth}px
                </span>
              </div>
              <Slider
                value={[config.maxWidth]}
                min={320}
                max={1100}
                step={20}
                onValueChange={([val]) => val && onChange("maxWidth", val)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-semibold text-muted-foreground">
                Content Alignment
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={config.alignment === "left" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onChange("alignment", "left")}
                  className={cn(
                    "h-8 text-xs font-medium justify-center gap-1.5",
                    config.alignment === "left" && "bg-purple-600 hover:bg-purple-700 text-white"
                  )}
                >
                  <AlignLeft className="h-3.5 w-3.5" />
                  Left
                </Button>
                <Button
                  type="button"
                  variant={config.alignment === "center" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onChange("alignment", "center")}
                  className={cn(
                    "h-8 text-xs font-medium justify-center gap-1.5",
                    config.alignment === "center" && "bg-purple-600 hover:bg-purple-700 text-white"
                  )}
                >
                  <AlignCenter className="h-3.5 w-3.5" />
                  Center
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-semibold text-muted-foreground">
                Content Density
              </Label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["compact", "comfortable", "spacious"] as const).map((density) => (
                  <Button
                    key={density}
                    type="button"
                    variant={config.density === density ? "default" : "outline"}
                    size="sm"
                    onClick={() => onChange("density", density)}
                    className={cn(
                      "h-7 text-[11px] font-medium capitalize",
                      config.density === density &&
                        "bg-purple-600 hover:bg-purple-700 text-white"
                    )}
                  >
                    {density}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-[11px] font-semibold text-muted-foreground">
                  Item Spacing / Gap
                </Label>
                <span className="text-xs font-mono font-bold text-foreground">
                  {config.itemGap}px
                </span>
              </div>
              <Slider
                value={[config.itemGap]}
                min={0}
                max={24}
                step={2}
                onValueChange={([val]) => val !== undefined && onChange("itemGap", val)}
              />
            </div>
          </div>

          {/* Color Details */}
          <div className="rounded-xl border border-border/70 bg-card p-3.5 space-y-3 shadow-2xs">
            <span className="text-xs font-bold text-foreground">Color Customization</span>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[10px] font-medium text-muted-foreground">Accent Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.accentColor}
                    onChange={(e) => onChange("accentColor", e.target.value)}
                    className="h-7 w-7 rounded cursor-pointer border border-border shrink-0"
                  />
                  <Input
                    value={config.accentColor}
                    onChange={(e) => onChange("accentColor", e.target.value)}
                    className="h-7 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] font-medium text-muted-foreground">Card Background</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.cardBgColor}
                    onChange={(e) => onChange("cardBgColor", e.target.value)}
                    className="h-7 w-7 rounded cursor-pointer border border-border shrink-0"
                  />
                  <Input
                    value={config.cardBgColor}
                    onChange={(e) => onChange("cardBgColor", e.target.value)}
                    className="h-7 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] font-medium text-muted-foreground">Question Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.questionColor}
                    onChange={(e) => onChange("questionColor", e.target.value)}
                    className="h-7 w-7 rounded cursor-pointer border border-border shrink-0"
                  />
                  <Input
                    value={config.questionColor}
                    onChange={(e) => onChange("questionColor", e.target.value)}
                    className="h-7 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] font-medium text-muted-foreground">Answer Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.answerColor}
                    onChange={(e) => onChange("answerColor", e.target.value)}
                    className="h-7 w-7 rounded cursor-pointer border border-border shrink-0"
                  />
                  <Input
                    value={config.answerColor}
                    onChange={(e) => onChange("answerColor", e.target.value)}
                    className="h-7 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Borders & Shadows */}
          <div className="rounded-xl border border-border/70 bg-card p-3.5 space-y-3.5 shadow-2xs">
            <span className="text-xs font-bold text-foreground">Borders & Styling</span>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-[11px] font-semibold text-muted-foreground">
                  Corner Radius
                </Label>
                <span className="text-xs font-mono font-bold text-foreground">
                  {config.borderRadius}px
                </span>
              </div>
              <Slider
                value={[config.borderRadius]}
                min={0}
                max={28}
                step={2}
                onValueChange={([val]) => val !== undefined && onChange("borderRadius", val)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-semibold text-muted-foreground">
                Expand Icon Style
              </Label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["chevron", "plus-minus", "arrow"] as const).map((st) => (
                  <Button
                    key={st}
                    type="button"
                    variant={config.iconStyle === st ? "default" : "outline"}
                    size="sm"
                    onClick={() => onChange("iconStyle", st)}
                    className={cn(
                      "h-7 text-[11px] font-medium capitalize",
                      config.iconStyle === st &&
                        "bg-purple-600 hover:bg-purple-700 text-white"
                    )}
                  >
                    {st}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-semibold text-muted-foreground">
                Card Shadow
              </Label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["none", "subtle", "medium"] as const).map((sh) => (
                  <Button
                    key={sh}
                    type="button"
                    variant={config.shadow === sh ? "default" : "outline"}
                    size="sm"
                    onClick={() => onChange("shadow", sh)}
                    className={cn(
                      "h-7 text-[11px] font-medium capitalize",
                      config.shadow === sh && "bg-purple-600 hover:bg-purple-700 text-white"
                    )}
                  >
                    {sh}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-border/40">
              <Label
                htmlFor="faq-outer-border"
                className="text-[11px] font-semibold text-muted-foreground"
              >
                Show Card Border
              </Label>
              <Switch
                id="faq-outer-border"
                checked={config.showOuterBorder}
                onCheckedChange={(checked) => onChange("showOuterBorder", checked)}
              />
            </div>
          </div>
        </TabsContent>

        {/* Tab 4: Settings (Accordion behavior, Search, Categories, Header toggle) */}
        <TabsContent
          value="settings"
          className="m-0 flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin focus-visible:outline-hidden"
        >
          {/* Accordion Behavior */}
          <div className="rounded-xl border border-border/70 bg-card p-3.5 space-y-3.5 shadow-2xs">
            <span className="text-xs font-bold text-foreground">Accordion Behavior</span>

            <div className="space-y-2">
              <Label className="text-[11px] font-semibold text-muted-foreground">
                Expand Mode
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={config.accordionMode === "single" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onChange("accordionMode", "single")}
                  className={cn(
                    "h-8 text-xs font-medium justify-center",
                    config.accordionMode === "single" &&
                      "bg-purple-600 hover:bg-purple-700 text-white"
                  )}
                >
                  Single Open
                </Button>
                <Button
                  type="button"
                  variant={config.accordionMode === "multiple" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onChange("accordionMode", "multiple")}
                  className={cn(
                    "h-8 text-xs font-medium justify-center",
                    config.accordionMode === "multiple" &&
                      "bg-purple-600 hover:bg-purple-700 text-white"
                  )}
                >
                  Multiple Open
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <Label
                htmlFor="faq-open-first"
                className="text-[11px] font-semibold text-muted-foreground"
              >
                Open First Question by Default
              </Label>
              <Switch
                id="faq-open-first"
                checked={config.openFirstByDefault}
                onCheckedChange={(checked) => onChange("openFirstByDefault", checked)}
              />
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-border/40">
              <Label
                htmlFor="faq-collapsible"
                className="text-[11px] font-semibold text-muted-foreground"
              >
                Allow Collapsing All Questions
              </Label>
              <Switch
                id="faq-collapsible"
                checked={config.collapsible}
                onCheckedChange={(checked) => onChange("collapsible", checked)}
              />
            </div>
          </div>

          {/* Search Bar Settings */}
          <div className="rounded-xl border border-border/70 bg-card p-3.5 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-purple-600" />
                <span className="text-xs font-bold text-foreground">Live Search Filter</span>
              </div>
              <Switch
                checked={config.enableSearch}
                onCheckedChange={(checked) => onChange("enableSearch", checked)}
              />
            </div>

            {config.enableSearch && (
              <div className="space-y-3 pt-1 border-t border-border/50">
                <div className="space-y-1">
                  <Label
                    htmlFor="faq-search-holder"
                    className="text-[11px] font-semibold text-muted-foreground"
                  >
                    Search Placeholder
                  </Label>
                  <Input
                    id="faq-search-holder"
                    value={config.searchPlaceholder}
                    onChange={(e) => onChange("searchPlaceholder", e.target.value)}
                    placeholder="Search questions..."
                    className="h-8 text-xs"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="faq-case-search"
                    className="text-[11px] font-semibold text-muted-foreground"
                  >
                    Case-Insensitive Search
                  </Label>
                  <Switch
                    id="faq-case-search"
                    checked={config.caseInsensitiveSearch}
                    onCheckedChange={(checked) => onChange("caseInsensitiveSearch", checked)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Category Filters Settings */}
          <div className="rounded-xl border border-border/70 bg-card p-3.5 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-purple-600" />
                <span className="text-xs font-bold text-foreground">Category Filter Tabs</span>
              </div>
              <Switch
                checked={config.showCategoryFilters}
                onCheckedChange={(checked) => onChange("showCategoryFilters", checked)}
              />
            </div>

            {config.showCategoryFilters && (
              <div className="space-y-3 pt-1 border-t border-border/50">
                <div className="space-y-1">
                  <Label className="text-[11px] font-semibold text-muted-foreground">
                    Available Categories
                  </Label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {config.categories.map((c) => (
                      <span
                        key={c}
                        className="inline-flex items-center gap-1 rounded-md bg-purple-500/10 px-2 py-0.5 text-xs font-semibold text-purple-700 dark:text-purple-300"
                      >
                        {c}
                        {c !== "All" && config.categories.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(c)}
                            className="text-purple-500 hover:text-destructive transition-colors ml-0.5"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="New category..."
                    className="h-7.5 text-xs"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddCategory}
                    className="h-7.5 text-xs bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shrink-0"
                  >
                    Add
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Header Display */}
          <div className="rounded-xl border border-border/70 bg-card p-3.5 space-y-3 shadow-2xs">
            <span className="text-xs font-bold text-foreground">Header Visibility</span>
            <div className="flex items-center justify-between">
              <Label
                htmlFor="faq-show-head"
                className="text-[11px] font-semibold text-muted-foreground"
              >
                Show Main Heading
              </Label>
              <Switch
                id="faq-show-head"
                checked={config.showHeading}
                onCheckedChange={(checked) => onChange("showHeading", checked)}
              />
            </div>
          </div>
        </TabsContent>

        {/* Guided Step Navigation Bar at Bottom */}
        <div className="border-t border-border/70 bg-card p-3 flex items-center justify-between gap-2 shrink-0">
          {activeTab === "templates" && (
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] text-muted-foreground font-medium">
                Step 1 of 4: Choose Template
              </span>
              <Button
                type="button"
                size="sm"
                onClick={() => setActiveTab("content")}
                className="h-8 px-3 text-xs bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <span>Add Content</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}

          {activeTab === "content" && (
            <div className="flex items-center justify-between w-full">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("templates")}
                className="h-8 text-xs font-medium rounded-lg flex items-center gap-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Templates</span>
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => setActiveTab("layout")}
                className="h-8 px-3 text-xs bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <span>Customize Layout</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}

          {activeTab === "layout" && (
            <div className="flex items-center justify-between w-full">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("content")}
                className="h-8 text-xs font-medium rounded-lg flex items-center gap-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Content</span>
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => setActiveTab("settings")}
                className="h-8 px-3 text-xs bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <span>Adjust Settings</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="flex items-center justify-between w-full">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("layout")}
                className="h-8 text-xs font-medium rounded-lg flex items-center gap-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Layout</span>
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={onPublish}
                disabled={isPublishing}
                className="h-8 px-4 text-xs bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-xs"
              >
                {isPublishing ? "Publishing..." : "Publish FAQ"}
              </Button>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
};

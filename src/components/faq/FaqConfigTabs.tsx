import { useState, type FC } from "react";
import {
  Plus,
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp,
  MoveUp,
  MoveDown,
  LayoutGrid,
  FileText,
  Palette,
  Search,
  Columns,
  Grid,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaqTemplateGallery } from "./FaqTemplateGallery";
import type { FaqWidgetConfig, FaqItem } from "@/lib/faq/types";
import type { FaqTemplateDefinition } from "@/lib/faq/templates";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export type FaqEditorTab = "templates" | "content" | "design";

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

const COLOR_SWATCHES = [
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

  // FAQ Items Handlers
  const handleAddItem = () => {
    const newId = `faq_${Date.now()}`;
    const newItem: FaqItem = {
      id: newId,
      question: "New question",
      answer: "",
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

  const handleApplyPreset = (preset: (typeof COLOR_SWATCHES)[0]) => {
    onChange("accentColor", preset.accent);
    onChange("bgColor", preset.bg);
    onChange("cardBgColor", preset.card);
    onChange("questionColor", preset.text);
    onChange("answerColor", preset.text);
    onChange("iconColor", preset.accent);
  };

  return (
    <div className="flex h-full flex-col bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as FaqEditorTab)}
        className="flex h-full flex-col min-h-0"
      >
        {/* Exactly 3 Clean, Simple Tabs: Templates, Content, Design */}
        <div className="border-b border-border/80 bg-muted/50 px-4 py-2.5 shrink-0">
          <TabsList className="grid w-full grid-cols-3 bg-muted p-1 rounded-xl">
            <TabsTrigger
              value="templates"
              className="flex items-center justify-center gap-2 py-2 text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 data-[state=active]:bg-card data-[state=active]:text-slate-950 dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
            >
              <LayoutGrid className="h-4 w-4 text-purple-600" />
              <span>Templates</span>
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="flex items-center justify-center gap-2 py-2 text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 data-[state=active]:bg-card data-[state=active]:text-slate-950 dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
            >
              <FileText className="h-4 w-4 text-blue-600" />
              <span>Content</span>
            </TabsTrigger>
            <TabsTrigger
              value="design"
              className="flex items-center justify-center gap-2 py-2 text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 data-[state=active]:bg-card data-[state=active]:text-slate-950 dark:data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
            >
              <Palette className="h-4 w-4 text-emerald-600" />
              <span>Design</span>
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
                description: "Ready to customize your questions.",
              });
            }}
          />
        </TabsContent>

        {/* Tab 2: Content (Simple, focused on questions without clutter) */}
        <TabsContent
          value="content"
          className="m-0 flex-1 overflow-y-auto p-4 md:p-5 space-y-5 scrollbar-thin focus-visible:outline-hidden"
        >
          {/* Section: Header Content */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="text-sm font-extrabold text-slate-950 dark:text-white">
                Title & Subtitle
              </span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="faq-heading" className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  FAQ Heading *
                </Label>
                <Input
                  id="faq-heading"
                  value={config.heading}
                  onChange={(e) => onChange("heading", e.target.value)}
                  placeholder="Frequently Asked Questions"
                  className="h-9 text-sm font-bold text-slate-900 dark:text-slate-100"
                />
                {errors["heading"] && (
                  <p className="text-xs font-bold text-destructive">{errors["heading"]}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="faq-sub" className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Subtitle (optional)
                </Label>
                <Input
                  id="faq-sub"
                  value={config.subtitle}
                  onChange={(e) => onChange("subtitle", e.target.value)}
                  placeholder="Find quick answers to common questions about our products."
                  className="h-8.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Section: FAQ Questions (Sticky toolbar ensures Add Question is always accessible) */}
          <div className="space-y-3 relative">
            {/* Sticky Header Toolbar */}
            <div className="sticky top-0 z-20 flex items-center justify-between bg-card/95 backdrop-blur-xs py-3 px-3.5 border-y border-border -mx-4 md:-mx-5 shadow-2xs">
              <div>
                <h3 className="text-sm font-extrabold text-slate-950 dark:text-white">
                  FAQ Questions ({config.items.length})
                </h3>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Add, edit, reorder, or duplicate questions.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={handleAddItem}
                className="h-8 px-3.5 text-xs sm:text-sm bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5 shrink-0"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
                <span>Add Question</span>
              </Button>
            </div>

            {errors["items"] && (
              <p className="text-xs font-bold text-destructive px-1">{errors["items"]}</p>
            )}

            {/* Questions List */}
            <div className="space-y-2.5 pt-1">
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
                        ? "border-purple-600 ring-2 ring-purple-600/60 bg-purple-50/30 dark:bg-purple-950/20 shadow-md"
                        : isExpanded
                        ? "border-purple-500 shadow-xs"
                        : "border-border hover:border-slate-400 dark:hover:border-slate-600"
                    )}
                  >
                    {/* Collapsed Header Bar */}
                    <div
                      className={cn(
                        "flex items-center justify-between p-3 cursor-pointer select-none rounded-t-xl transition-colors",
                        isExpanded ? "bg-muted/50 border-b border-border/60" : "hover:bg-muted/30"
                      )}
                      onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
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
                            className="p-0.5 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-20 transition-colors"
                          >
                            <ChevronUp className="h-3.5 w-3.5 stroke-[2.5]" />
                          </button>
                          <button
                            type="button"
                            aria-label="Move question down"
                            disabled={idx === config.items.length - 1}
                            onClick={() => handleMoveItem(idx, "down")}
                            className="p-0.5 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-20 transition-colors"
                          >
                            <ChevronDown className="h-3.5 w-3.5 stroke-[2.5]" />
                          </button>
                        </div>

                        <span className="shrink-0 text-xs font-black text-slate-500 dark:text-slate-400 w-5">
                          #{idx + 1}
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white truncate">
                            {item.question || "Untitled Question"}
                          </p>
                        </div>
                      </div>

                      {/* Header Actions */}
                      <div
                        className="flex items-center gap-1.5 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          aria-label="Duplicate question"
                          onClick={() => handleDuplicateItem(item)}
                          className="h-7 w-7 grid place-items-center rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-muted transition-colors"
                        >
                          <Copy className="h-3.5 w-3.5 stroke-[2.5]" />
                        </button>
                        <button
                          type="button"
                          aria-label="Delete question"
                          disabled={config.items.length <= 1}
                          onClick={() => handleDeleteItem(item.id)}
                          className="h-7 w-7 grid place-items-center rounded-lg text-slate-500 hover:text-destructive hover:bg-destructive/10 disabled:opacity-30 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5 stroke-[2.5]" />
                        </button>
                        <button
                          type="button"
                          aria-label={isExpanded ? "Collapse item" : "Expand item"}
                          onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                          className="h-7 w-7 grid place-items-center rounded-lg text-slate-700 dark:text-slate-300 hover:bg-muted transition-colors ml-0.5"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 stroke-[2.5]" />
                          ) : (
                            <ChevronDown className="h-4 w-4 stroke-[2.5]" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Content Fields */}
                    {isExpanded && (
                      <div className="p-4 space-y-3.5 bg-card/70 rounded-b-xl animate-in slide-in-from-top-1 duration-150">
                        <div className="space-y-1.5">
                          <Label
                            htmlFor={`faq-input-question-${item.id}`}
                            className="text-xs font-bold text-slate-900 dark:text-slate-100"
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
                            className="h-9 text-xs sm:text-sm font-bold text-slate-950 dark:text-white"
                          />
                          {itemErrQuestion && (
                            <p className="text-xs font-bold text-destructive">{itemErrQuestion}</p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <Label
                            htmlFor={`faq-input-answer-${item.id}`}
                            className="text-xs font-bold text-slate-900 dark:text-slate-100"
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
                            className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 resize-y"
                          />
                          {itemErrAnswer && (
                            <p className="text-xs font-bold text-destructive">{itemErrAnswer}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Design (Columns in a stylish way, colors, radius, expand behavior) */}
        <TabsContent
          value="design"
          className="m-0 flex-1 overflow-y-auto p-4 md:p-5 space-y-5 scrollbar-thin focus-visible:outline-hidden"
        >
          {/* ================= STYLISH COLUMNS SELECTOR ================= */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-sm font-extrabold text-slate-950 dark:text-white">
                Columns Layout
              </span>
              <span className="text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-md">
                {config.columns === 2 ? "2 Columns Active" : "1 Column Active"}
              </span>
            </div>

            {/* Stylish Visual Cards for 1 Column vs 2 Columns */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* Option 1: Single Column */}
              <button
                type="button"
                onClick={() => onChange("columns", 1)}
                className={cn(
                  "relative flex flex-col items-center p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer group",
                  config.columns === 1
                    ? "border-purple-600 bg-purple-50/50 dark:bg-purple-950/30 ring-2 ring-purple-600 shadow-sm"
                    : "border-border bg-card hover:border-slate-400 hover:bg-muted/40"
                )}
              >
                {config.columns === 1 && (
                  <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-white shadow-xs">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                )}

                {/* Stylish Miniature Visual Icon for 1 Column */}
                <div className="w-full h-16 bg-muted/60 dark:bg-slate-800 rounded-lg p-2 mb-2.5 flex flex-col justify-around border border-border/50 group-hover:scale-[1.02] transition-transform">
                  <div className="h-2 w-full bg-purple-600 rounded-sm" />
                  <div className="h-2 w-full bg-slate-300 dark:bg-slate-600 rounded-sm" />
                  <div className="h-2 w-full bg-slate-300 dark:bg-slate-600 rounded-sm" />
                </div>

                <span className="text-xs sm:text-sm font-black text-slate-950 dark:text-white">
                  1 Column
                </span>
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mt-0.5 text-center">
                  Classic vertical list
                </span>
              </button>

              {/* Option 2: Two Columns */}
              <button
                type="button"
                onClick={() => onChange("columns", 2)}
                className={cn(
                  "relative flex flex-col items-center p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer group",
                  config.columns === 2
                    ? "border-purple-600 bg-purple-50/50 dark:bg-purple-950/30 ring-2 ring-purple-600 shadow-sm"
                    : "border-border bg-card hover:border-slate-400 hover:bg-muted/40"
                )}
              >
                {config.columns === 2 && (
                  <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-white shadow-xs">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                )}

                {/* Stylish Miniature Visual Icon for 2 Columns */}
                <div className="w-full h-16 bg-muted/60 dark:bg-slate-800 rounded-lg p-2 mb-2.5 grid grid-cols-2 gap-1.5 border border-border/50 group-hover:scale-[1.02] transition-transform">
                  <div className="flex flex-col justify-around">
                    <div className="h-2 w-full bg-purple-600 rounded-sm" />
                    <div className="h-2 w-full bg-slate-300 dark:bg-slate-600 rounded-sm" />
                  </div>
                  <div className="flex flex-col justify-around">
                    <div className="h-2 w-full bg-purple-600 rounded-sm" />
                    <div className="h-2 w-full bg-slate-300 dark:bg-slate-600 rounded-sm" />
                  </div>
                </div>

                <span className="text-xs sm:text-sm font-black text-slate-950 dark:text-white">
                  2 Columns
                </span>
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mt-0.5 text-center">
                  Side-by-side grid
                </span>
              </button>
            </div>

            {/* Container Max Width */}
            <div className="pt-2 space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Widget Width
                </Label>
                <span className="text-xs font-black font-mono text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded">
                  {config.maxWidth}px
                </span>
              </div>
              <Slider
                value={[config.maxWidth]}
                min={400}
                max={1100}
                step={20}
                onValueChange={([val]) => val && onChange("maxWidth", val)}
              />
            </div>
          </div>

          {/* ================= COLOR THEMES ================= */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3.5 shadow-2xs">
            <span className="text-sm font-extrabold text-slate-950 dark:text-white">
              Color Themes
            </span>

            {/* Modern circular color swatches */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {COLOR_SWATCHES.map((preset) => {
                const isActive = config.accentColor === preset.accent;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all text-center group",
                      isActive
                        ? "border-purple-600 bg-purple-50/60 dark:bg-purple-950/40 ring-1 ring-purple-600"
                        : "border-border hover:bg-muted/50"
                    )}
                  >
                    <span
                      className="h-6 w-6 rounded-full border border-black/10 shadow-sm shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: preset.accent }}
                    >
                      {isActive && <Check className="h-3 w-3 text-white stroke-[3]" />}
                    </span>
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate w-full">
                      {preset.name.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Accent Color */}
            <div className="pt-2 flex items-center justify-between">
              <Label className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Custom Accent Color
              </Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.accentColor}
                  onChange={(e) => onChange("accentColor", e.target.value)}
                  className="h-8 w-8 rounded-lg cursor-pointer border border-border shrink-0 shadow-2xs"
                />
                <Input
                  value={config.accentColor}
                  onChange={(e) => onChange("accentColor", e.target.value)}
                  className="h-8 w-24 text-xs font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* ================= ACCORDION BEHAVIOR & SEARCH ================= */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3.5 shadow-2xs">
            <span className="text-sm font-extrabold text-slate-950 dark:text-white">
              Accordion Settings
            </span>

            {/* Expand Mode */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Expand Mode
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={config.accordionMode === "single" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onChange("accordionMode", "single")}
                  className={cn(
                    "h-8.5 text-xs font-bold justify-center",
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
                    "h-8.5 text-xs font-bold justify-center",
                    config.accordionMode === "multiple" &&
                      "bg-purple-600 hover:bg-purple-700 text-white"
                  )}
                >
                  Multiple Open
                </Button>
              </div>
            </div>

            {/* Open First Item */}
            <div className="flex items-center justify-between pt-1">
              <Label
                htmlFor="faq-open-first"
                className="text-xs font-bold text-slate-900 dark:text-slate-100"
              >
                Open First Question by Default
              </Label>
              <Switch
                id="faq-open-first"
                checked={config.openFirstByDefault}
                onCheckedChange={(checked) => onChange("openFirstByDefault", checked)}
              />
            </div>

            {/* Instant Search Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <div>
                <Label
                  htmlFor="faq-search-toggle"
                  className="text-xs font-bold text-slate-900 dark:text-slate-100"
                >
                  Live Search Bar
                </Label>
                <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  Allow visitors to instantly filter questions
                </p>
              </div>
              <Switch
                id="faq-search-toggle"
                checked={config.enableSearch}
                onCheckedChange={(checked) => onChange("enableSearch", checked)}
              />
            </div>

            {/* Corner Radius */}
            <div className="pt-2 border-t border-border/60 space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Corner Radius
                </Label>
                <span className="text-xs font-black font-mono text-purple-700 dark:text-purple-300">
                  {config.borderRadius}px
                </span>
              </div>
              <Slider
                value={[config.borderRadius]}
                min={0}
                max={24}
                step={2}
                onValueChange={([val]) => val !== undefined && onChange("borderRadius", val)}
              />
            </div>
          </div>
        </TabsContent>

        {/* Guided Step Navigation Bar at Bottom */}
        <div className="border-t border-border bg-card p-3.5 flex items-center justify-between gap-2 shrink-0">
          {activeTab === "templates" && (
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Step 1 of 3: Choose Template
              </span>
              <Button
                type="button"
                size="sm"
                onClick={() => setActiveTab("content")}
                className="h-8.5 px-4 text-xs sm:text-sm bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <span>Edit Content</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
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
                className="h-8.5 text-xs sm:text-sm font-bold rounded-xl flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
                <span>Templates</span>
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => setActiveTab("design")}
                className="h-8.5 px-4 text-xs sm:text-sm bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <span>Customize Design</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </Button>
            </div>
          )}

          {activeTab === "design" && (
            <div className="flex items-center justify-between w-full">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("content")}
                className="h-8.5 text-xs sm:text-sm font-bold rounded-xl flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
                <span>Content</span>
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={onPublish}
                disabled={isPublishing}
                className="h-8.5 px-5 text-xs sm:text-sm bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl shadow-xs"
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

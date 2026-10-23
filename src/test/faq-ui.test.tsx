import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FaqTemplateGallery } from "@/components/faq/FaqTemplateGallery";
import { FaqLivePreview } from "@/components/faq/FaqLivePreview";
import { FaqConfigTabs } from "@/components/faq/FaqConfigTabs";
import { DEFAULT_FAQ_CONFIG } from "@/lib/faq/types";

describe("FAQ Widget UI Components", () => {
  it("FaqTemplateGallery renders all 10 template options and responds to selection", () => {
    const onSelect = vi.fn();
    render(
      <FaqTemplateGallery
        selectedTemplate="classic"
        onSelectTemplate={onSelect}
      />
    );

    expect(screen.getByText("Choose a Design Template")).toBeInTheDocument();
    expect(screen.getByText("1. Classic Accordion")).toBeInTheDocument();
    expect(screen.getByText("2. Minimal")).toBeInTheDocument();
    expect(screen.getByText("3. Card Accordion")).toBeInTheDocument();
    expect(screen.getByText("4. Bordered List")).toBeInTheDocument();
    expect(screen.getByText("5. Two-Column FAQ")).toBeInTheDocument();
    expect(screen.getByText("6. Help Center")).toBeInTheDocument();
    expect(screen.getByText("7. Category-Based FAQ")).toBeInTheDocument();
    expect(screen.getByText("8. Compact FAQ")).toBeInTheDocument();
    expect(screen.getByText("9. Highlighted Questions")).toBeInTheDocument();
    expect(screen.getByText("10. Dark FAQ")).toBeInTheDocument();

    // Click on Card Accordion
    fireEvent.click(screen.getByText("3. Card Accordion"));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("FaqLivePreview expands and collapses question on click", () => {
    render(
      <FaqLivePreview
        config={{
          ...DEFAULT_FAQ_CONFIG,
          openFirstByDefault: false,
          items: [
            { id: "q1", question: "Is returns free?", answer: "Yes, returns are 100% free within 30 days." },
            { id: "q2", question: "Where do you ship?", answer: "We ship worldwide." },
          ],
        }}
      />
    );

    // Initial state: answers closed
    expect(screen.queryByText(/returns are 100% free/i)).not.toBeInTheDocument();

    // Click first question
    fireEvent.click(screen.getByText("Is returns free?"));
    expect(screen.getByText(/returns are 100% free/i)).toBeInTheDocument();

    // Click again to collapse
    fireEvent.click(screen.getByText("Is returns free?"));
    expect(screen.queryByText(/returns are 100% free/i)).not.toBeInTheDocument();
  });

  it("FaqLivePreview filters items by search input", () => {
    render(
      <FaqLivePreview
        config={{
          ...DEFAULT_FAQ_CONFIG,
          enableSearch: true,
          items: [
            { id: "q1", question: "How to reset my password?", answer: "Go to your account settings." },
            { id: "q2", question: "Can I cancel my subscription?", answer: "Yes, in the billing portal." },
          ],
        }}
      />
    );

    const searchInput = screen.getByPlaceholderText(DEFAULT_FAQ_CONFIG.searchPlaceholder);
    expect(searchInput).toBeInTheDocument();

    expect(screen.getByText("How to reset my password?")).toBeInTheDocument();
    expect(screen.getByText("Can I cancel my subscription?")).toBeInTheDocument();

    // Type "cancel" into search
    fireEvent.change(searchInput, { target: { value: "cancel" } });

    expect(screen.getByText("Can I cancel my subscription?")).toBeInTheDocument();
    expect(screen.queryByText("How to reset my password?")).not.toBeInTheDocument();
  });

  it("FaqLivePreview filters items by category pills", () => {
    render(
      <FaqLivePreview
        config={{
          ...DEFAULT_FAQ_CONFIG,
          showCategoryFilters: true,
          categories: ["All", "Billing", "Shipping"],
          items: [
            { id: "q1", question: "Invoice question?", answer: "Check invoices tab.", category: "Billing" },
            { id: "q2", question: "Delivery speed?", answer: "Arrives in 3 days.", category: "Shipping" },
          ],
        }}
      />
    );

    expect(screen.getByText("Invoice question?")).toBeInTheDocument();
    expect(screen.getByText("Delivery speed?")).toBeInTheDocument();

    // Click "Billing" category pill
    const billingBtn = screen.getByRole("button", { name: /Billing/i });
    fireEvent.click(billingBtn);

    expect(screen.getByText("Invoice question?")).toBeInTheDocument();
    expect(screen.queryByText("Delivery speed?")).not.toBeInTheDocument();
  });

  it("FaqConfigTabs renders all 4 tabs (Templates, Content, Layout, Settings) and allows adding a question", () => {
    const onChange = vi.fn();
    render(
      <FaqConfigTabs
        config={DEFAULT_FAQ_CONFIG}
        onChange={onChange}
        onSelectTemplate={() => {}}
        errors={{}}
        onPublish={() => {}}
        isPublishing={false}
        onCancel={() => {}}
        initialTab="content"
      />
    );

    // Verify all 4 tabs exist
    expect(screen.getByRole("tab", { name: /templates/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /content/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /layout/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /settings/i })).toBeInTheDocument();

    // Click Add Question button
    const addBtn = screen.getByRole("button", { name: /add question/i });
    fireEvent.click(addBtn);

    expect(onChange).toHaveBeenCalledWith("items", expect.arrayContaining([
      expect.objectContaining({
        question: "New question",
        answer: "",
      }),
    ]));
  });

  it("FaqConfigTabs defaults to Templates tab and provides Use This Template button", () => {
    const onSelect = vi.fn();
    render(
      <FaqConfigTabs
        config={DEFAULT_FAQ_CONFIG}
        onChange={() => {}}
        onSelectTemplate={onSelect}
        errors={{}}
        onPublish={() => {}}
        isPublishing={false}
        onCancel={() => {}}
      />
    );

    // Default tab is Templates
    const templatesTab = screen.getByRole("tab", { name: /templates/i });
    expect(templatesTab).toHaveAttribute("data-state", "active");

    // "Use This Template" button is rendered
    const useTemplateBtn = screen.getByRole("button", { name: /use this template/i });
    expect(useTemplateBtn).toBeInTheDocument();
    fireEvent.click(useTemplateBtn);

    // After clicking, onSelectTemplate was triggered
    expect(onSelect).toHaveBeenCalled();
  });
});


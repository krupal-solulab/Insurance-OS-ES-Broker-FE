import { createFileRoute } from "@tanstack/react-router";
import { CoverlineLanding } from "@/components/coverline/CoverlineLanding";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Coverline — AI operating system for wholesale & E&S broker placement" },
      {
        name: "description",
        content:
          "Coverline matches every retail submission against your carrier panel, assembles the package, and drafts your agent communication — with your broker approving every decision.",
      },
    ],
  }),
  component: CoverlineLanding,
});

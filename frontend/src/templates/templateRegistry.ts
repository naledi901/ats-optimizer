export interface TemplateConfig {
  layoutType: "standard" | "government";
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  design: {
    uppercaseHeadings: boolean;
    sectionLines: boolean;
    boldName: boolean;
  };
}

export const templates: Record<string, TemplateConfig> = {
  modern: {
    layoutType: "standard",
    colors: {
      primary: "#000000",
      secondary: "#374151",
      accent: "#000000",
      background: "#FFFFFF",
    },
    design: {
      uppercaseHeadings: true,
      sectionLines: false,
      boldName: true,
    },
  },
  graduate: {
    layoutType: "standard",
    colors: {
      primary: "#1e293b", // Dark Slate Blue
      secondary: "#475569",
      accent: "#2563eb", // Bright Blue
      background: "#FFFFFF",
    },
    design: {
      uppercaseHeadings: false,
      sectionLines: true,
      boldName: false,
    },
  },
  tech: {
    layoutType: "standard",
    colors: {
      primary: "#111827", // Almost Black
      secondary: "#374151",
      accent: "#0f766e", // Teal
      background: "#FFFFFF",
    },
    design: {
      uppercaseHeadings: true,
      sectionLines: true,
      boldName: true,
    },
  },
  government: {
    layoutType: "government",
    colors: {
      primary: "#000000",
      secondary: "#000000",
      accent: "#000000",
      background: "#FFFFFF",
    },
    design: {
      uppercaseHeadings: true,
      sectionLines: true,
      boldName: true,
    },
  },
};
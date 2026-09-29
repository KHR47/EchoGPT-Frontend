export type Theme = "dark" | "light" | "system";

export type ModelProvider =
  | "echogpt"
  | "openai"
  | "anthropic"
  | "google"
  | "deepseek"
  | "meta"
  | "mistral"
  | "nvidia"
  | "groq"
  | "open-source";

export interface ModelCapabilities {
  text: boolean;
  vision: boolean;
  reasoning: boolean;
  audio?: boolean;
}

export interface Model {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  provider: ModelProvider;
  type: "Free" | "Advanced";
  freeAccess: boolean;
  capabilities: ModelCapabilities;
  contextWindow?: number;
  latencyTier?: "Ultra-Fast" | "Standard" | "Deep-Thinking";
}

export type Role = "user" | "assistant" | "system";

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  previewUrl?: string;
}

export interface ChatMessage {
  messageId: string;
  chatId: string;
  role: Role;
  content: string;
  modelSlug?: string;
  createdAt: string;
  history?: string[];
  activeVersionIndex?: number;
  file?: FileAttachment;
  reasoningContent?: string;
  mcpToolsUsed?: string[];
  feedback?: "like" | "dislike" | null;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface ConversationMeta {
  chatId: string;
  title: string;
  firstPrompt: string;
  modelSlug: string;
  updatedAt: string;
  isPinned?: boolean;
  messageCount: number;
}

export interface ComparisonColumn {
  modelSlug: string;
  content: string;
  reasoningContent?: string;
  isLoading: boolean;
  error?: string;
  latencyMs?: number;
}

export interface ComparisonTurn {
  id: string;
  prompt: string;
  timestamp: string;
  columns: ComparisonColumn[];
}

export interface McpTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export interface McpConnector {
  id: string;
  name: string;
  url: string;
  authHeader?: string;
  enabled: boolean;
  tools: McpTool[];
  status: "connected" | "error" | "connecting";
  lastRefreshedAt?: string;
}

export interface PageContext {
  title: string;
  url: string;
  domain: string;
  favicon?: string;
  extractedText: string;
  headings: string[];
  detectedType: "article" | "github" | "docs" | "generic";
}

export interface QuotaStatus {
  tier: "Free" | "Pro Monthly" | "Pro Annual";
  limit: number;
  remaining: number;
  advancedLimit: number;
  advancedRemaining: number;
  windowHours: number;
  resetAt: string;
}

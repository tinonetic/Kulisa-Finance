# Technical Specification

## Core Architecture
Khulisa is built as a highly responsive Single Page Application (SPA) using React and Vite. It leverages a serverless AI approach via the Gemini API.

## Key Services

### 1. Gemini AI Integration (`src/services/geminiService.ts`)
The core intelligence engine uses `gemini-1.5-flash`.
- **Input**: A JSON-stringified array of the last 10-20 user transactions.
- **Prompting**: Structured prompts that enforce South African financial context (SARB regulations, informal sector logic).
- **Output**: Strict JSON schema for TrustScore and InvestmentPlan.

### 2. Transaction Parser (`src/App.tsx`)
A client-side CSV parser implemented using the `FileReader` API. It maps raw text rows to the `Transaction` interface.

## State Management
- **React Hooks**: Local state (`useState`) handles transactions, scores, and language preferences.
- **Motion**: Used for smooth route-like transitions between scoring states.

## Security & Ethics
- **Client-Side Processing**: CSV data stays in the browser's memory and is only sent to the AI model for transitory analysis.
- **Trustworthiness**: The "Verified" badges in the UI are driven by logic verifying the mathematical integrity of the transaction list vs the reported balance.

---

[Back to Home](../README.md)

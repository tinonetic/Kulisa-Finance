# Khulisa Project Instructions

## Design System: Khulisa Modern Financial Minimalist
- **Aesthetic**: Clean, high-contrast, professional "Swiss-style" minimalist grid.
- **Palette**: Indigo-600 (Trust), Emerald-600 (Growth), Gray-50 (Surface). Core text in Gray-900.
- **Typography**: Inter Sans. Large figures MUST use `tabular-nums` and font-weight 900.
- **Atmosphere**: Avoid typical "app-y" gradients. Use sharp lines, indigo-gradient accents for AI features, and 24px (3xl) rounded corners.

## Feature Implementation Rules
- **Multi-language**: All UI strings must be declared in `src/translations.ts`. Currently supporting English, isiZulu, isiXhosa, and Afrikaans.
- **Transaction Handling**: All new transaction logic must support the standard CSV format: `Date, Amount, Description, Type, Category`.
- **AI Integration**: AI recommendations (ScoreCard and InvestmentCard) must use the `geminiService.ts` and maintain a tone of financial empowerment.
- **Iconography**: Exclusively use `lucide-react`. Do not introduce custom SVGs or other libraries.

## Development Constraints
- Use standard React 18 functional components.
- Tailwinds utility classes only.
- Ensure the CSV import logic remains robust for manual user uploads.

---
name: image-prompt-style-library
description: 【图片提示词风格库】Choose visual styles and industrial prompt templates from the image prompt style library. Use when an agent needs to create, rewrite, classify, or improve image-generation prompts with templates, categories, style tags, scene tags, pitfalls, and example cases. 触发词：生图风格、图片风格、style library、prompt template、图片提示词风格。
---

# Image Prompt Style Library (560 Cases + 22 Templates)

Use this skill to turn a user's image-generation intent into a production-ready prompt.
This skill contains 560 real-world case prompts organized by 13 categories, plus 22 reusable templates.

## Architecture: Layered On-Demand Reading

This skill uses a 3-layer architecture to minimize context usage:

```
Layer 1: style-library.md     → 22 templates, determine category (~15 KB)
Layer 2: cases-{cat}.md Index → per-category metadata, find case ID (~2-5 KB)
Layer 3: cases-{cat}.md Case  → specific prompt by anchor (~1-3 KB)
```

**Total context per use: ~20-25 KB (vs 536 KB if loading everything)**

## File Map

| File | Purpose | When to Read |
|------|---------|--------------|
| `references/name-registry.md` | 560 unique names → Case ID mapping | Name Exact Match Mode |
| `references/style-library.md` | 22 template index | Discovery Mode Step 2 |
| `references/cases-ui.md` | UI & Interfaces (73 cases) | Step 3-4 (if UI category) |
| `references/cases-posters.md` | Posters & Typography (79 cases) | Step 3-4 (if Poster category) |
| `references/cases-charts.md` | Charts & Infographics (90 cases) | Step 3-4 (if Charts category) |
| `references/cases-photography.md` | Photography & Realism (58 cases) | Step 3-4 (if Photo category) |
| `references/cases-illustration.md` | Illustration & Art (84 cases) | Step 3-4 (if Illustration category) |
| `references/cases-other.md` | Other Use Cases (36 cases) | Step 3-4 (if Other category) |
| `references/cases-products.md` | Products & E-commerce (32 cases) | Step 3-4 (if Products category) |
| `references/cases-brand.md` | Brand & Logos (24 cases) | Step 3-4 (if Brand category) |
| `references/cases-characters.md` | Characters & People (21 cases) | Step 3-4 (if Characters category) |
| `references/cases-history.md` | History & Classical Themes (15 cases) | Step 3-4 (if History category) |
| `references/cases-scenes.md` | Scenes & Storytelling (24 cases) | Step 3-4 (if Scenes category) |
| `references/cases-architecture.md` | Architecture & Spaces (15 cases) | Step 3-4 (if Architecture category) |
| `references/cases-documents.md` | Documents & Publishing (9 cases) | Step 3-4 (if Documents category) |

## Mode Selection

When the user's request arrives, determine which mode to use:

- **Name Exact Match Mode** — If the user says "生成一张XXX的图片" or "我要XXX" where XXX matches a registered name in `references/name-registry.md`, use this mode (highest priority, deterministic).
- **Discovery Mode** — If the user describes what they want without using a registered name, use the category-based workflow below.

## Name Exact Match Mode (Priority)

This mode provides **deterministic** prompt retrieval by exact name matching.

1. Search `references/name-registry.md` for the exact name the user mentioned.
   - Format: `name | case_id | file`
   - Use `search_file_content` to find the name
2. Extract the Case ID and file path from the matched line.
3. Search `### Case {ID}` in the corresponding category file to read the full prompt.
4. Check Input requirements:
   - 📷 → Guide user to provide reference image
   - ✏️ → Ask user to fill variables (or use values they already provided)
   - ✅ → Proceed directly
5. Build and output the final prompt.

**This mode skips category matching and index scanning entirely — it's a direct name → prompt lookup.**

## Discovery Mode Workflow

1. **Detect language** — answer in the user's language.

2. **Category matching** — Read `references/style-library.md`.
   Match user's request to the best template category using:
   - Template category names and descriptions
   - Style tags (UI, Poster, Realistic, Illustration, etc.)
   - Scene tags (Commerce, Education, Social, etc.)

3. **Case discovery** — Read the INDEX section of the matched category file.
   - Use `read_file` with `offset: 0, limit: {INDEX_END_LINE}` (see `<!-- INDEX_END_LINE -->` comment in file)
   - Scan the index table to find the best matching case by Title and Desc columns
   - If multiple cases are plausible, present 2-3 options with short reasons and ask user to choose

4. **Input guidance** — Check the Input column of the matched case:

   - **📷 ref_image** → Tell the user what reference image is needed:
     - Be specific: "需要一张正面清晰的人脸照片" not just "需要参考图"
     - The Input column shows the type (人脸正面照/产品图/角色参考图/etc.)
     - Wait for user to provide the image before proceeding

   - **✏️ variables** → List all variables the user needs to fill:
     - Show variable names from the Input column
     - Provide example values when possible
     - If user already provided values in their request, use them directly
     - Ask for any missing values

   - **✅ direct** → No additional input needed, proceed to step 5

5. **Read prompt** — Search for `### Case {ID}` in the same category file.
   - Use `search_file_content` to find the exact line
   - Read the full prompt block between the ``` markers

6. **Build final prompt** — Based on the case prompt + user's specific needs:
   - Replace all [variable] placeholders with user-provided values
   - Adjust details based on user's specific requirements
   - Preserve the case's core structure, style constraints, and negative prompts
   - Add aspect ratio and format if not specified

7. **Output** — Provide the final prompt in a copyable code block.

## Fallback Strategy

If no case matches well in the index:
1. Fall back to `style-library.md` templates
2. Use the template's Guidance and Pitfalls to build from scratch
3. Reference the closest case's structure as a skeleton

## Output Defaults

- Provide a copyable prompt first, then brief explanation
- Keep constraints concrete: exact text, aspect ratio, readable labels, layout hierarchy
- For Chinese requests, write the final prompt in Chinese unless user asks for English
- For English requests, write the final prompt in English unless user asks for Chinese
- When user asks for multiple concepts, reuse one case template and vary subject/composition/palette

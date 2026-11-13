# Carousel Generator App — Complete UI/UX Specification

## Design System

### Colors
| Semantic Color       | Value                                             |
| -------------------- | ------------------------------------------------- |
| **Background**       | `#0A0A0A` *(background)*                          |
| **Surface/Cards**    | `#1C1C1C` *(card)*                                |
| **Surface Elevated** | `#2B2B2B` *(muted)*                               |
| **Primary Accent**   | `#FFFFFF` *(primary)*                             |
| **Primary Hover**    | `#F5F5F5` *(text, closest available)*             |
| **Text Primary**     | `#F5F5F5` *(text)*                                |
| **Text Secondary**   | `#8A8A8E` *(mutedForeground)*                     |
| **Text Muted**       | `#8A8A8E` *(reuse mutedForeground)*               |
| **Border**           | `#343434` *(border)*                              |
| **Success Green**    | `#FFFFFF` *(reuse primary since no green exists)* |
| **Error Red**        | `#FFFFFF` *(reuse primary since no red exists)*   |
| **Card Hover**       | `#2B2B2B` *(muted)*                               |

### Typography
- **Font**: Inter (system default fallback)
- **Headings**: Bold, various sizes
- **Body**: Regular, 14–16px
- **Small/Caption**: 12px, text-secondary

### Spacing
- **Padding (screen)**: 20px
- **Padding (card)**: 16px
- **Gap between cards**: 12px
- **Border radius**: 12px (cards), 8px (buttons), 6px (inputs)

### Icons
Use consistent outline-style icons from a single set (Lucide-style).

---

## Screen 1: Splash / App Init

**Purpose**: On first launch, check if API key + theme are configured. If not, redirect to setup flow.

**Visual**:
- Centered logo: a simple carousel icon (🎠) in primary yellow on dark bg
- Below: app name "Carousel Studio" in white bold
- Subtitle: "AI-Powered Slide Generator" in text-secondary
- A subtle loading spinner (yellow)

**Flow**:
1. App reads AsyncStorage
2. If no API key → redirect to Setup Screen
3. If no theme → redirect to Theme Setup Screen
4. If both exist → go to Home Screen

---

## Screen 2: Setup — API Key

**Purpose**: First-time or manual re-entry of OpenAI API key.

**Visual**:
- Top: Back arrow (if returning from settings) + title "API Key"
- Mid: A large lock icon (🔑) in a circle with yellow border
- Below: "Enter your OpenAI API key" heading
- Subtext: "Your key is stored securely on-device. Never shared."
- A text input field (dark surface background, white text, cursor yellow)
- Placeholder: `sk-...`
- Below input: "Validate" button (yellow bg, black text, bold)
- Loading state: spinner replaces button text
- On success: green checkmark + "Key validated!" message
- "Continue" button (appears after validation)

**Edge cases**:
- Invalid key: red border on input + "Invalid API key. Please check and try again."
- Network error: "Could not reach OpenAI. Check your connection."

---

## Screen 3: Setup — Theme

**Purpose**: First-time theme configuration (color accent + font + optional instructions).

**Visual**:
- Top: Step indicator "2 of 2" + title "Choose Theme"
- Section 1: "Accent Color"
  - A large preview circle showing current color with hex code below
  - A text input field for hex code (e.g. `#FFF200`)
  - Below: 8 preset color chips (yellow, green, blue, red, purple, orange, teal, pink) — tapping fills the input
  - Live preview: a sample card mockup showing "Slide Title" with the chosen accent color

- Section 2: "Font Style"
  - A scrollable horizontal list of font cards
  - Each card shows font name in that font + preview text "Aa"
  - Selected card has yellow border
  - Options: Inter, Montserrat, Poppins, Playfair Display, Roboto, Oswald, Lato, Bebas Neue, Nunito, Raleway

- Section 3: "Extra Instructions" (optional)
  - A small text input, placeholder: "e.g. Make it look like torn paper collage"
  - Collapsible section labeled "Optional — add special instructions"

- Bottom: "Save & Continue" button (full width, yellow bg)

**Edge cases**:
- Invalid hex: inline warning "Use valid hex like #A3F or #548125"
- Low contrast on black: yellow warning chip "This color may be hard to read on dark backgrounds" + confirm checkbox

---

## Screen 4: Home Screen

**Purpose**: Main hub — project sidebar + feature cards + bottom navigation.

### Layout Structure

```
┌──────────────────────────────────────────────────────────────┐
│ [☰]                   Carousel Studio                    │
├──────────────────┬───────────────────────────────────────────┤
│                  │                                           │
│  PROJECTS        │  ╔═══════════════════════════════════╗    │
│  ───────────     │  ║  Quick Actions                    ║    │
│                  │  ╚═══════════════════════════════════╝    │
│  [+ New Project] │                                           │
│                  │  ┌──────────────────┐  ┌─────────────────┐│
│  ○ Project Alpha │  │ 📝               │  │ 🖼️              ││
│  ○ My Carousel   │  │ Prompt           │  │ Image           ││
│  ○ Social Posts  │  │ Generation       │  │ Generation      ││
│  ○ Marketing     │  │ 5 prompts · New   │  │ 0 images · New  ││
│  ○ ...           │  └──────────────────┘  └─────────────────┘│
│                  │                                           │
│                  │  ┌──────────────────────────────────────┐ │
│                  │  │ 📦                                   │ │
│                  │  │ Image Extraction from ZIP            │ │
│                  │  │ Extract PNG/JPG images from ZIP file │ │
│                  │  └──────────────────────────────────────┘ │
│                  │                                           │
│                  │  ┌──────────────────────────────────────┐ │
│                  │  │ 📋 Recent Activity                   │ │
│                  │  │ ──────────────────────────────────   │ │
│                  │  │ • Generated 5 images from "Project   │ │
│                  │  │   Alpha" — 2 min ago                 │ │
│                  │  │ • Created 8 prompts from JSON —      │ │
│                  │  │   15 min ago                          │ │
│                  │  │ • Extracted 6 images from ZIP —      │ │
│                  │  │   1 hour ago                          │ │
│                  │  └──────────────────────────────────────┘ │
│                  │                                           │
├──────────────────┴───────────────────────────────────────────┤
│  [🏠 Home]   [📋 Prompts]   [🎨 Theme]   [⚙️ Settings]        │
└──────────────────────────────────────────────────────────────┘
```

### Left Sidebar (Projects Panel)

- Toggle via hamburger icon (☰) or swipe from left
- **Header**: "Projects" + `[+]` button to create new
- **Search bar**: "Find project..." with search icon
- **Project list**: Each item = folder icon + project name + timestamp (e.g. "2h ago")
- Active project highlighted with yellow left border
- Long-press a project: context menu with "Rename" / "Delete" / "Export All"
- Empty state: "No projects yet. Create one to get started." + illustration
- Collapsed mode: icon-only narrow sidebar that expands on tap

### Feature Cards (Main Area)

Each card has:
- Icon + title + description + status badge ("New" / "X prompts" / "X images")
- Tap the card to navigate to that feature
- Cards have subtle hover/scale effect on press

### Bottom Tab Bar

4 tabs — fixed at bottom:
1. **Home** (🏠) — the main screen above
2. **Prompts Snippets** (📋) — saved prompt templates
3. **Theme** (🎨) — theme management
4. **Settings** (⚙️) — app configuration

The active tab has the yellow accent color. Badge count on Prompts tab showing number of saved snippets.

---

## Screen 5: Prompt Generation (from JSON)

**Entry**: Tap "Prompt Generation" card on Home → full screen

### Step 1: Paste JSON

**Visual**:
- Top: "← Back" + title "Generate Prompts from JSON" + subtitle "Paste your AI-generated JSON result below"
- Main area: Large text input (textarea) taking ~60% of screen height
  - Dark surface background
  - Placeholder text: `["Slide 1 prompt...", "Slide 2 prompt...", ...]`
  - Light border
- Below textarea: two buttons side by side
  - "Paste from Clipboard" (outline style, secondary) — reads clipboard
  - "Upload JSON File" (outline style, secondary) — opens document picker
- Bottom: "Generate Prompts" button (full width, yellow bg, black text) — disabled until JSON is valid

**JSON validation**:
- Parse JSON in real-time (debounced)
- If valid array of strings: green checkmark appears + "X slides detected"
- If invalid: red warning "Invalid JSON format. Expected array of strings."

**Edge cases**:
- Empty input: button disabled
- Array with 0 items: "JSON array is empty"
- Non-string items: warning "Item #3 is not a string"

### Step 2: Name Project + Submit

- After validation, a text input slides in: "Project name" with placeholder
- Auto-generated name from "Prompt Project {date}"
- "Generate" button now enabled

On submit:
- Loading overlay with spinner + "Creating slide files..."
- Each slide created shows a quick toast: "slide-1.txt ✅" etc.
- After completion: auto-navigate to the Created Prompts screen

### Screen 6: Created Prompts (Per Project)

**Visual** — this is a scrollable card gallery:

```
┌──────────────────────────────────────────────────────────────┐
│ ← Project Alpha                               [Generate]    │
│ 8 prompts · Created 2 min ago                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ ┌ Slide 1 ─────────────────────────────────────────────────┐ │
│ │ [👁️] Slide 1: "Create a cover slide with..."            │ │
│ │ A bold headline "10 Ways to Boost Productivity" with a  │ │
│ │ large central image of a mountain peak at sunrise...     │ │
│ │ [Edit] [Delete]                              [▶️ Preview]│ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌ Slide 2 ─────────────────────────────────────────────────┐ │
│ │ [👁️] Slide 2: "A split-screen design showing..."        │ │
│ │ Left side: numbered list 1-5 in yellow circles...        │ │
│ │ [Edit] [Delete]                              [▶️ Preview]│ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌ Slide 3 ─────────────────────────────────────────────────┐ │
│ │ ...                                                       │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ [+ Add Slide Manually]                                   │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ [📋 Copy All]   [📦 Export]   [🖼️ Generate Images]          │
└──────────────────────────────────────────────────────────────┘
```

**Each card shows**:
- Slide number in a small chip (yellow bg)
- Icon button to toggle full text (expandable)
- Truncated prompt preview (2 lines, then "..." with "Show more" link)
- Inline editing: tap "Edit" opens a modal with the full text in a textarea
- "Delete" with confirmation dialog
- "Preview" opens a modal showing formatted preview of the prompt
- Cards are draggable to reorder (long-press to drag)

**Bottom actions bar**:
- **Copy All** — copies all prompts as JSON array to clipboard
- **Export** — exports as JSON file via expo-sharing
- **Generate Images** — navigates to image generation with this project pre-selected

**Empty state** (if all deleted): "No prompts yet. Go back and generate some!"

---

## Screen 7: Image Generation

**Entry**: Tap "Image Generation" card on Home → shows submenu

### Step 1: Choose Mode

A clean two-option selector:

```
┌──────────────────────────────────────────────────────┐
│              Image Generation                        │
│      Choose how to generate your images             │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────┐     ┌──────────────┐              │
│  │              │     │              │              │
│  │  📝          │     │  🖼️+📝       │              │
│  │  Text to     │     │  Image +     │              │
│  │  Image       │     │  Text to     │              │
│  │              │     │  Image       │              │
│  │  5 prompts   │     │  Edit        │              │
│  │  available   │     │  existing    │              │
│  │              │     │  images      │              │
│  └──────────────┘     └──────────────┘              │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  💡 Tip: Text to Image creates new slides,   │   │
│  │  Image + Text edits existing ones with AI    │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

### Option A: Text → Image (Multi-Prompt Flow)

**Purpose**: Select prompt files from a project → generate images for each → see all results.

**Step 2a: Select Project + Prompts**

```
┌──────────────────────────────────────────────────────────────┐
│ ← Back              Text → Image Generation                  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Project                                                ▼   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Project Alpha (8 prompts)                              │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Select Prompts:                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ ☑ Slide 1: "Create a cover slide with bold headline"  │ │
│  │ ☑ Slide 2: "A split-screen design showing..."         │ │
│  │ ☐ Slide 3: "Full-bleed image with quote overlay..."   │ │
│  │ ☑ Slide 4: "Data visualization with bar chart..."     │ │
│  │ ☐ ...                                                  │ │
│  │                                                        │ │
│  │  [Select All]  [Deselect All]                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Output Folder: "Project-Alpha-Images"  [✏️]               │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  ⚠ Each image costs ~$0.02–0.08 in OpenAI credits.    │ │
│  │  Selected: 4 images ≈ $0.08–0.32 estimated cost       │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  [🖼️ Generate 4 Images]  (full-width yellow button)         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Progressive enhancement**: A dropdown per project showing preview thumbnails if images already exist for these prompts.

**Edge cases**:
- No projects with prompts: CTA "Generate prompts first" with button to go to Prompt Generation
- No prompts selected: button disabled, "Select at least one prompt"

**Step 3a: Generation Progress**

```
┌──────────────────────────────────────────────────────────────┐
│ ← Back           Generating Images...                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─── Project-Alpha-Images ───────────────────────────────┐ │
│  │                                                          │ │
│  │  ┌────────────────────────────────────────────────────┐ │ │
│  │  │ Slide 1  ──────────────────── [████████░░░░] 60%  │ │ │
│  │  │ Creating cover slide with gradient background...   │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │
│  │                                                          │ │
│  │  ┌────────────────────────────────────────────────────┐ │ │
│  │  │ Slide 2  ──────────────────── [████████░░░░] 60%  │ │ │
│  │  │ Generating split-screen design...                  │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │
│  │                                                          │ │
│  │  ┌────────────────────────────────────────────────────┐ │ │
│  │  │ Slide 4  ──────────────────── [████░░░░░░░░] 30%  │ │ │
│  │  │ Rendering data visualization...                    │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │
│  │                                                          │ │
│  │  Overall: 2/4 complete                                   │ │
│  │  ──────────────────────────────────────────────         │ │
│  │  Elapsed: 12s · Estimated remaining: 18s                │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                              │
│  [Cancel] (outline button, bottom)                           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Real-time updates**: Each slide gets its own progress bar. Failed ones show red with retry button.

**Step 4a: Results — Gallery View**

**This is the key results screen** — shows all generated images in a beautiful gallery:

```
┌──────────────────────────────────────────────────────────────┐
│ ← Project-Alpha-Images                    [📤 Export All]   │
│ 4 images generated · Total: 2.4 MB                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┬──────────────┬──────────────┬────────────┐ │
│  │              │              │              │            │ │
│  │  🖼️          │  🖼️          │  🖼️          │  🖼️        │ │
│  │  Slide 1     │  Slide 2     │  Slide 3     │  Slide 4   │ │
│  │  [⬇️] [📋]   │  [⬇️] [📋]   │  [⬇️] [📋]   │  [⬇️] [📋] │ │
│  │  1024×1280   │  1024×1280   │  1024×1280   │  1024×1280 │ │
│  └──────────────┴──────────────┴──────────────┴────────────┘ │
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  📦 Slide 1 — 2 retries needed (click to retry)         │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                              │
│  ✔ All 3 remaining succeeded without issues                  │ │
│                                                              │
│  [⬇️ Download All]   [📋 Copy All Prompts]   [↩️ Regenerate] │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Gallery interactions**:
- Tap any image: full-screen viewer with pinch-to-zoom
- Swipe left/right between images in full-screen
- Long-press an image: share sheet (expo-sharing)
- Each thumbnail has download (⬇️) and copy-to-clipboard (📋) quick buttons
- Failed slides shown as ghost cards with red border + retry button
- Bottom row: Copy All Prompts (copies the text prompts used), Regenerate (re-runs generation for selected slides)

**Full-screen image viewer**:
```
┌──────────────────────────────────────────────────────────────┐
│ [←]  2 of 4                    [⬇️] [📤] [🗑️]              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                                                              │
│                                                              │
│                    🖼️  (full screen image)                   │
│                                                              │
│                                                              │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ Prompt used: "Create a cover slide with bold headline..."    │
│ [📋 Copy Prompt]                                             │
└──────────────────────────────────────────────────────────────┘
```

**Empty results**: "No images generated yet" with illustration and "Try again" button.

---

### Option B: Image + Text → Image

**Step 2b: Select Source**

```
┌──────────────────────────────────────────────────────────────┐
│ ← Back           Image + Text → Image                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Step 1: Choose Image Source                                 │
│                                                              │
│  [📁 From ZIP Project]     [📱 From Gallery]                 │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Selected: Project-Alpha-Images (4 images)              │ │
│  │                                                         │ │
│  │  [☑] slide-1.png  [☑] slide-2.png  [☐] slide-3.png    │ │
│  │  [☐] slide-4.png                                       │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Step 2: Choose Edit Prompt                                  │
│                                                              │
│  [📝 From Snippets ▼]     [✏️ Write Custom]                 │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Selected: "Dark Mode Conversion" (from snippets)       │ │
│  │ ───────────────────────────────────────────────────    │ │
│  │ Content: "Change background to dark mode, make text    │ │
│  │ white, add gradient overlay, modernize typography..."   │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Or type your own:                                          │ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ "Change the background to dark mode...                 │ │
│  │  "                                                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Output Folder: "Edited-Project-Alpha"  [✏️]               │
│                                                              │
│  [🖼️ Generate 3 Edited Images]                              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Step 2b flow details**:
- "From ZIP Project" — lists all projects that have extracted images
- "From Gallery" — opens `expo-image-picker` with multi-select
- Prompt can come from saved snippets (dropdown) OR custom typed text
- If selecting from snippets, choosing one fills the textarea (editable)
- After selection, the generate button shows count

**Step 3b-4b**: Same progress + results screens as Option A, but:
- Results show "before/after" comparison toggle
- Image naming: `original-name_edited.png`
- Full-screen viewer shows original side-by-side with edited version

---

## Screen 8: Image Extraction from ZIP

**Entry**: Tap "Image Extraction from ZIP" card on Home

**Visual**:

```
┌──────────────────────────────────────────────────────────────┐
│ ← Back           Extract Images from ZIP                    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                                                        │ │
│  │                     📦                                 │ │
│  │                                                         │ │
│  │              Tap to select a ZIP file                   │ │
│  │                                                         │ │
│  │    Supports: .zip files containing PNG, JPG, JPEG,     │ │
│  │    WEBP images                                          │ │
│  │                                                         │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  [📁 Select ZIP File]  (full-width button)                  │
│                                                              │
│  ──────────────── or ────────────────                        │
│                                                              │
│  [📱 Select Images Directly] (outline, opens gallery)        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**After selecting a ZIP**:

```
┌──────────────────────────────────────────────────────────────┐
│ ← Back           Extract Images from ZIP                    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ✅ Selected: carousel-assets.zip (2.4 MB)                  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  📋 Contents (6 images found):                         │ │
│  │                                                        │ │
│  │  [☑] page-1.png  [☑] page-2.png  [☑] page-3.png       │ │
│  │  [☑] page-4.png  [☑] page-5.png  [☑] page-6.png       │ │
│  │                                                        │ │
│  │  [Select All]  [Deselect All]                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Project Name: "carousel-assets"  [✏️]                     │
│                                                              │
│  [📦 Extract 6 Images]  (yellow button)                     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Extraction progress**:

```
┌──────────────────────────────────────────────────────────────┐
│ ← Back           Extracting...                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  📦 Extracting 6 images...                             │ │
│  │                                                        │ │
│  │  [████████████████████░░░░░░░░]  4/6                   │ │
│  │                                                        │ │
│  │  ✔ page-1.png — 420 KB                                 │ │
│  │  ✔ page-2.png — 380 KB                                 │ │
│  │  ✔ page-3.png — 510 KB                                 │ │
│  │  ✔ page-4.png — 290 KB                                 │ │
│  │  ⟳ page-5.png — Extracting...                          │ │
│  │  ⏳ page-6.png — Pending                                │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**After extraction** — shows the project's image gallery (same gallery component used in Image Generation results):

```
┌──────────────────────────────────────────────────────────────┐
│ ← carousel-assets                          [📤 Export All]  │
│ 6 images extracted · 2.3 MB                                │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────┬──────┬──────┐                                     │
│  │ 🖼️   │ 🖼️   │ 🖼️   │                                     │
│  │ pg-1 │ pg-2 │ pg-3 │                                     │
│  ├──────┼──────┼──────┤                                     │
│  │ 🖼️   │ 🖼️   │ 🖼️   │                                     │
│  │ pg-4 │ pg-5 │ pg-6 │                                     │
│  └──────┴──────┴──────┘                                     │
│                                                              │
│  Quick Actions:                                              │
│  [🖼️ Send to Image+Text Edit]  [✏️ Generate Prompts]       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Quick actions after extraction**:
- "Send to Image+Text Edit" — goes to Image+Text screen with these images pre-selected
- A future link: "Generate Prompts from these images" — sends to vision API

---

## Screen 9: Prompts Snippets

**Entry**: Via bottom tab (📋 Prompts)

**Purpose**: Store frequently used prompt templates as key-value pairs (title + content). One-tap copy.

```
┌──────────────────────────────────────────────────────────────┐
│ 📋 Prompt Snippets                           [+ Add New]    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  🔍 Search snippets...                                      │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 🎨 Dark Mode Conversion                      [📋 Copy] │ │
│  │ Change background to dark mode, make text white, add   │ │
│  │ gradient overlay, modernize typography...               │ │
│  │                                              2 days ago │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 🖼️ Vintage Photo Style                      [📋 Copy] │ │
│  │ Apply warm sepia tones, add film grain texture, soft   │ │
│  │ vignette effect, vintage paper background...            │ │
│  │                                              1 week ago │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 📊 Data Visualization                        [📋 Copy] │ │
│  │ Clean minimalist chart style, white background, bold   │ │
│  │ data labels...                                          │ │
│  │                                              Just now   │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Each snippet card**:
- Icon (auto-generated from first word or emoji prefix)
- **Title** (bold, white)
- **Content** (2-line preview, text-secondary, truncated)
- **Timestamp** (small, text-muted)
- **Copy button** (📋) — one tap copies content to clipboard with toast "Copied!"
- Tap the card: expands to show full content + edit/delete options

**Add/Edit Snippet (modal)**:

```
┌──────────────────────────────────────────────────────────────┐
│                    Add New Snippet                    [Save] │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Title:                                                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ e.g. "Dark Mode Conversion"                           │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Prompt Content:                                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                                                        │ │
│  │  "Change background to dark mode..."                   │ │
│  │                                                        │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  [📋 Paste from Clipboard]                                   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Swipe to delete**: Right-to-left swipe reveals red "Delete" button with confirmation.

**Empty state**: "No saved snippets yet" + "Create your first snippet to quickly access your favorite prompts" + `[+ Create Snippet]`

---

## Screen 10: Theme Page

**Entry**: Via bottom tab (🎨 Theme)

**Purpose**: Switch between saved themes, create new ones, edit existing.

```
┌──────────────────────────────────────────────────────────────┐
│ 🎨 Theme                            [+ Create New Theme]    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Current Theme: "Sunset Yellow"                         [✓] │
│                                                              │
│  ┌─ Theme Cards (horizontal scroll) ──────────────────────┐ │
│  │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                   │ │
│  │ │ 🟡   │ │ 🟢   │ │ 🔵   │ │ 🟣   │                   │ │
│  │ │Sunset│ │Mint  │ │Ocean │ │Lav.  │                   │ │
│  │ └──────┘ └──────┘ └──────┘ └──────┘                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Active Theme Preview:                                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                                                        │ │
│  │          🎠  SAMPLE SLIDE                              │ │
│  │                                                        │ │
│  │     Bold Headline Here                                 │ │
│  │     • accent color used for highlights                 │ │
│  │     • Inter font displayed here                        │ │
│  │     • dark background with yellow accents              │ │
│  │                                                        │ │
│  │          → Swipe                                        │ │
│  │                                                        │ │
│  │  Accent: #FFF200  ·  Font: Inter                       │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Theme Details:                                         │ │
│  │                                                        │ │
│  │  Accent Color:    ⬤ #FFF200                    [✏️]   │ │
│  │  Font:            Inter — Regular              [✏️]   │ │
│  │  Extra Instr.:    "Make it look modern..."     [✏️]   │ │
│  │                                                        │ │
│  │  [🗑️ Delete Theme]  (only if not the only theme)      │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Create/Edit Theme** (full-screen or bottom sheet):

```
┌──────────────────────────────────────────────────────────────┐
│ ← Back              Create New Theme                 [Save] │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Theme Name:                                                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ "Sunset Yellow"                                       │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Accent Color:                                             │ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  ⬤ #FFF200       [Pick from Presets]                  │ │
│  │                                                        │ │
│  │  [🟡] [🟢] [🔵] [🟣] [🔴] [🟠] [🩵] [🩷]              │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Font:                                                      │ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ [Inter           ▼]  Sample: "Aa"                     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Extra Instructions (optional):                              │ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ "Make it look like a torn paper collage..."            │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Theme presets** — visual color swatches:
- Each preset = a small card showing the color + name
- Tapping a preset fills the hex field
- Predefined: Sunset Yellow (#FFF200), Mint Green (#34D399), Ocean Blue (#3B82F6), Royal Purple (#8B5CF6), Ruby Red (#EF4444), Tangerine (#F97316), Sky Blue (#0EA5E9), Hot Pink (#EC4899)

---

## Screen 11: Settings Page

**Entry**: Via bottom tab (⚙️ Settings)

```
┌──────────────────────────────────────────────────────────────┐
│ ⚙️ Settings                                                  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              API Configuration                         │ │
│  │                                                        │ │
│  │  API Provider: OpenAI                              ▼  │ │
│  │                                                        │ │
│  │  API Key:                                              │ │
│  │  ┌────────────────────────────────────[👁️] [✏️]────┐ │ │
│  │  │ sk-****-****-****-**********                    │ │ │
│  │  └───────────────────────────────────────────────────┘ │ │
│  │                                                        │ │
│  │  Key Status: ✅ Connected (valid)                     │ │
│  │                                                        │ │
│  │  [🔄 Validate Key]  [✏️ Change Key]                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Image Generation Defaults                 │ │
│  │                                                        │ │
│  │  Image Size:                                    ▼      │ │
│  │  ┌────────────────────────────────────────────────┐    │ │
│  │  │ 1024 × 1280 (Portrait — Instagram/LinkedIn)   │    │ │
│  │  └────────────────────────────────────────────────┘    │ │
│  │                                                        │ │
│  │  Image Quality:                                 ▼      │ │
│  │  ┌────────────────────────────────────────────────┐    │ │
│  │  │ Standard (fast, lower cost)                    │    │ │
│  │  └────────────────────────────────────────────────┘    │ │
│  │                                                        │ │
│  │  Output Format:                                ▼       │ │
│  │  ┌────────────────────────────────────────────────┐    │ │
│  │  │ PNG (lossless)                                │    │ │
│  │  └────────────────────────────────────────────────┘    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Storage                                   │ │
│  │                                                        │ │
│  │  App Data: 24.5 MB used                          [📊] │ │
│  │                                                        │ │
│  │  [🗑️ Clear All Data]    [📤 Export All Projects]      │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              About                                     │ │
│  │                                                        │ │
│  │  Version: 1.0.0                                        │ │
│  │  Built with: Expo React Native                         │ │
│  │  AI: OpenAI GPT-4o + GPT-Image-2                       │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Clear All Data** flow:
1. Tap → confirmation modal: "This will delete all projects, prompts, images, and settings. This cannot be undone."
2. Type "DELETE" to confirm
3. Red "Delete Everything" button
4. On complete: redirect to Setup screen

**Change Key flow**:
1. Tap "Change Key" → modal with current key masked
2. "Enter new key" input
3. Validate → save

---

## Cross-Screen UI Components

### Toast / Snackbar
- Appears from bottom, slides up
- Yellow accent on left edge
- Icon + message
- Auto-dismiss after 3s
- Types: success (green), error (red), info (yellow)

### Bottom Sheet Modals
Used for: edit prompt, add snippet, confirm delete, change key
- Slides up from bottom
- Semi-transparent overlay
- Handle bar at top (draggable)
- Rounded top corners (16px)

### Empty States
Each feature has a custom illustrated empty state with:
- Simple line-art illustration (emoji-based or SVG)
- Bold heading
- Descriptive subtext
- Primary action button

### Loading States
- Skeleton loaders for card lists (pulsing gray rectangles)
- Full-screen spinner for critical operations
- Inline progress bars for multi-step operations

### Confirmation Dialogs
- Title + message
- Cancel (outline) + Confirm (filled) buttons
- Destructive actions: red Confirm button
- "Don't ask again" checkbox for repetitive actions

---

## Complete App Flow Diagram

```
Splash
  ├── No API Key → Setup: API Key
  │                    └── Setup: Theme → Home
  ├── No Theme → Setup: Theme → Home
  └── Both exist → Home

Home [Bottom Tab: Home]
  ├── Project Sidebar (toggle)
  │    ├── Select project → shows project files
  │    ├── New Project → creates empty project
  │    └── Long-press → Rename / Delete
  │
  ├── Card: Prompt Generation
  │    └── JSON Input screen
  │         └── Submit → Loading → Created Prompts screen (per project)
  │              ├── Edit prompt (modal)
  │              ├── Delete prompt (confirm)
  │              ├── Reorder prompts (drag)
  │              ├── Copy All / Export
  │              └── "Generate Images" → Image Gen mode
  │
  ├── Card: Image Generation
  │    ├── Mode Select: Text→Image or Image+Text→Image
  │    │
  │    ├── [Text→Image]
  │    │    ├── Select project folder (dropdown)
  │    │    ├── Select prompt files (checkboxes)
  │    │    ├── Set output folder name
  │    │    ├── Generate → Progress screen
  │    │    └── Results gallery
  │    │         ├── Full-screen viewer (swipe, pinch-zoom)
  │    │         ├── Download individual / all
  │    │         ├── Copy prompt used
  │    │         ├── Share
  │    │         ├── Retry failed
  │    │         └── Export
  │    │
  │    └── [Image+Text→Image]
  │         ├── Select images (from ZIP project or gallery)
  │         ├── Select edit prompt (from snippets or custom)
  │         ├── Set output folder
  │         ├── Generate → Progress
  │         └── Results gallery (before/after toggle)
  │
  ├── Card: Image Extraction from ZIP
  │    ├── Select ZIP file (document picker)
  │    ├── Preview contents (checkboxes)
  │    ├── Extract → Progress
  │    └── Extracted images gallery
  │         ├── Full-screen viewer
  │         ├── Quick action: Send to Image+Text Edit
  │         └── Export

  └── Recent Activity (auto-generated list)

Prompts Snippets [Bottom Tab: 📋]
  ├── Search bar
  ├── List of saved snippets (title + preview + copy button)
  │    ├── Tap → expand full content
  │    │    ├── Edit (modal)
  │    │    ├── Delete (swipe or button)
  │    │    └── Copy
  │    └── [Add New] → modal (title + content)
  └── Empty state → create first

Theme [Bottom Tab: 🎨]
  ├── Horizontal theme carousel (tap to switch)
  ├── Active theme preview (mockup card)
  ├── Theme details (color, font, instructions)
  │    ├── Edit color → hex input + presets
  │    ├── Edit font → dropdown
  │    ├── Edit instructions → text input
  │    └── Delete theme
  └── [Create New Theme] → full theme editor

Settings [Bottom Tab: ⚙️]
  ├── API Configuration (key, validation, change)
  ├── Image Defaults (size, quality, format)
  ├── Storage (usage, clear all, export all)
  └── About (version, tech stack)
```

---

## UX Principles Applied

1. **Progressive disclosure**: Show essential actions first, advanced options on demand
2. **Skeleton loading**: Never show blank screen while loading
3. **Optimistic updates**: Show changes immediately, sync in background
4. **Error recovery**: Every failed action has a retry mechanism
5. **Consistent undo**: Destructive actions always ask for confirmation
6. **One primary action per screen**: Yellow button is always the main CTA
7. **Gestures**: Swipe to delete, pull to refresh, pinch to zoom, drag to reorder
8. **Feedback**: Every user action gets visual feedback (toast, animation, haptic)
9. **Dark mode by default**: All screens designed for dark background
10. **Accessibility**: Minimum 4.5:1 contrast ratio, touch targets ≥ 48px

# My Ideas Board

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Personal ideas board website where the user can continuously post and host new ideas
- Each idea has a title, description, category/tag, and creation date
- Ability to add new ideas via a form
- Ability to view all ideas in a card grid layout
- Ability to delete ideas
- Ability to mark ideas as "favorite" or star them
- Filter/search ideas by keyword or category
- Persistent storage of ideas on the backend

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Backend: Store ideas with fields (id, title, description, category, createdAt, isFavorite)
2. Backend: CRUD operations — create idea, list ideas, delete idea, toggle favorite
3. Frontend: Home page with idea card grid, add idea button (modal/form), search bar, category filter tabs
4. Frontend: Clean, modern personal-blog-style design with warm colors

## UX Notes
- Single-page layout, minimal navigation
- Prominent "Add Idea" button always visible
- Cards show title, short description snippet, category badge, date, and favorite star
- Responsive grid (1 col mobile, 2-3 col desktop)
- Empty state message when no ideas yet

# Labas123

## Kanban board
A minimal in-browser Kanban board with To Do, In Progress, and Done columns. Tasks can be created, edited, deleted, and moved between columns via drag-and-drop.

### Setup
1. Ensure you have a modern web browser.
2. Open `src/index.html` directly in the browser (no build step required).

### Usage
- Fill the **Title** and optional **Description** fields, then click **Add Task** to create a card in the **To Do** column.
- Use **Edit** on a card to update its title or description.
- Use **Delete** to remove a card.
- Drag a card to another column to change its status.
- Tasks persist in `localStorage`, so they remain when you refresh.

### Project structure
- `src/index.html` — Page layout and task creation form.
- `src/style.css` — Styling for the board, columns, and tasks.
- `src/app.js` — Client-side logic for CRUD actions, rendering, and drag-and-drop.

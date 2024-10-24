import { http, HttpResponse } from "msw";
import cardData from "./data.json";

export const handlers = [
  // Mock GET /api/cards
  http.get("/api/tasks", () => {
    return HttpResponse.json(cardData);
  }),

  // Mock POST /api/cards
  http.post("/api/cards", async ({ request }) => {
    // Read the intercepted request body as JSON.
    const newCards = await request.json();
    localStorage.setItem("cards", JSON.stringify(newCards));
    return HttpResponse.json(newCards, { status: 201 });
  }),
];
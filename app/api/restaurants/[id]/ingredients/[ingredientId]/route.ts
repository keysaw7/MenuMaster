export async function DELETE(request: Request, context: { params: { id: string, ingredientId: string } }) {
  try {
    // Récupérer les IDs depuis les paramètres de route
    const restaurantId = await context.params.id;
    const ingredientId = await context.params.ingredientId;
    
    if (!restaurantId || !ingredientId) {
      // ... existing code ...
    }
  } catch (error) {
    // ... existing code ...
  }
}

export async function PATCH(request: Request, context: { params: { id: string, ingredientId: string } }) {
  try {
    // Récupérer les IDs depuis les paramètres de route
    const restaurantId = await context.params.id;
    const ingredientId = await context.params.ingredientId;
    
    if (!restaurantId || !ingredientId) {
      // ... existing code ...
    }
  } catch (error) {
    // ... existing code ...
  }
} 
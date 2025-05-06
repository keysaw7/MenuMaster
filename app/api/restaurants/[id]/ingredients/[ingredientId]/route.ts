export async function DELETE(request: Request, { params }: { params: { id: string, ingredientId: string } }) {
  try {
    // Récupérer les IDs depuis les paramètres de route
    const restaurantId = await params.id;
    const ingredientId = await params.ingredientId;
    
    if (!restaurantId || !ingredientId) {
      // ... existing code ...
    }
  } catch (error) {
    // ... existing code ...
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string, ingredientId: string } }) {
  try {
    // Récupérer les IDs depuis les paramètres de route
    const restaurantId = await params.id;
    const ingredientId = await params.ingredientId;
    
    if (!restaurantId || !ingredientId) {
      // ... existing code ...
    }
  } catch (error) {
    // ... existing code ...
  }
} 
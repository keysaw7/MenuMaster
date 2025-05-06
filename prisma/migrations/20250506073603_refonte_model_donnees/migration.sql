-- CreateTable
CREATE TABLE "Restaurant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cuisine" JSONB NOT NULL,
    "address" JSONB NOT NULL,
    "contact" JSONB NOT NULL,
    "hours" JSONB NOT NULL,
    "settings" JSONB NOT NULL,
    "features" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Theme" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "restaurantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "colors" JSONB NOT NULL,
    "typography" JSONB NOT NULL,
    "components" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Theme_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "restaurantId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "mediumUrl" TEXT,
    "largeUrl" TEXT,
    "alt" TEXT,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "dimensions" JSONB,
    "tags" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MediaAsset_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CustomTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "restaurantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CustomTemplate_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Menu" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "restaurantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "availability" JSONB NOT NULL,
    "categories" JSONB NOT NULL,
    "themeId" TEXT,
    "template" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Menu_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DailyMenu" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "restaurantId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "weather" JSONB,
    "starters" JSONB NOT NULL,
    "mains" JSONB NOT NULL,
    "desserts" JSONB NOT NULL,
    "price" REAL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "themeId" TEXT,
    "template" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DailyMenu_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isAllergen" BOOLEAN NOT NULL DEFAULT false,
    "allergenType" TEXT,
    "dietaryRestrictions" JSONB NOT NULL,
    "season" JSONB,
    "properties" JSONB,
    "nutritionalInfo" JSONB,
    "temperature" TEXT,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "IngredientInventory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "restaurantId" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "unit" TEXT NOT NULL,
    "stock" INTEGER,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "purchasePrice" REAL,
    "supplier" TEXT,
    "expiryDate" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "IngredientInventory_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "IngredientInventory_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "preferences" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "UsersOnRestaurants" (
    "userId" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("userId", "restaurantId"),
    CONSTRAINT "UsersOnRestaurants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UsersOnRestaurants_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Theme_restaurantId_idx" ON "Theme"("restaurantId");

-- CreateIndex
CREATE INDEX "MediaAsset_restaurantId_idx" ON "MediaAsset"("restaurantId");

-- CreateIndex
CREATE INDEX "MediaAsset_type_category_idx" ON "MediaAsset"("type", "category");

-- CreateIndex
CREATE INDEX "CustomTemplate_restaurantId_idx" ON "CustomTemplate"("restaurantId");

-- CreateIndex
CREATE INDEX "CustomTemplate_type_idx" ON "CustomTemplate"("type");

-- CreateIndex
CREATE INDEX "Menu_restaurantId_idx" ON "Menu"("restaurantId");

-- CreateIndex
CREATE INDEX "DailyMenu_restaurantId_date_idx" ON "DailyMenu"("restaurantId", "date");

-- CreateIndex
CREATE INDEX "IngredientInventory_restaurantId_idx" ON "IngredientInventory"("restaurantId");

-- CreateIndex
CREATE INDEX "IngredientInventory_ingredientId_idx" ON "IngredientInventory"("ingredientId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "UsersOnRestaurants_userId_idx" ON "UsersOnRestaurants"("userId");

-- CreateIndex
CREATE INDEX "UsersOnRestaurants_restaurantId_idx" ON "UsersOnRestaurants"("restaurantId");

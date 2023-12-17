interface Item {
  name: string;
  image_url?: string;
  wiki_link?: string;
  versions?: Version[];
}

interface ItemWithDetails extends Item {
  type?: string;
  placeable?: boolean;
  use_time?: string;
  rarity?: string;
  sell?: string;
  internal_item_id?: string;
  craftable?: boolean;
}

interface Version {
  name: string;
  icon_url: string;
}

interface CraftingStation extends Item {}

interface Ingredient extends Item {
  quantity?: number;
}

interface Recipe {
  result: Item;
  ingredients: Ingredient[];
  crafting_station: CraftingStation;
}

export type Ingredient = {
  id: number;
  description: string;
};

export type Step = {
  id: number;
  description: string;
};

export type Recipe = {
  id: string;
  title: string;
  ingredients: Ingredient[];
  steps: Step[];
  likes: number;
};

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import z from 'zod';

export const categoryScheme = z.object({
  id: z.number().optional(),
  name: z.string(),
  description: z.string().optional(),
  forIncome: z.boolean(),
  errors: z
    .object({
      name: z.string().optional(),
      description: z.string().optional()
    })
    .optional()
});

export type Category = z.infer<typeof categoryScheme>;

export const isCategory = (object: unknown): object is Category => {
  return categoryScheme.safeParse(object).success;
};

type UpdateableCategory = Category & {
  readonly comparativeName: string;
  readonly comparativeDescription?: string;
};

export const convertToUpdateableCategory = (category: Category): UpdateableCategory => ({
  ...category,
  comparativeName: category.name,
  comparativeDescription: category.description,
  errors: undefined
});

interface Categories {
  readonly categories: Category[];
  readonly createdCategory?: Category;
  readonly viewedCategory?: UpdateableCategory;
  readonly deletedCategory?: Category;
}

const initialState: Categories = {
  categories: []
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (state: Categories, action: PayloadAction<Category[]>) => ({ ...state, categories: action.payload }),
    setCreatedCategory: (state: Categories, action: PayloadAction<Category | undefined>) => ({
      ...state,
      createdCategory: action.payload
    }),
    setViewedCategory: (state: Categories, action: PayloadAction<UpdateableCategory | undefined>) => ({
      ...state,
      viewedCategory: action.payload
    }),
    setDeletedCategory: (state: Categories, action: PayloadAction<Category | undefined>) => ({
      ...state,
      deletedCategory: action.payload
    })
  }
});

export const { setCategories, setCreatedCategory, setViewedCategory, setDeletedCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;

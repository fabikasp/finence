import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import z from 'zod';

const categoryScheme = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  forIncome: z.boolean()
});

type Category = z.infer<typeof categoryScheme>;

export const isCategory = (object: unknown): object is Category => {
  return categoryScheme.safeParse(object).success;
};

interface Categories {
  readonly categories: Category[];
  readonly viewedCategory: Category | undefined;
  readonly deletedCategoryId: number | undefined;
}

const initialState: Categories = {
  categories: [],
  viewedCategory: undefined,
  deletedCategoryId: undefined
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (state: Categories, action: PayloadAction<Category[]>) => ({ ...state, categories: action.payload }),
    setViewedCategory: (state: Categories, action: PayloadAction<Category | undefined>) => ({
      ...state,
      viewedCategory: action.payload
    }),
    setDeletedCategoryId: (state: Categories, action: PayloadAction<number | undefined>) => ({
      ...state,
      deletedCategoryId: action.payload
    })
  }
});

export const { setCategories, setViewedCategory, setDeletedCategoryId } = categoriesSlice.actions;
export default categoriesSlice.reducer;

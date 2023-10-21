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

interface CategoryErrors {
  name: string;
  description: string;
}

type EditableCategory = { readonly description: string; errors: CategoryErrors } & Pick<Category, 'name' | 'forIncome'>;

interface Categories {
  readonly categories: Category[];
  readonly createdCategory?: EditableCategory;
  readonly viewedCategory?: Category;
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
    setCreatedCategory: (state: Categories, action: PayloadAction<EditableCategory | undefined>) => ({
      ...state,
      createdCategory: action.payload
    }),
    setViewedCategory: (state: Categories, action: PayloadAction<Category | undefined>) => ({
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

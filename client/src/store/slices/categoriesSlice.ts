import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import z from 'zod';

const categoryScheme = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  forIncome: z.boolean()
});

export type Category = z.infer<typeof categoryScheme>;

export const isCategory = (object: unknown): object is Category => {
  return categoryScheme.safeParse(object).success;
};

interface CategoryErrors {
  name: string;
  description: string;
}

type CreateableCategory = { readonly description: string; errors: CategoryErrors } & Pick<
  Category,
  'name' | 'forIncome'
>;
type UpdateableCategory = CreateableCategory & { id: number; comparativeName: string; comparativeDescription: string };

export const convertToUpdateableCategory = (category: Category): UpdateableCategory => ({
  id: category.id,
  name: category.name,
  comparativeName: category.name,
  description: category.description ?? '',
  comparativeDescription: category.description ?? '',
  forIncome: category.forIncome,
  errors: {
    name: '',
    description: ''
  }
});

interface Categories {
  readonly categories: Category[];
  readonly createdCategory?: CreateableCategory;
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
    setCreatedCategory: (state: Categories, action: PayloadAction<CreateableCategory | undefined>) => ({
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

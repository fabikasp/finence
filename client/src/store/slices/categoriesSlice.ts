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

interface CategoriesErrors {
  readonly name: string;
  readonly description: string;
}

interface Categories {
  readonly categories: Category[];
  readonly name: string;
  readonly description: string;
  readonly forIncome: boolean;
  readonly errors: CategoriesErrors;
}

const initialState: Categories = {
  categories: [],
  name: '',
  description: '',
  forIncome: true,
  errors: {
    name: '',
    description: ''
  }
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (state: Categories, action: PayloadAction<Category[]>) => ({ ...state, categories: action.payload }),
    setName: (state: Categories, action: PayloadAction<string>) => ({ ...state, name: action.payload }),
    setDescription: (state: Categories, action: PayloadAction<string>) => ({ ...state, description: action.payload }),
    setForIncome: (state: Categories, action: PayloadAction<boolean>) => ({ ...state, forIncome: action.payload }),
    setErrors: (state: Categories, action: PayloadAction<CategoriesErrors>) => ({ ...state, errors: action.payload })
  }
});

export const { setCategories, setName, setDescription, setForIncome, setErrors } = categoriesSlice.actions;
export default categoriesSlice.reducer;

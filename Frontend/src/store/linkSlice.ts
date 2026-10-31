// src/redux/linksSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Link {
  originalUrl: string;
  shortId: string;
  createdAt: string;
  expiryDate: string;
  uniqueClicks: number;
}

interface LinksState {
  links: Link[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: LinksState = {
  links: [],
  loading: false,
  error: null,
};

// Async thunk for fetching links
export const fetchLinks = createAsyncThunk(
  "links/fetchLinks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/urls/all`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        return response.data.urls;
      } else {
        throw new Error("Failed to fetch URLs.");
      }
    } catch (error) {
      return rejectWithValue("Error fetching URLs.");
    }
  }
);

// Slice
const linksSlice = createSlice({
  name: "links",
  initialState,
  reducers: {
    setLinks(state, action: PayloadAction<Link[]>) {
        const existingShortIds = new Set(state.links.map(link => link.shortId));
        const uniqueLinks = action.payload.filter(link => !existingShortIds.has(link.shortId));
        state.links = [...state.links, ...uniqueLinks];
      },
      
    addLink(state, action: PayloadAction<Link>) {
      state.links.push(action.payload);
    },

    deleteLink(state, action: PayloadAction<string>) {
      state.links = state.links.filter(
        (link) => link.shortId !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLinks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLinks.fulfilled, (state, action: PayloadAction<Link[]>) => {
        state.links = action.payload;
        state.loading = false;
      })
      .addCase(fetchLinks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setLinks, addLink,deleteLink } = linksSlice.actions;
export default linksSlice.reducer;

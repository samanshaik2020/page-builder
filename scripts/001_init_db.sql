-- Create a table for user profiles
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable Row Level Security (RLS) for the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view and update their own profile
CREATE POLICY "Users can view their own profile." ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Create a table for user-created pages
CREATE TABLE public.pages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  slug text UNIQUE NOT NULL, -- Unique slug for public access
  elements jsonb NOT NULL, -- Store the page elements as JSONB
  is_published boolean DEFAULT FALSE NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable Row Level Security (RLS) for the pages table
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to create their own pages
CREATE POLICY "Users can create their own pages." ON public.pages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to view their own pages
CREATE POLICY "Users can view their own pages." ON public.pages FOR SELECT USING (auth.uid() = user_id);

-- Policy to allow users to update their own pages
CREATE POLICY "Users can update their own pages." ON public.pages FOR UPDATE USING (auth.uid() = user_id);

-- Policy to allow users to delete their own pages
CREATE POLICY "Users can delete their own pages." ON public.pages FOR DELETE USING (auth.uid() = user_id);

-- Policy to allow public viewing of published pages
CREATE POLICY "Public can view published pages." ON public.pages FOR SELECT USING (is_published = TRUE);

-- Set up a trigger to update the 'updated_at' column automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pages_updated_at
BEFORE UPDATE ON public.pages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create a function to handle new user sign-ups and create a profile entry
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the handle_new_user function on auth.users inserts
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

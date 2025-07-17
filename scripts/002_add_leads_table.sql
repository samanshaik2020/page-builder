-- Create a table for capturing lead emails
CREATE TABLE public.leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id uuid REFERENCES public.pages(id) ON DELETE CASCADE NOT NULL,
  email text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable Row Level Security (RLS) for the leads table
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Policy to allow anonymous users to insert new leads
CREATE POLICY "Anonymous users can insert leads." ON public.leads FOR INSERT WITH CHECK (true);

-- Policy to allow authenticated users (page owners) to view leads for their pages
CREATE POLICY "Authenticated users can view leads for their pages." ON public.leads FOR SELECT USING (EXISTS (SELECT 1 FROM public.pages WHERE id = page_id AND user_id = auth.uid()));

-- Add a unique constraint to prevent duplicate emails for the same page (optional, but good for data cleanliness)
ALTER TABLE public.leads ADD CONSTRAINT unique_email_per_page UNIQUE (page_id, email);

-- Create user profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
CREATE POLICY "Users can view their own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
CREATE POLICY "Users can insert their own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create landing_pages table
CREATE TABLE IF NOT EXISTS public.landing_pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    elements_data JSONB NOT NULL DEFAULT '{}',
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    template_id TEXT NOT NULL
);

-- Create collected_emails table
CREATE TABLE IF NOT EXISTS public.collected_emails (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    landing_page_id UUID REFERENCES public.landing_pages(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    collected_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_agent TEXT,
    ip_address INET
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_landing_pages_user_id ON public.landing_pages(user_id);
CREATE INDEX IF NOT EXISTS idx_landing_pages_slug ON public.landing_pages(slug);
CREATE INDEX IF NOT EXISTS idx_landing_pages_published ON public.landing_pages(is_published);
CREATE INDEX IF NOT EXISTS idx_collected_emails_landing_page_id ON public.collected_emails(landing_page_id);
CREATE INDEX IF NOT EXISTS idx_collected_emails_email ON public.collected_emails(email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collected_emails ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for landing_pages
DROP POLICY IF EXISTS "Users can view their own landing pages" ON public.landing_pages;
CREATE POLICY "Users can view their own landing pages" ON public.landing_pages
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own landing pages" ON public.landing_pages;
CREATE POLICY "Users can insert their own landing pages" ON public.landing_pages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own landing pages" ON public.landing_pages;
CREATE POLICY "Users can update their own landing pages" ON public.landing_pages
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own landing pages" ON public.landing_pages;
CREATE POLICY "Users can delete their own landing pages" ON public.landing_pages
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for collected_emails
DROP POLICY IF EXISTS "Users can view emails from their landing pages" ON public.collected_emails;
CREATE POLICY "Users can view emails from their landing pages" ON public.collected_emails
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.landing_pages 
            WHERE landing_pages.id = collected_emails.landing_page_id 
            AND landing_pages.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Anyone can insert emails to published landing pages" ON public.collected_emails;
CREATE POLICY "Anyone can insert emails to published landing pages" ON public.collected_emails
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.landing_pages 
            WHERE landing_pages.id = collected_emails.landing_page_id 
            AND landing_pages.is_published = true
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_landing_pages_updated_at
    BEFORE UPDATE ON public.landing_pages
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

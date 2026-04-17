CREATE POLICY "Users can see their own folders" ON public.folders FOR SELECT USING (auth.uid() = user_id);

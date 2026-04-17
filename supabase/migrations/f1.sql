ALTER TABLE public.forms ADD COLUMN IF NOT EXISTS folder_id bigint REFERENCES public.folders(id) ON DELETE SET NULL;

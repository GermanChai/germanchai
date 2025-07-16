-- Create policies to allow admin users to manage menu items
CREATE POLICY "Admins can insert menu items" 
ON public.menu_items 
FOR INSERT 
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update menu items" 
ON public.menu_items 
FOR UPDATE 
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can delete menu items" 
ON public.menu_items 
FOR DELETE 
TO authenticated
USING (public.is_admin());
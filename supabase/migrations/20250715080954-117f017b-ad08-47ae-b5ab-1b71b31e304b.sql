-- Create a policy to allow admin users to view all orders
CREATE POLICY "Admins can view all orders" 
ON public.orders 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND (auth.users.raw_user_meta_data->>'role')::text = 'admin'
  )
);

-- Also create a policy to allow admin users to update all orders (for status changes)
CREATE POLICY "Admins can update all orders" 
ON public.orders 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND (auth.users.raw_user_meta_data->>'role')::text = 'admin'
  )
);

-- Create similar policies for order_items so admins can see all order items
CREATE POLICY "Admins can view all order items" 
ON public.order_items 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND (auth.users.raw_user_meta_data->>'role')::text = 'admin'
  )
);
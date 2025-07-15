
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Profile = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address_line: '',
    label: '',
  });
  const queryClient = useQueryClient();
  
  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: addresses, isLoading: addressesLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
  });

  const addAddressMutation = useMutation({
    mutationFn: async (newAddressData: typeof newAddress) => {
      const { error } = await supabase
        .from('addresses')
        .insert({
          user_id: user?.id,
          address_line: newAddressData.address_line,
          label: newAddressData.label,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast({
        title: "Address added",
        description: "Your new address has been added successfully.",
      });
      setNewAddress({ address_line: '', label: '' });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: async (addressId: string) => {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast({
        title: "Address deleted",
        description: "The address has been removed from your profile.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const handleEdit = () => {
    setFormData({
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // Use upsert to insert or update the profile
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          ...formData
        });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      setIsEditing(false);
      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleAddAddress = () => {
    if (!newAddress.address_line || !newAddress.label) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all address fields",
      });
      return;
    }
    addAddressMutation.mutate(newAddress);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (isLoading || addressesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input value={user?.email || ''} disabled />
            </div>

            {isEditing ? (
              <>
                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={formData.full_name}
                    onChange={e => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label>Full Name</Label>
                  <p className="mt-1">{profile?.full_name || 'Not set'}</p>
                </div>
                
                <div>
                  <Label>Phone</Label>
                  <p className="mt-1">{profile?.phone || 'Not set'}</p>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button onClick={handleEdit}>
                    Edit Profile
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Addresses Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Addresses</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Address
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Address</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Address Label (e.g., Home, Work)</Label>
                    <Input
                      value={newAddress.label}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, label: e.target.value }))}
                      placeholder="Home"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input
                      value={newAddress.address_line}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, address_line: e.target.value }))}
                      placeholder="Enter your address"
                    />
                  </div>
                  <Button 
                    className="w-full"
                    onClick={handleAddAddress}
                    disabled={addAddressMutation.isPending}
                  >
                    {addAddressMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Add Address'
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {addresses?.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                You haven't added any addresses yet
              </p>
            ) : (
              addresses?.map((address) => (
                <div
                  key={address.id}
                  className="flex justify-between items-center p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{address.label}</p>
                    <p className="text-gray-600">{address.address_line}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteAddressMutation.mutate(address.id)}
                    disabled={deleteAddressMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

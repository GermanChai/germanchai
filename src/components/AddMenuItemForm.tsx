
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";

interface NewItem {
  name: string;
  description: string;
  price: string;
  category: string;
}

interface AddMenuItemFormProps {
  onSubmit: (e: React.FormEvent, imageFile: File | null) => void;
  isUploading: boolean;
}

const AddMenuItemForm = ({ onSubmit, isUploading }: AddMenuItemFormProps) => {
  const [newItem, setNewItem] = useState<NewItem>({
    name: "",
    description: "",
    price: "",
    category: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e, imageFile);
    setNewItem({
      name: "",
      description: "",
      price: "",
      category: "",
    });
    setImageFile(null);
  };

  return (
    <div className="mb-8 p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Add Menu Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            required
          />
          <Input
            placeholder="Category"
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            required
          />
          <Input
            placeholder="Price"
            type="number"
            step="0.01"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            required
          />
          <div className="space-y-2">
            <Label htmlFor="image">Menu Item Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
            />
          </div>
        </div>
        <Textarea
          placeholder="Description"
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          required
        />
        <Button type="submit" className="w-full" disabled={isUploading}>
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default AddMenuItemForm;

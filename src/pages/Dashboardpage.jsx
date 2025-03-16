import { useSupabaseAuth } from "@/context/SupabaseAuthContext";
import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout.jsx";
import { Button } from "@/components/ui/button.jsx";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { BarChart as BarChartIcon, LineChart, Pencil, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Dashboard home component
const DashboardHome = () => {
  const { user } = useSupabaseAuth();
  return (
    <div>
      <h2 className="text-2xl font-semibold">Hello {user?.email || "User"}</h2>
      <p className="mt-2">Welcome to your dashboard</p>
    </div>
  );
};

// Products component
const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    p_name: '',
    p_description: '',
    p_price: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate price is a number
      const price = parseFloat(newProduct.p_price);
      if (isNaN(price)) {
        toast.error("Price must be a valid number");
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .insert([
          { 
            p_name: newProduct.p_name,
            p_description: newProduct.p_description,
            p_price: price
          }
        ])
        .select();

      if (error) throw error;

      // Add new product to state
      setProducts(prev => [...prev, data[0]]);
      toast.success("Product added successfully!");
      
      // Reset form and close dialog
      setNewProduct({ p_name: '', p_description: '', p_price: '' });
      setIsDialogOpen(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Products</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="p_name">Product Name</Label>
                <Input
                  id="p_name"
                  name="p_name"
                  value={newProduct.p_name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p_description">Description</Label>
                <Input
                  id="p_description"
                  name="p_description"
                  value={newProduct.p_description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p_price">Price</Label>
                <Input
                  id="p_price"
                  name="p_price"
                  type="number"
                  step="0.01"
                  value={newProduct.p_price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Add Product
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{product.p_name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {product.p_description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-2xl font-bold text-primary">
                ${product.p_price}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Individual Product Analytics Component
const ProductAnalytics = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading product analytics...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/dashboard/analyze')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Button>
        <h2 className="text-2xl font-semibold">Analytics for {product.p_name}</h2>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Overview</CardTitle>
            <CardDescription>{product.p_description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${product.p_price}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total Sales</CardTitle>
                  <div className="text-2xl font-bold">$12,450</div>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Units Sold</CardTitle>
                  <div className="text-2xl font-bold">284</div>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Average Rating</CardTitle>
                  <div className="text-2xl font-bold">4.8/5</div>
                </CardHeader>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <div className="font-medium">New Sale</div>
                  <div className="text-sm text-muted-foreground">2 units purchased</div>
                </div>
                <div className="text-sm">2 hours ago</div>
              </div>
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <div className="font-medium">Customer Review</div>
                  <div className="text-sm text-muted-foreground">5-star rating received</div>
                </div>
                <div className="text-sm">1 day ago</div>
              </div>
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <div className="font-medium">Price Update</div>
                  <div className="text-sm text-muted-foreground">Price adjusted to ${product.p_price}</div>
                </div>
                <div className="text-sm">3 days ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Analyze Feedback component
const AnalyzeFeedback = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Products Analytics</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{product.p_name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {product.p_description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-2xl font-bold text-primary">
                ${product.p_price}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                variant="default"
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => navigate(`/dashboard/analyze/${product.id}`)}
              >
                <BarChartIcon className="h-4 w-4" />
                View Analytics
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

const Dashboardpage = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/products" element={<Products />} />
        <Route path="/analyze" element={<AnalyzeFeedback />} />
        <Route path="/analyze/:productId" element={<ProductAnalytics />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboardpage;
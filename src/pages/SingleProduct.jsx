import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, AreaChart, Area } from 'recharts'
import { Loader2, TrendingUp } from 'lucide-react'

// Create chart components based on shadcn pattern
const ChartConfig = {
  positive: {
    label: "Positive",
    color: "hsl(var(--chart-1))",
  },
  negative: {
    label: "Negative",
    color: "hsl(var(--chart-2))",
  },
  neutral: {
    label: "Neutral",
    color: "hsl(var(--chart-3))",
  },
  mentions: {
    label: "Mentions",
    color: "hsl(var(--chart-4))",
  },
  importance: {
    label: "Importance Score",
    color: "hsl(var(--chart-5))",
  }
}

const ChartContainer = ({ children, config, className }) => {
  // Create CSS variables for chart colors
  const style = Object.entries(config || {}).reduce((acc, [key, value]) => {
    if (value.color) {
      acc[`--color-${key}`] = value.color;
    }
    return acc;
  }, {});

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

const ChartTooltipContent = ({ active, payload, label, indicator = "dashed", hideLabel = false }) => {
  if (!active || !payload?.length) return null;
  
  return (
    <div className="rounded-lg border bg-background p-2 shadow-md">
      {!hideLabel && <div className="font-medium">{label}</div>}
      <div className="flex flex-col gap-1 pt-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="size-2 rounded-full" 
              style={{ backgroundColor: entry.color || entry.fill }}
            />
            <span className="font-medium">
              {entry.name}: {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // In a real app, replace this with an actual API call
        // const response = await axios.get(`/api/products/${id}`);
        
        // Simulate API call with mock data
        // Check if ID is valid (for demo purposes)
        if (id !== 'P12345') {
          toast.error('Product not found with the specified ID');
          navigate('/dashboard'); // Redirect to dashboard
          return;
        }
        
        // Mock data - in real app this would come from the API
        const mockData = {
          "product_id": "P12345",
          "product_name": "Smartphone X",
          "feedback_summary": {
            "positive": [
              "Battery life is great and lasts all day.",
              "The display is sharp and bright.",
              "Performance is smooth with no lag."
            ],
            "negative": [
              "Battery drains quickly while gaming.",
              "Charging takes longer than expected.",
              "The camera struggles in low light."
            ],
            "neutral": [
              "The design is okay, nothing special."
            ]
          },
          "sentiment_distribution": {
            "positive": 65,
            "negative": 25,
            "neutral": 10
          },
          "features": [
            {
              "feature": "Battery",
              "positive": [
                "Battery life is great and lasts all day."
              ],
              "negative": [
                "Battery drains quickly while gaming.",
                "Charging takes longer than expected."
              ],
              "sentiment_score": {
                "positive": 55,
                "negative": 45
              }
            },
            {
              "feature": "Display",
              "positive": [
                "The display is sharp and bright."
              ],
              "negative": [
                "Screen scratches easily."
              ],
              "sentiment_score": {
                "positive": 70,
                "negative": 30
              }
            },
            {
              "feature": "Camera",
              "positive": [
                "Great photos in daylight."
              ],
              "negative": [
                "The camera struggles in low light."
              ],
              "sentiment_score": {
                "positive": 60,
                "negative": 40
              }
            }
          ],
          "feature_importance": [
            {
              "feature": "Battery",
              "mentions": 120,
              "importance_score": 80
            },
            {
              "feature": "Camera",
              "mentions": 100,
              "importance_score": 75
            },
            {
              "feature": "Display",
              "mentions": 90,
              "importance_score": 65
            }
          ],
          "competitor_analysis": {
            "Battery": [
              {
                "product_name": "Smartphone X",
                "positive": 55,
                "negative": 45
              },
              {
                "product_name": "Smartphone Y (Competitor A)",
                "positive": 60,
                "negative": 40
              },
              {
                "product_name": "Smartphone Z (Competitor B)",
                "positive": 50,
                "negative": 50
              }
            ],
            "Camera": [
              {
                "product_name": "Smartphone X",
                "positive": 60,
                "negative": 40
              },
              {
                "product_name": "Smartphone Y (Competitor A)",
                "positive": 65,
                "negative": 35
              },
              {
                "product_name": "Smartphone Z (Competitor B)",
                "positive": 55,
                "negative": 45
              }
            ]
          }
        };

        setProduct(mockData);
        toast.success('Product data loaded successfully');
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product data');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-xl">Loading product data...</p>
      </div>
    );
  }

  if (!product) return null;

  // Prepare data for the sentiment pie chart
  const sentimentData = [
    { name: "positive", value: product.sentiment_distribution.positive, fill: "var(--color-positive)" },
    { name: "negative", value: product.sentiment_distribution.negative, fill: "var(--color-negative)" },
    { name: "neutral", value: product.sentiment_distribution.neutral, fill: "var(--color-neutral)" }
  ];

  // Prepare data for the feature importance chart
  const featureImportanceData = product.feature_importance.map(item => ({
    name: item.feature,
    mentions: item.mentions,
    importance: item.importance_score
  }));

  // Total sentiment calculation
  const totalSentiment = sentimentData.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{product.product_name}</h1>
        <p className="text-muted-foreground">ID: {product.product_id}</p>
      </div>

      {/* Sentiment Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Sentiment Overview</CardTitle>
          <CardDescription>Customer feedback sentiment distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={ChartConfig} className="mx-auto aspect-square max-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={sentimentData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x="50%"
                      y="50%"
                      className="fill-foreground text-2xl font-bold"
                    >
                      {totalSentiment}
                    </tspan>
                    <tspan
                      x="50%"
                      y="50%"
                      dy="1.5em"
                      className="fill-muted-foreground text-sm"
                    >
                      Feedback
                    </tspan>
                  </text>
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="mt-6 flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[hsl(var(--chart-1))]" />
              <span>Positive ({product.sentiment_distribution.positive}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[hsl(var(--chart-2))]" />
              <span>Negative ({product.sentiment_distribution.negative}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[hsl(var(--chart-3))]" />
              <span>Neutral ({product.sentiment_distribution.neutral}%)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Feedback Summary</CardTitle>
          <CardDescription>Key points from customer reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="positive">
            <TabsList className="mb-4">
              <TabsTrigger value="positive">Positive</TabsTrigger>
              <TabsTrigger value="negative">Negative</TabsTrigger>
              <TabsTrigger value="neutral">Neutral</TabsTrigger>
            </TabsList>
            <TabsContent value="positive">
              <ul className="space-y-2">
                {product.feedback_summary.positive.map((feedback, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/20 text-primary mr-2">+</span>
                    <span>{feedback}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="negative">
              <ul className="space-y-2">
                {product.feedback_summary.negative.map((feedback, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-destructive/20 text-destructive mr-2">-</span>
                    <span>{feedback}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="neutral">
              <ul className="space-y-2">
                {product.feedback_summary.neutral.map((feedback, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-muted text-muted-foreground mr-2">○</span>
                    <span>{feedback}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Feature Analysis */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Feature Analysis</CardTitle>
          <CardDescription>Sentiment breakdown by product feature</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {product.features.map((feature, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">{feature.feature}</h3>
                <div className="mb-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Positive ({feature.sentiment_score.positive}%)</span>
                    <span className="text-sm font-medium">Negative ({feature.sentiment_score.negative}%)</span>
                  </div>
                  <Progress value={feature.sentiment_score.positive} className="h-2" />
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Positive Feedback</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {feature.positive.map((item, idx) => (
                      <li key={idx} className="text-sm">{item}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Negative Feedback</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {feature.negative.map((item, idx) => (
                      <li key={idx} className="text-sm">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feature Importance */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Feature Importance</CardTitle>
          <CardDescription>Most discussed features in customer feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={ChartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureImportanceData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" orientation="left" stroke="var(--color-mentions)" />
                <YAxis yAxisId="right" orientation="right" stroke="var(--color-importance)" />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar yAxisId="left" dataKey="mentions" name="Mentions" fill="var(--color-mentions)" radius={4} />
                <Bar yAxisId="right" dataKey="importance" name="Importance Score" fill="var(--color-importance)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            <TrendingUp className="h-4 w-4" /> Battery is the most discussed feature
          </div>
          <div className="leading-none text-muted-foreground">
            Shows frequency of mentions and calculated importance
          </div>
        </CardFooter>
      </Card>

      {/* Competitor Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Competitor Analysis</CardTitle>
          <CardDescription>How we compare to competitors</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="Battery">
            <TabsList className="mb-4">
              {Object.keys(product.competitor_analysis).map((feature) => (
                <TabsTrigger key={feature} value={feature}>{feature}</TabsTrigger>
              ))}
            </TabsList>
            
            {Object.entries(product.competitor_analysis).map(([feature, competitors]) => (
              <TabsContent key={feature} value={feature}>
                <div className="space-y-6">
                  {competitors.map((comp, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{comp.product_name}</span>
                        <span className="text-sm text-muted-foreground">Positive: {comp.positive}% | Negative: {comp.negative}%</span>
                      </div>
                      <Progress value={comp.positive} className="h-2" />
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default SingleProduct
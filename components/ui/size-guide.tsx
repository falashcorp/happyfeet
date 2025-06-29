"use client";

import { useState } from 'react';
import { Ruler, Info, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const sizeCharts = {
  men: [
    { us: '7', uk: '6', eu: '40', cm: '25.0' },
    { us: '7.5', uk: '6.5', eu: '40.5', cm: '25.4' },
    { us: '8', uk: '7', eu: '41', cm: '25.7' },
    { us: '8.5', uk: '7.5', eu: '42', cm: '26.0' },
    { us: '9', uk: '8', eu: '42.5', cm: '26.4' },
    { us: '9.5', uk: '8.5', eu: '43', cm: '26.7' },
    { us: '10', uk: '9', eu: '44', cm: '27.0' },
    { us: '10.5', uk: '9.5', eu: '44.5', cm: '27.4' },
    { us: '11', uk: '10', eu: '45', cm: '27.7' },
    { us: '11.5', uk: '10.5', eu: '45.5', cm: '28.0' },
    { us: '12', uk: '11', eu: '46', cm: '28.4' },
  ],
  women: [
    { us: '5', uk: '2.5', eu: '35', cm: '22.0' },
    { us: '5.5', uk: '3', eu: '35.5', cm: '22.4' },
    { us: '6', uk: '3.5', eu: '36', cm: '22.7' },
    { us: '6.5', uk: '4', eu: '37', cm: '23.0' },
    { us: '7', uk: '4.5', eu: '37.5', cm: '23.4' },
    { us: '7.5', uk: '5', eu: '38', cm: '23.7' },
    { us: '8', uk: '5.5', eu: '38.5', cm: '24.0' },
    { us: '8.5', uk: '6', eu: '39', cm: '24.4' },
    { us: '9', uk: '6.5', eu: '40', cm: '24.7' },
    { us: '9.5', uk: '7', eu: '40.5', cm: '25.0' },
    { us: '10', uk: '7.5', eu: '41', cm: '25.4' },
  ],
};

const measurementTips = [
  "Measure your feet at the end of the day when they're at their largest",
  "Wear the type of socks you plan to wear with the shoes",
  "Measure both feet and use the larger measurement",
  "Stand on a piece of paper and trace around your foot",
  "Measure from the heel to the longest toe",
];

interface SizeGuideProps {
  selectedSize?: string;
  onSizeSelect?: (size: string) => void;
  category?: string;
}

export function SizeGuide({ selectedSize, onSizeSelect, category }: SizeGuideProps) {
  const [activeTab, setActiveTab] = useState('men');
  const [footLength, setFootLength] = useState('');

  const getSizeRecommendation = (length: number) => {
    const chart = sizeCharts[activeTab as keyof typeof sizeCharts];
    const recommended = chart.find(size => {
      const sizeLength = parseFloat(size.cm);
      return length <= sizeLength;
    });
    return recommended?.us || chart[chart.length - 1].us;
  };

  const recommendedSize = footLength ? getSizeRecommendation(parseFloat(footLength)) : null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Ruler className="h-4 w-4" />
          Size Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            Size Guide & Fit Assistant
          </DialogTitle>
          <DialogDescription>
            Find your perfect fit with our comprehensive size guide and measurement tools.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Size Calculator */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Size Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Enter your foot length (cm):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="25.0"
                      value={footLength}
                      onChange={(e) => setFootLength(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab(activeTab === 'men' ? 'women' : 'men')}
                    >
                      {activeTab === 'men' ? 'Men' : 'Women'}
                    </Button>
                  </div>
                </div>
                
                {recommendedSize && (
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="h-4 w-4 text-primary" />
                      <span className="font-medium">Recommended Size</span>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      US {recommendedSize}
                    </div>
                    {onSizeSelect && (
                      <Button 
                        size="sm" 
                        className="mt-2"
                        onClick={() => onSizeSelect(recommendedSize)}
                      >
                        Select This Size
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Size Charts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Size Charts</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="men">Men's Sizes</TabsTrigger>
                  <TabsTrigger value="women">Women's Sizes</TabsTrigger>
                </TabsList>
                
                <TabsContent value="men" className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>US</TableHead>
                        <TableHead>UK</TableHead>
                        <TableHead>EU</TableHead>
                        <TableHead>Length (cm)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sizeCharts.men.map((size, index) => (
                        <TableRow 
                          key={index}
                          className={selectedSize === size.us ? 'bg-primary/10' : ''}
                        >
                          <TableCell className="font-medium">{size.us}</TableCell>
                          <TableCell>{size.uk}</TableCell>
                          <TableCell>{size.eu}</TableCell>
                          <TableCell>{size.cm}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                <TabsContent value="women" className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>US</TableHead>
                        <TableHead>UK</TableHead>
                        <TableHead>EU</TableHead>
                        <TableHead>Length (cm)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sizeCharts.women.map((size, index) => (
                        <TableRow 
                          key={index}
                          className={selectedSize === size.us ? 'bg-primary/10' : ''}
                        >
                          <TableCell className="font-medium">{size.us}</TableCell>
                          <TableCell>{size.uk}</TableCell>
                          <TableCell>{size.eu}</TableCell>
                          <TableCell>{size.cm}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Measurement Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How to Measure Your Feet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Measurement Tips:</h4>
                  <ul className="space-y-2">
                    {measurementTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Badge variant="outline" className="mt-0.5 text-xs">
                          {index + 1}
                        </Badge>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Fit Notes:</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Athletic shoes: Consider going up 0.5 size for comfort</p>
                    <p>• Formal shoes: True to size for proper fit</p>
                    <p>• Sandals: Can go down 0.5 size for secure fit</p>
                    <p>• Wide feet: Consider wide-width options when available</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
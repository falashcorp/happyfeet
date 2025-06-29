"use client";

import { useState } from 'react';
import { X, Ruler, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

const sizeCharts = {
  'Athletic Shoes': {
    men: [
      { us: '6', uk: '5.5', eu: '39', cm: '24' },
      { us: '6.5', uk: '6', eu: '39.5', cm: '24.5' },
      { us: '7', uk: '6.5', eu: '40', cm: '25' },
      { us: '7.5', uk: '7', eu: '40.5', cm: '25.5' },
      { us: '8', uk: '7.5', eu: '41', cm: '26' },
      { us: '8.5', uk: '8', eu: '42', cm: '26.5' },
      { us: '9', uk: '8.5', eu: '42.5', cm: '27' },
      { us: '9.5', uk: '9', eu: '43', cm: '27.5' },
      { us: '10', uk: '9.5', eu: '44', cm: '28' },
      { us: '10.5', uk: '10', eu: '44.5', cm: '28.5' },
      { us: '11', uk: '10.5', eu: '45', cm: '29' },
      { us: '11.5', uk: '11', eu: '45.5', cm: '29.5' },
      { us: '12', uk: '11.5', eu: '46', cm: '30' },
    ],
    women: [
      { us: '5', uk: '2.5', eu: '35', cm: '22' },
      { us: '5.5', uk: '3', eu: '35.5', cm: '22.5' },
      { us: '6', uk: '3.5', eu: '36', cm: '23' },
      { us: '6.5', uk: '4', eu: '37', cm: '23.5' },
      { us: '7', uk: '4.5', eu: '37.5', cm: '24' },
      { us: '7.5', uk: '5', eu: '38', cm: '24.5' },
      { us: '8', uk: '5.5', eu: '38.5', cm: '25' },
      { us: '8.5', uk: '6', eu: '39', cm: '25.5' },
      { us: '9', uk: '6.5', eu: '40', cm: '26' },
      { us: '9.5', uk: '7', eu: '40.5', cm: '26.5' },
      { us: '10', uk: '7.5', eu: '41', cm: '27' },
      { us: '10.5', uk: '8', eu: '42', cm: '27.5' },
      { us: '11', uk: '8.5', eu: '42.5', cm: '28' },
    ],
  },
  'Casual Sneakers': {
    men: [
      { us: '6', uk: '5.5', eu: '39', cm: '24' },
      { us: '6.5', uk: '6', eu: '39.5', cm: '24.5' },
      { us: '7', uk: '6.5', eu: '40', cm: '25' },
      { us: '7.5', uk: '7', eu: '40.5', cm: '25.5' },
      { us: '8', uk: '7.5', eu: '41', cm: '26' },
      { us: '8.5', uk: '8', eu: '42', cm: '26.5' },
      { us: '9', uk: '8.5', eu: '42.5', cm: '27' },
      { us: '9.5', uk: '9', eu: '43', cm: '27.5' },
      { us: '10', uk: '9.5', eu: '44', cm: '28' },
      { us: '10.5', uk: '10', eu: '44.5', cm: '28.5' },
      { us: '11', uk: '10.5', eu: '45', cm: '29' },
      { us: '11.5', uk: '11', eu: '45.5', cm: '29.5' },
      { us: '12', uk: '11.5', eu: '46', cm: '30' },
    ],
    women: [
      { us: '5', uk: '2.5', eu: '35', cm: '22' },
      { us: '5.5', uk: '3', eu: '35.5', cm: '22.5' },
      { us: '6', uk: '3.5', eu: '36', cm: '23' },
      { us: '6.5', uk: '4', eu: '37', cm: '23.5' },
      { us: '7', uk: '4.5', eu: '37.5', cm: '24' },
      { us: '7.5', uk: '5', eu: '38', cm: '24.5' },
      { us: '8', uk: '5.5', eu: '38.5', cm: '25' },
      { us: '8.5', uk: '6', eu: '39', cm: '25.5' },
      { us: '9', uk: '6.5', eu: '40', cm: '26' },
      { us: '9.5', uk: '7', eu: '40.5', cm: '26.5' },
      { us: '10', uk: '7.5', eu: '41', cm: '27' },
      { us: '10.5', uk: '8', eu: '42', cm: '27.5' },
      { us: '11', uk: '8.5', eu: '42.5', cm: '28' },
    ],
  },
  'Formal Shoes': {
    men: [
      { us: '6', uk: '5.5', eu: '39', cm: '24' },
      { us: '6.5', uk: '6', eu: '39.5', cm: '24.5' },
      { us: '7', uk: '6.5', eu: '40', cm: '25' },
      { us: '7.5', uk: '7', eu: '40.5', cm: '25.5' },
      { us: '8', uk: '7.5', eu: '41', cm: '26' },
      { us: '8.5', uk: '8', eu: '42', cm: '26.5' },
      { us: '9', uk: '8.5', eu: '42.5', cm: '27' },
      { us: '9.5', uk: '9', eu: '43', cm: '27.5' },
      { us: '10', uk: '9.5', eu: '44', cm: '28' },
      { us: '10.5', uk: '10', eu: '44.5', cm: '28.5' },
      { us: '11', uk: '10.5', eu: '45', cm: '29' },
      { us: '11.5', uk: '11', eu: '45.5', cm: '29.5' },
      { us: '12', uk: '11.5', eu: '46', cm: '30' },
    ],
    women: [
      { us: '5', uk: '2.5', eu: '35', cm: '22' },
      { us: '5.5', uk: '3', eu: '35.5', cm: '22.5' },
      { us: '6', uk: '3.5', eu: '36', cm: '23' },
      { us: '6.5', uk: '4', eu: '37', cm: '23.5' },
      { us: '7', uk: '4.5', eu: '37.5', cm: '24' },
      { us: '7.5', uk: '5', eu: '38', cm: '24.5' },
      { us: '8', uk: '5.5', eu: '38.5', cm: '25' },
      { us: '8.5', uk: '6', eu: '39', cm: '25.5' },
      { us: '9', uk: '6.5', eu: '40', cm: '26' },
      { us: '9.5', uk: '7', eu: '40.5', cm: '26.5' },
      { us: '10', uk: '7.5', eu: '41', cm: '27' },
      { us: '10.5', uk: '8', eu: '42', cm: '27.5' },
      { us: '11', uk: '8.5', eu: '42.5', cm: '28' },
    ],
  },
  'Sandals': {
    men: [
      { us: '6', uk: '5.5', eu: '39', cm: '24' },
      { us: '6.5', uk: '6', eu: '39.5', cm: '24.5' },
      { us: '7', uk: '6.5', eu: '40', cm: '25' },
      { us: '7.5', uk: '7', eu: '40.5', cm: '25.5' },
      { us: '8', uk: '7.5', eu: '41', cm: '26' },
      { us: '8.5', uk: '8', eu: '42', cm: '26.5' },
      { us: '9', uk: '8.5', eu: '42.5', cm: '27' },
      { us: '9.5', uk: '9', eu: '43', cm: '27.5' },
      { us: '10', uk: '9.5', eu: '44', cm: '28' },
      { us: '10.5', uk: '10', eu: '44.5', cm: '28.5' },
      { us: '11', uk: '10.5', eu: '45', cm: '29' },
      { us: '11.5', uk: '11', eu: '45.5', cm: '29.5' },
      { us: '12', uk: '11.5', eu: '46', cm: '30' },
    ],
    women: [
      { us: '5', uk: '2.5', eu: '35', cm: '22' },
      { us: '5.5', uk: '3', eu: '35.5', cm: '22.5' },
      { us: '6', uk: '3.5', eu: '36', cm: '23' },
      { us: '6.5', uk: '4', eu: '37', cm: '23.5' },
      { us: '7', uk: '4.5', eu: '37.5', cm: '24' },
      { us: '7.5', uk: '5', eu: '38', cm: '24.5' },
      { us: '8', uk: '5.5', eu: '38.5', cm: '25' },
      { us: '8.5', uk: '6', eu: '39', cm: '25.5' },
      { us: '9', uk: '6.5', eu: '40', cm: '26' },
      { us: '9.5', uk: '7', eu: '40.5', cm: '26.5' },
      { us: '10', uk: '7.5', eu: '41', cm: '27' },
      { us: '10.5', uk: '8', eu: '42', cm: '27.5' },
      { us: '11', uk: '8.5', eu: '42.5', cm: '28' },
    ],
  },
};

export function SizeGuide({ isOpen, onClose, category = 'Athletic Shoes' }: SizeGuideProps) {
  const [selectedGender, setSelectedGender] = useState<'men' | 'women'>('men');
  
  const currentChart = sizeCharts[category as keyof typeof sizeCharts] || sizeCharts['Athletic Shoes'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            Size Guide - {category}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* How to Measure */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                How to Measure Your Feet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Step-by-Step Instructions:</h4>
                  <ol className="space-y-2 text-sm">
                    <li className="flex gap-2">
                      <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">1</Badge>
                      Place a piece of paper on the floor against a wall
                    </li>
                    <li className="flex gap-2">
                      <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">2</Badge>
                      Stand on the paper with your heel against the wall
                    </li>
                    <li className="flex gap-2">
                      <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">3</Badge>
                      Mark the longest toe on the paper
                    </li>
                    <li className="flex gap-2">
                      <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">4</Badge>
                      Measure the distance from the wall to the mark
                    </li>
                    <li className="flex gap-2">
                      <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">5</Badge>
                      Repeat for both feet and use the larger measurement
                    </li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Pro Tips:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Measure your feet in the evening when they're largest</li>
                    <li>• Wear the type of socks you plan to wear with the shoes</li>
                    <li>• If between sizes, choose the larger size</li>
                    <li>• Consider the shoe's intended use (athletic vs. casual)</li>
                    <li>• Account for foot width if you have wide or narrow feet</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Size Charts */}
          <Card>
            <CardHeader>
              <CardTitle>Size Conversion Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedGender} onValueChange={(value) => setSelectedGender(value as 'men' | 'women')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="men">Men's Sizes</TabsTrigger>
                  <TabsTrigger value="women">Women's Sizes</TabsTrigger>
                </TabsList>
                
                <TabsContent value={selectedGender} className="mt-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 font-semibold">US</th>
                          <th className="text-left p-2 font-semibold">UK</th>
                          <th className="text-left p-2 font-semibold">EU</th>
                          <th className="text-left p-2 font-semibold">CM</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentChart[selectedGender].map((size, index) => (
                          <tr key={index} className="border-b hover:bg-muted/50">
                            <td className="p-2">{size.us}</td>
                            <td className="p-2">{size.uk}</td>
                            <td className="p-2">{size.eu}</td>
                            <td className="p-2">{size.cm}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Width Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Width Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Narrow (B/AA)</h4>
                  <p className="text-sm text-muted-foreground">
                    For feet that are narrower than average
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg bg-primary/5">
                  <h4 className="font-semibold mb-2">Medium (D/B)</h4>
                  <p className="text-sm text-muted-foreground">
                    Standard width for most people
                  </p>
                  <Badge variant="secondary" className="mt-2">Most Common</Badge>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Wide (E/C)</h4>
                  <p className="text-sm text-muted-foreground">
                    For feet that are wider than average
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category-Specific Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Fitting Tips for {category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                {category === 'Athletic Shoes' && (
                  <>
                    <p>• Athletic shoes should have about a thumb's width of space between your longest toe and the shoe's end</p>
                    <p>• Consider going up half a size for running shoes to account for foot swelling during exercise</p>
                    <p>• Ensure the shoe provides adequate arch support for your foot type</p>
                  </>
                )}
                {category === 'Casual Sneakers' && (
                  <>
                    <p>• Casual sneakers can fit slightly snugger than athletic shoes</p>
                    <p>• Consider the material - leather may stretch over time while synthetic materials typically don't</p>
                    <p>• Make sure there's no pressure on the sides of your feet</p>
                  </>
                )}
                {category === 'Formal Shoes' && (
                  <>
                    <p>• Formal shoes should fit snugly but not tight, with minimal heel slippage</p>
                    <p>• Leather formal shoes will stretch and conform to your feet over time</p>
                    <p>• Ensure the widest part of your foot aligns with the widest part of the shoe</p>
                  </>
                )}
                {category === 'Sandals' && (
                  <>
                    <p>• Your foot should not hang over the edges of the sandal</p>
                    <p>• Straps should be snug but not tight, allowing for some foot swelling</p>
                    <p>• Consider adjustable straps for the best fit</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
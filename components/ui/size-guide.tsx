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
  category: string;
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
      { us: '7', uk: '6.5', eu: '40', cm: '25' },
      { us: '8', uk: '7.5', eu: '41', cm: '26' },
      { us: '9', uk: '8.5', eu: '42.5', cm: '27' },
      { us: '10', uk: '9.5', eu: '44', cm: '28' },
      { us: '11', uk: '10.5', eu: '45', cm: '29' },
      { us: '12', uk: '11.5', eu: '46', cm: '30' },
    ],
    women: [
      { us: '5', uk: '2.5', eu: '35', cm: '22' },
      { us: '6', uk: '3.5', eu: '36', cm: '23' },
      { us: '7', uk: '4.5', eu: '37.5', cm: '24' },
      { us: '8', uk: '5.5', eu: '38.5', cm: '25' },
      { us: '9', uk: '6.5', eu: '40', cm: '26' },
      { us: '10', uk: '7.5', eu: '41', cm: '27' },
      { us: '11', uk: '8.5', eu: '42.5', cm: '28' },
    ],
  },
};

const measurementTips = [
  {
    title: "Best Time to Measure",
    description: "Measure your feet in the afternoon or evening when they're at their largest.",
    icon: "⏰"
  },
  {
    title: "Both Feet",
    description: "Measure both feet as they can differ in size. Use the larger measurement.",
    icon: "👣"
  },
  {
    title: "Wear Socks",
    description: "Wear the type of socks you'll typically wear with the shoes.",
    icon: "🧦"
  },
  {
    title: "Standing Position",
    description: "Stand up while measuring to account for your full weight on your feet.",
    icon: "🧍"
  }
];

export function SizeGuide({ isOpen, onClose, category }: SizeGuideProps) {
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

        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chart">Size Chart</TabsTrigger>
            <TabsTrigger value="measure">How to Measure</TabsTrigger>
          </TabsList>

          <TabsContent value="chart" className="space-y-6">
            {/* Gender Selection */}
            <div className="flex gap-2">
              <Button
                variant={selectedGender === 'men' ? 'default' : 'outline'}
                onClick={() => setSelectedGender('men')}
                size="sm"
              >
                Men's Sizes
              </Button>
              <Button
                variant={selectedGender === 'women' ? 'default' : 'outline'}
                onClick={() => setSelectedGender('women')}
                size="sm"
              >
                Women's Sizes
              </Button>
            </div>

            {/* Size Chart Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedGender === 'men' ? "Men's" : "Women's"} Size Chart
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-medium">US</th>
                        <th className="text-left p-2 font-medium">UK</th>
                        <th className="text-left p-2 font-medium">EU</th>
                        <th className="text-left p-2 font-medium">CM</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentChart[selectedGender].map((size, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-2 font-medium">{size.us}</td>
                          <td className="p-2">{size.uk}</td>
                          <td className="p-2">{size.eu}</td>
                          <td className="p-2">{size.cm}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Size Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Sizing Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {measurementTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <span className="text-2xl">{tip.icon}</span>
                      <div>
                        <h4 className="font-medium mb-1">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground">{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="measure" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How to Measure Your Feet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Step-by-Step Instructions</h3>
                    <ol className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Badge className="min-w-[24px] h-6 flex items-center justify-center">1</Badge>
                        <span className="text-sm">Place a piece of paper on a hard floor against a wall.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Badge className="min-w-[24px] h-6 flex items-center justify-center">2</Badge>
                        <span className="text-sm">Stand on the paper with your heel against the wall.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Badge className="min-w-[24px] h-6 flex items-center justify-center">3</Badge>
                        <span className="text-sm">Mark the longest part of your foot on the paper.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Badge className="min-w-[24px] h-6 flex items-center justify-center">4</Badge>
                        <span className="text-sm">Measure the distance from the wall to the mark.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Badge className="min-w-[24px] h-6 flex items-center justify-center">5</Badge>
                        <span className="text-sm">Repeat for the other foot and use the larger measurement.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Badge className="min-w-[24px] h-6 flex items-center justify-center">6</Badge>
                        <span className="text-sm">Compare your measurement to our size chart above.</span>
                      </li>
                    </ol>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Important Notes</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-1">Width Considerations</h4>
                        <p className="text-sm text-blue-800">
                          If you have wide or narrow feet, consider going up or down half a size respectively.
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-1">Between Sizes?</h4>
                        <p className="text-sm text-green-800">
                          If you're between sizes, we recommend choosing the larger size for comfort.
                        </p>
                      </div>
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-medium text-yellow-900 mb-1">Still Unsure?</h4>
                        <p className="text-sm text-yellow-800">
                          Contact our customer service team for personalized sizing advice.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onClose}>
            Got It
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
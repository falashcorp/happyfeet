"use client";

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Minimize2, Maximize2, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  type?: 'text' | 'quick-reply';
}

const quickReplies = [
  'What are your store hours?',
  'Do you offer free shipping?',
  'What is your return policy?',
  'Help me find the right size',
  'Track my order',
];

const agentInfo = {
  name: 'Marie Support',
  avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
  status: 'online',
  responseTime: '~2 min',
};

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! Welcome to HappyFeet. How can I help you today?',
      sender: 'agent',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (content: string) => {
    if (!content.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Simulate agent typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      // Auto-responses based on content
      let response = "Thank you for your message. Let me help you with that.";
      
      if (content.toLowerCase().includes('size') || content.toLowerCase().includes('fit')) {
        response = "I'd be happy to help you find the right size! You can use our size guide or I can assist you personally. What type of shoes are you looking for?";
      } else if (content.toLowerCase().includes('shipping')) {
        response = "We offer free shipping on orders over $100 within Cameroon. Standard shipping takes 2-3 business days. Would you like more details about our shipping options?";
      } else if (content.toLowerCase().includes('return')) {
        response = "We have a 30-day return policy for unworn items in original packaging. Returns are free and easy! Would you like me to explain the return process?";
      } else if (content.toLowerCase().includes('hours') || content.toLowerCase().includes('store')) {
        response = "Our store hours are Monday-Friday 8AM-8PM, Saturday 9AM-6PM, and Sunday 10AM-4PM. We're located in Douala, Akwa District. Would you like directions?";
      } else if (content.toLowerCase().includes('track') || content.toLowerCase().includes('order')) {
        response = "I can help you track your order! Please provide your order number and I'll get you the latest update.";
      }

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'agent',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, agentMessage]);
    }, 1500 + Math.random() * 1000);
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-300"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={cn(
      "fixed bottom-6 right-6 z-50 w-80 shadow-2xl transition-all duration-300",
      isMinimized ? "h-16" : "h-96"
    )}>
      <CardHeader className="p-4 bg-primary text-primary-foreground">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={agentInfo.avatar} />
              <AvatarFallback>MS</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm font-medium truncate">
                {agentInfo.name}
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs opacity-90">{agentInfo.status}</span>
                <span className="text-xs opacity-75">• {agentInfo.responseTime}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-80">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.sender === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                    message.sender === 'user'
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length === 1 && (
            <div className="p-4 border-t bg-muted/30">
              <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-1">
                {quickReplies.slice(0, 3).map((reply, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => handleQuickReply(reply)}
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit" size="icon" className="h-10 w-10">
                <Send className="h-4 w-4" />
              </Button>
            </form>
            
            <div className="flex items-center justify-center gap-4 mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                <span>+237 6XX XXX XXX</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <span>support@happyfeet.cm</span>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
"use client";

import { useState } from 'react';
import { MessageCircle, X, Send, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! Welcome to HappyFeet. How can I help you today?",
      sender: 'agent',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: message,
      sender: 'user' as const,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simulate agent response
    setTimeout(() => {
      const agentResponse = {
        id: messages.length + 2,
        text: "Thank you for your message! I'll help you with that right away. Let me check our available options for you.",
        sender: 'agent' as const,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, agentResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96">
          <Card className="shadow-2xl border-0">
            <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Live Chat</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm opacity-90">Online</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {/* Messages */}
              <div className="h-80 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex",
                      msg.sender === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] p-3 rounded-lg text-sm",
                        msg.sender === 'user'
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <p>{msg.text}</p>
                      <p className={cn(
                        "text-xs mt-1 opacity-70",
                        msg.sender === 'user' ? "text-right" : "text-left"
                      )}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="p-4 border-t bg-muted/30">
                <div className="text-xs text-muted-foreground mb-2">Quick actions:</div>
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => setMessage("I need help with sizing")}
                  >
                    Sizing help
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => setMessage("What's your return policy?")}
                  >
                    Returns
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => setMessage("Track my order")}
                  >
                    Order status
                  </Badge>
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="resize-none"
                    rows={2}
                  />
                  <Button onClick={sendMessage} size="icon" className="self-end">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Contact Options */}
              <div className="p-4 border-t bg-muted/30">
                <div className="text-xs text-muted-foreground mb-2">Other ways to reach us:</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="h-3 w-3 mr-1" />
                    Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
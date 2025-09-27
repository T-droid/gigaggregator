import { useState } from "react";
import { Plus, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Template {
  id: string;
  name: string;
  content: string;
}

interface Settings {
  keywords: string[];
  templates: Template[];
  notifications: {
    email: boolean;
    telegram: boolean;
    desktop: boolean;
  };
}

// Mock settings data
const mockSettings: Settings = {
  keywords: ['React', 'TypeScript', 'Python', 'FastAPI', 'Node.js'],
  templates: [
    {
      id: '1',
      name: 'React Pitch',
      content: 'Hi! I saw your React project posting and I\'m very interested. I have 5+ years of React experience with TypeScript, Next.js, and modern state management. I\'d love to discuss your requirements and how I can help bring your vision to life.'
    },
    {
      id: '2', 
      name: 'Python/FastAPI Pitch',
      content: 'Hello! Your Python/FastAPI project caught my attention. I specialize in building scalable APIs with FastAPI, have extensive experience with PostgreSQL, Redis, and cloud deployments. I\'d be happy to discuss your project timeline and requirements.'
    }
  ],
  notifications: {
    email: true,
    telegram: false,
    desktop: true
  }
};

export default function Settings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings>(mockSettings);
  const [newKeyword, setNewKeyword] = useState('');
  const [newTemplate, setNewTemplate] = useState({ name: '', content: '' });

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !settings.keywords.includes(newKeyword.trim())) {
      setSettings(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setSettings(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const handleAddTemplate = () => {
    if (newTemplate.name.trim() && newTemplate.content.trim()) {
      const template: Template = {
        id: Date.now().toString(),
        name: newTemplate.name.trim(),
        content: newTemplate.content.trim()
      };
      
      setSettings(prev => ({
        ...prev,
        templates: [...prev.templates, template]
      }));
      
      setNewTemplate({ name: '', content: '' });
      toast({
        title: "Template added",
        description: "New pitch template has been saved",
      });
    }
  };

  const handleRemoveTemplate = (templateId: string) => {
    setSettings(prev => ({
      ...prev,
      templates: prev.templates.filter(t => t.id !== templateId)
    }));
  };

  const handleNotificationToggle = (type: keyof typeof settings.notifications) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }));
  };

  const handleSaveSettings = () => {
    // Here you would typically save to backend
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your gig scraper preferences
          </p>
        </div>
        
        <Button onClick={handleSaveSettings} className="gap-2">
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
      </div>

      {/* Keywords Section */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Keywords</CardTitle>
          <CardDescription>
            Add keywords to filter relevant gigs. Only gigs containing these keywords will be shown.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add keyword (e.g., React, Python)"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
            />
            <Button onClick={handleAddKeyword} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {settings.keywords.map((keyword) => (
              <Badge key={keyword} variant="secondary" className="gap-1">
                {keyword}
                <button
                  onClick={() => handleRemoveKeyword(keyword)}
                  className="hover:bg-destructive/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Templates Section */}
      <Card>
        <CardHeader>
          <CardTitle>Pitch Templates</CardTitle>
          <CardDescription>
            Create reusable message templates for different types of gigs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Template */}
          <div className="space-y-4 p-4 border border-dashed border-border rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                placeholder="e.g., React Pitch, Python Pitch"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="template-content">Message Template</Label>
              <Textarea
                id="template-content"
                placeholder="Write your pitch template here..."
                value={newTemplate.content}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
              />
            </div>
            
            <Button onClick={handleAddTemplate} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Template
            </Button>
          </div>

          {/* Existing Templates */}
          <div className="space-y-4">
            {settings.templates.map((template) => (
              <div key={template.id} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{template.name}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveTemplate(template.id)}
                    className="text-destructive hover:text-destructive-foreground hover:bg-destructive/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {template.content}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Choose how you want to be notified about new gigs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email alerts for new matching gigs
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.notifications.email}
              onCheckedChange={() => handleNotificationToggle('email')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="telegram-notifications">Telegram Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get instant messages via Telegram bot
              </p>
            </div>
            <Switch
              id="telegram-notifications"
              checked={settings.notifications.telegram}
              onCheckedChange={() => handleNotificationToggle('telegram')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="desktop-notifications">Desktop Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Show browser notifications for new gigs
              </p>
            </div>
            <Switch
              id="desktop-notifications"
              checked={settings.notifications.desktop}
              onCheckedChange={() => handleNotificationToggle('desktop')}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

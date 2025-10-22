import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Link as LinkIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BilingualRichTextEditorProps {
  label: string;
  value: { ar: string; en: string };
  onChange: (value: { ar: string; en: string }) => void;
  required?: boolean;
  error?: string;
}

export const BilingualRichTextEditor = ({
  label,
  value,
  onChange,
  required = false,
  error
}: BilingualRichTextEditorProps) => {
  const [activeTab, setActiveTab] = useState<'ar' | 'en'>('ar');

  const handleChange = (lang: 'ar' | 'en', newValue: string) => {
    onChange({
      ...value,
      [lang]: newValue
    });
  };

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const ToolbarButton = ({
    onClick,
    icon: Icon,
    title
  }: {
    onClick: () => void;
    icon: any;
    title: string;
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      title={title}
      className="h-8 w-8 p-0"
    >
      <Icon className="h-4 w-4" />
    </Button>
  );

  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'ar' | 'en')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[200px]">
          <TabsTrigger value="ar">العربية</TabsTrigger>
          <TabsTrigger value="en">English</TabsTrigger>
        </TabsList>

        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 bg-muted rounded-t-md mt-2">
          <ToolbarButton
            onClick={() => applyFormat('bold')}
            icon={Bold}
            title="Bold"
          />
          <ToolbarButton
            onClick={() => applyFormat('italic')}
            icon={Italic}
            title="Italic"
          />
          <Separator orientation="vertical" className="h-6 mx-1" />
          <ToolbarButton
            onClick={() => applyFormat('formatBlock', '<h2>')}
            icon={Heading2}
            title="Heading 2"
          />
          <ToolbarButton
            onClick={() => applyFormat('formatBlock', '<h3>')}
            icon={Heading3}
            title="Heading 3"
          />
          <Separator orientation="vertical" className="h-6 mx-1" />
          <ToolbarButton
            onClick={() => applyFormat('insertUnorderedList')}
            icon={List}
            title="Bullet List"
          />
          <ToolbarButton
            onClick={() => applyFormat('insertOrderedList')}
            icon={ListOrdered}
            title="Numbered List"
          />
          <Separator orientation="vertical" className="h-6 mx-1" />
          <ToolbarButton
            onClick={() => {
              const url = prompt('Enter URL:');
              if (url) applyFormat('createLink', url);
            }}
            icon={LinkIcon}
            title="Insert Link"
          />
        </div>

        <TabsContent value="ar" className="mt-0">
          <div
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => handleChange('ar', e.currentTarget.innerHTML)}
            dangerouslySetInnerHTML={{ __html: value.ar || '' }}
            className={cn(
              "min-h-[300px] w-full rounded-b-md border border-input bg-background px-3 py-2",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "prose prose-sm max-w-none font-cairo"
            )}
            dir="rtl"
          />
        </TabsContent>

        <TabsContent value="en" className="mt-0">
          <div
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => handleChange('en', e.currentTarget.innerHTML)}
            dangerouslySetInnerHTML={{ __html: value.en || '' }}
            className={cn(
              "min-h-[300px] w-full rounded-b-md border border-input bg-background px-3 py-2",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "prose prose-sm max-w-none"
            )}
          />
        </TabsContent>
      </Tabs>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

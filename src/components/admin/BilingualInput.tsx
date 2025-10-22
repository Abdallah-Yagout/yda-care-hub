import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BilingualInputProps {
  label: string;
  value: { ar: string; en: string };
  onChange: (value: { ar: string; en: string }) => void;
  type?: 'text' | 'textarea';
  placeholder?: { ar: string; en: string };
  required?: boolean;
  error?: string;
}

export const BilingualInput = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = { ar: '', en: '' },
  required = false,
  error
}: BilingualInputProps) => {
  const handleChange = (lang: 'ar' | 'en', newValue: string) => {
    onChange({
      ...value,
      [lang]: newValue
    });
  };

  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      
      <Tabs defaultValue="ar" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[200px]">
          <TabsTrigger value="ar">العربية</TabsTrigger>
          <TabsTrigger value="en">English</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ar" className="mt-2">
          {type === 'textarea' ? (
            <Textarea
              value={value.ar || ''}
              onChange={(e) => handleChange('ar', e.target.value)}
              placeholder={placeholder.ar}
              className="min-h-[100px] font-cairo"
              dir="rtl"
            />
          ) : (
            <Input
              value={value.ar || ''}
              onChange={(e) => handleChange('ar', e.target.value)}
              placeholder={placeholder.ar}
              className="font-cairo"
              dir="rtl"
            />
          )}
        </TabsContent>
        
        <TabsContent value="en" className="mt-2">
          {type === 'textarea' ? (
            <Textarea
              value={value.en || ''}
              onChange={(e) => handleChange('en', e.target.value)}
              placeholder={placeholder.en}
              className="min-h-[100px]"
            />
          ) : (
            <Input
              value={value.en || ''}
              onChange={(e) => handleChange('en', e.target.value)}
              placeholder={placeholder.en}
            />
          )}
        </TabsContent>
      </Tabs>
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};

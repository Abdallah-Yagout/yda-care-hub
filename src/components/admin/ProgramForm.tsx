import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BilingualInput } from "./BilingualInput";
import { BilingualRichTextEditor } from "./BilingualRichTextEditor";
import { MediaUploader } from "./MediaUploader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Program, ProgramFormData } from "@/hooks/usePrograms";

interface ProgramFormProps {
  program?: Program | null;
  onSubmit: (data: ProgramFormData) => Promise<void>;
  isLoading?: boolean;
}

export const ProgramForm = ({ program, onSubmit, isLoading }: ProgramFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProgramFormData>({
    slug: '',
    title: { ar: '', en: '' },
    summary: { ar: '', en: '' },
    body: { ar: '', en: '' },
    cover_url: '',
    icon: '',
    status: 'draft',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (program) {
      setFormData({
        slug: program.slug,
        title: program.title,
        summary: program.summary || { ar: '', en: '' },
        body: program.body || { ar: '', en: '' },
        cover_url: program.cover_url || '',
        icon: program.icon || '',
        status: program.status,
      });
    }
  }, [program]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    }

    if (!formData.title.ar.trim() || !formData.title.en.trim()) {
      newErrors.title = 'Title is required in both languages';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  // Auto-generate slug from English title
  const handleTitleChange = (value: { ar: string; en: string }) => {
    setFormData(prev => ({ ...prev, title: value }));
    
    if (!program && value.en) {
      const slug = value.en
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Program Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <BilingualInput
            label="Title"
            value={formData.title}
            onChange={handleTitleChange}
            placeholder={{ ar: 'عنوان البرنامج', en: 'Program Title' }}
            required
            error={errors.title}
          />

          {/* Slug */}
          <div className="space-y-2">
            <Label>
              Slug <span className="text-destructive">*</span>
            </Label>
            <Input
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="program-slug"
            />
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug}</p>
            )}
          </div>

          {/* Summary */}
          <BilingualInput
            label="Summary"
            value={formData.summary || { ar: '', en: '' }}
            onChange={(value) => setFormData(prev => ({ ...prev, summary: value }))}
            type="textarea"
            placeholder={{ ar: 'ملخص البرنامج', en: 'Program Summary' }}
          />

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Icon */}
          <div className="space-y-2">
            <Label>Icon (Emoji or Text)</Label>
            <Input
              value={formData.icon || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
              placeholder="🎯"
              maxLength={10}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cover Image</CardTitle>
        </CardHeader>
        <CardContent>
          <MediaUploader
            label="Cover Image"
            bucket="programs"
            value={formData.cover_url || ''}
            onChange={(value) => setFormData(prev => ({ ...prev, cover_url: value as string }))}
            accept="image/*"
            maxSize={5}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent>
          <BilingualRichTextEditor
            label="Body Content"
            value={formData.body || { ar: '', en: '' }}
            onChange={(value) => setFormData(prev => ({ ...prev, body: value }))}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/admin/programs')}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {program ? 'Update Program' : 'Create Program'}
        </Button>
      </div>
    </form>
  );
};

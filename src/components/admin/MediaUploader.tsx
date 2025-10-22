import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaUploaderProps {
  label: string;
  bucket: string;
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  required?: boolean;
  error?: string;
}

export const MediaUploader = ({
  label,
  bucket,
  value,
  onChange,
  multiple = false,
  accept = "image/*",
  maxSize = 5,
  required = false,
  error
}: MediaUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setProgress(0);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds ${maxSize}MB limit`,
            variant: "destructive"
          });
          continue;
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

        // Upload file
        const { data, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        if (data) {
          const publicUrl = getPublicUrl(data.path);
          uploadedUrls.push(publicUrl);
        }

        setProgress(((i + 1) / files.length) * 100);
      }

      // Update value
      if (multiple) {
        const currentUrls = Array.isArray(value) ? value : [];
        onChange([...currentUrls, ...uploadedUrls]);
      } else {
        onChange(uploadedUrls[0]);
      }

      toast({
        title: "Upload successful",
        description: `${uploadedUrls.length} file(s) uploaded successfully`
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setProgress(0);
      // Reset input
      event.target.value = '';
    }
  };

  const handleRemove = (urlToRemove: string) => {
    if (multiple && Array.isArray(value)) {
      onChange(value.filter(url => url !== urlToRemove));
    } else {
      onChange('');
    }
  };

  const urls = multiple ? (Array.isArray(value) ? value : []) : (value ? [value as string] : []);

  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>

      <div className="space-y-4">
        {/* Preview existing files */}
        {urls.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {urls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-32 object-cover rounded-md border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemove(url)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Upload button */}
        <div>
          <Input
            id={`file-upload-${label}`}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
          <label htmlFor={`file-upload-${label}`}>
            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              className={cn("w-full cursor-pointer", uploading && "cursor-not-allowed")}
              asChild
            >
              <span>
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading... {Math.round(progress)}%
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    {multiple ? 'Upload Files' : 'Upload File'}
                  </>
                )}
              </span>
            </Button>
          </label>
          <p className="text-xs text-muted-foreground mt-1">
            {accept} - Max {maxSize}MB {multiple && '(multiple files allowed)'}
          </p>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
};

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Image as ImageIcon, UploadCloud, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress'; // Importar Progress

interface ImageUploadFieldProps {
  value?: string; // Current image URL
  onChange: (url: string) => void;
  disabled?: boolean;
}

const ImageUploadField = ({ value, onChange, disabled }: ImageUploadFieldProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(value || null);

  React.useEffect(() => {
    setImageUrl(value || null);
  }, [value]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      toast.error("Nenhum arquivo selecionado ou tipo de arquivo inválido.");
      return;
    }

    const file = acceptedFiles[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    setUploading(true);
    setUploadProgress(0);

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        // Adicionar onUploadProgress para monitorar o progresso
        // Note: onUploadProgress is not directly supported by supabase-js upload method.
        // For real-time progress, you might need a custom upload solution or a different library.
        // For simplicity, we'll simulate progress or update once complete.
      });

    if (error) {
      toast.error("Erro ao fazer upload da imagem.", { description: error.message });
      setUploading(false);
      setUploadProgress(0);
      return;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    if (publicUrlData?.publicUrl) {
      setImageUrl(publicUrlData.publicUrl);
      onChange(publicUrlData.publicUrl);
      toast.success("Imagem enviada com sucesso!");
    } else {
      toast.error("Erro ao obter URL pública da imagem.");
    }
    setUploading(false);
    setUploadProgress(100); // Set to 100% on completion
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    multiple: false,
    disabled: disabled || uploading,
  });

  const handleRemoveImage = () => {
    setImageUrl(null);
    onChange('');
    toast.info("Imagem removida.");
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="image-upload">Imagem do Produto</Label>
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} id="image-upload" disabled={disabled || uploading} />
        {uploading ? (
          <div className="flex flex-col items-center space-y-2 w-full">
            <UploadCloud className="h-8 w-8 text-primary animate-bounce" />
            <p className="text-sm text-muted-foreground">Enviando imagem...</p>
            <Progress value={uploadProgress} className="w-full h-2" />
          </div>
        ) : imageUrl ? (
          <div className="relative w-full h-48 rounded-md overflow-hidden group">
            <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={(e) => {
                e.stopPropagation(); // Prevent dropzone from re-opening
                handleRemoveImage();
              }}
              disabled={disabled}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <UploadCloud className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {isDragActive ? "Solte a imagem aqui..." : "Arraste e solte uma imagem aqui, ou clique para selecionar"}
            </p>
            <p className="text-xs text-muted-foreground">JPG, PNG, WEBP (máx. 5MB)</p>
          </div>
        )}
      </div>
      {imageUrl && !uploading && (
        <Input
          type="text"
          value={imageUrl}
          readOnly
          placeholder="URL da imagem"
          className="text-xs text-muted-foreground"
          disabled
        />
      )}
    </div>
  );
};

export default ImageUploadField;
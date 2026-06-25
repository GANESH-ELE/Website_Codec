'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Images,
  UploadCloud,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  ImageOff,
} from 'lucide-react';

interface Props {
  token: string;
}

export default function ImageGallery({ token }: Props) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    uploaded: string[];
    errors: string[];
  } | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/images');
      const data = (await res.json()) as { images?: string[] };
      setImages(data.images ?? []);
    } catch {
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadResult(null);
    setUploadError('');

    const fd = new FormData();
    for (let i = 0; i < files.length; i++) {
      fd.append('files', files[i]);
    }

    try {
      const res = await fetch('/api/images', {
        method: 'POST',
        headers: { 'x-admin-token': token },
        body: fd,
      });
      const data = (await res.json()) as {
        uploaded?: string[];
        errors?: string[];
        error?: string;
      };
      if (!res.ok) {
        setUploadError(data.error ?? 'Upload failed');
      } else {
        setUploadResult({
          uploaded: data.uploaded ?? [],
          errors: data.errors ?? [],
        });
        setFiles(null);
        if (inputRef.current) inputRef.current.value = '';
        await fetchImages();
      }
    } catch {
      setUploadError('Network error. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  async function copyFilename(name: string) {
    try {
      await navigator.clipboard.writeText(name);
      setCopiedKey(name);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // fallback: select a hidden input
      const el = document.createElement('textarea');
      el.value = name;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopiedKey(name);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  }

  const selectedCount = files ? files.length : 0;

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Images className="h-5 w-5 text-brand-600" />
          Image Gallery
          {!loading && (
            <span className="text-xs font-normal text-gray-400 ml-1">
              ({images.length} stored)
            </span>
          )}
        </h2>
        <button
          onClick={fetchImages}
          disabled={loading}
          className="flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 font-medium disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Upload form */}
      <form onSubmit={handleUpload} className="mb-6 space-y-3">
        <div
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
            selectedCount > 0
              ? 'border-brand-400 bg-brand-50'
              : 'border-gray-300 hover:border-brand-400'
          }`}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            multiple
            className="hidden"
            onChange={(e) => {
              setFiles(e.target.files);
              setUploadResult(null);
              setUploadError('');
            }}
          />
          <UploadCloud className="mx-auto h-9 w-9 text-gray-400 mb-1.5" />
          {selectedCount > 0 ? (
            <p className="text-sm font-medium text-brand-700">
              {selectedCount} file{selectedCount > 1 ? 's' : ''} selected
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              Click to select images (.jpg, .png, .webp)
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={selectedCount === 0 || uploading}
          className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
        >
          {uploading ? 'Uploading…' : `Upload ${selectedCount > 0 ? selectedCount : ''} Image${selectedCount !== 1 ? 's' : ''}`}
        </button>
      </form>

      {/* Upload result */}
      {uploadResult && uploadResult.uploaded.length > 0 && (
        <div className="mb-4 flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-800">
          <Check className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-600" />
          <div>
            <p className="font-semibold">
              {uploadResult.uploaded.length} image{uploadResult.uploaded.length > 1 ? 's' : ''} uploaded successfully
            </p>
            <p className="text-xs mt-0.5 text-green-700">
              {uploadResult.uploaded.join(', ')}
            </p>
            {uploadResult.errors.length > 0 && (
              <ul className="mt-1 list-disc list-inside text-xs text-yellow-700">
                {uploadResult.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {uploadError && (
        <div className="mb-4 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-800">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Upload failed</p>
            <p>{uploadError}</p>
          </div>
        </div>
      )}

      {/* Image grid */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
        </div>
      )}

      {!loading && images.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          <ImageOff className="mx-auto h-12 w-12 mb-2 text-gray-200" />
          <p className="text-sm">No images stored yet.</p>
          <p className="text-xs mt-1">Upload images above to get started.</p>
        </div>
      )}

      {!loading && images.length > 0 && (
        <>
          <p className="text-xs text-gray-400 mb-3">
            Click <strong>Copy Filename</strong> to copy the exact filename to paste into your Excel sheet.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {images.map((name) => (
              <div
                key={name}
                className="flex items-center justify-between gap-2 border border-gray-100 rounded-xl px-3 py-2.5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {/* Thumbnail */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/images/${encodeURIComponent(name)}`}
                    alt={name}
                    className="h-10 w-10 object-cover rounded-lg flex-shrink-0 bg-gray-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <span
                    className="text-xs text-gray-700 font-medium truncate"
                    title={name}
                  >
                    {name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyFilename(name)}
                  className={`flex-shrink-0 flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                    copiedKey === name
                      ? 'bg-green-100 text-green-700'
                      : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
                  }`}
                >
                  {copiedKey === name ? (
                    <>
                      <Check className="h-3.5 w-3.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

'use client';

import { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, FileSpreadsheet } from 'lucide-react';
import type { ImportResult } from '@/lib/types';

interface Props {
  token: string;
  onImportDone?: () => void;
}

export default function AdminUpload({ token, onImportDone }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'merge' | 'replace'>('merge');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<ImportResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setStatus('uploading');
    setResult(null);
    setErrorMsg('');

    const fd = new FormData();
    fd.append('file', file);
    fd.append('mode', mode);

    try {
      const res = await fetch('/api/import', {
        method: 'POST',
        headers: { 'x-admin-token': token },
        body: fd,
      });
      const data = (await res.json()) as ImportResult & { error?: string };
      if (!res.ok || !data.success) {
        setStatus('error');
        setErrorMsg(data.error ?? 'Import failed');
      } else {
        setStatus('done');
        setResult(data);
        onImportDone?.();
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
        <FileSpreadsheet className="h-5 w-5 text-brand-600" />
        Upload Product Catalog
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        Upload an Excel (.xlsx) file with columns:{' '}
        <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
          item_name, brand, category, description, images, video_url, stock_status
        </code>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Drop zone */}
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            file
              ? 'border-brand-400 bg-brand-50'
              : 'border-gray-300 hover:border-brand-400'
          }`}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <UploadCloud className="mx-auto h-10 w-10 text-gray-400 mb-2" />
          {file ? (
            <p className="text-sm font-medium text-brand-700">{file.name}</p>
          ) : (
            <p className="text-sm text-gray-500">
              Click to select or drag & drop your .xlsx file
            </p>
          )}
        </div>

        {/* Mode */}
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-600 font-medium">Import mode:</span>
          {(['merge', 'replace'] as const).map((m) => (
            <label key={m} className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                value={m}
                checked={mode === m}
                onChange={() => setMode(m)}
                className="accent-brand-600"
              />
              <span className="capitalize text-gray-700">{m}</span>
              <span className="text-gray-400 text-xs">
                {m === 'merge' ? '(keep existing)' : '(overwrite all)'}
              </span>
            </label>
          ))}
        </div>

        <button
          type="submit"
          disabled={!file || status === 'uploading'}
          className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-semibold py-2.5 rounded-xl transition-colors"
        >
          {status === 'uploading' ? 'Uploading…' : 'Import Products'}
        </button>
      </form>

      {/* Result */}
      {status === 'done' && result && (
        <div className="mt-4 flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
          <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Import successful!</p>
            <p>Imported: {result.imported} · Skipped: {result.skipped}</p>
            {result.errors.length > 0 && (
              <ul className="mt-1 list-disc list-inside text-xs text-yellow-700">
                {result.errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            )}
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Import failed</p>
            <p>{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Sample file hint */}
      <div className="mt-5 text-xs text-gray-400">
        <strong>Column guide:</strong> category must be{' '}
        <em>Electricals</em>, <em>Plumbing</em>, or <em>Paints</em>. stock_status:{' '}
        <em>In Stock</em> or <em>Out of Stock</em>. images: comma-separated URLs.
      </div>
    </div>
  );
}

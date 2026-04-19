"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, X, Loader2, Download } from "lucide-react";

interface FileUploadProps {
    value: string;
    onChange: (url: string) => void;
    accept?: string;
    label?: string;
}

export default function FileUpload({
    value,
    onChange,
    accept = ".pdf,.doc,.docx",
    label = "Resume/CV"
}: FileUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const uploadFile = async (file: File) => {
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Upload failed");
            }

            onChange(data.url);
        } catch (error: any) {
            console.error("Upload error:", error);
            alert(`Failed to upload file: ${error.message || "Unknown error"}`);
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadFile(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            uploadFile(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const removeFile = () => {
        onChange('');
    };

    const getFileName = (url: string) => {
        try {
            const parts = url.split('/');
            return parts[parts.length - 1];
        } catch {
            return 'Document';
        }
    };

    return (
        <div className="space-y-2">
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="hidden"
            />

            {value ? (
                <div className="glass rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-neon-cyan/10 shrink-0">
                            <FileText className="w-6 h-6 text-neon-cyan" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm text-white truncate">{getFileName(value)}</p>
                            <p className="text-xs text-white/50">{label} uploaded</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <motion.a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Download className="w-4 h-4 text-white" />
                        </motion.a>
                        <motion.button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Upload className="w-4 h-4 text-white" />
                        </motion.button>
                        <motion.button
                            type="button"
                            onClick={removeFile}
                            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <X className="w-4 h-4 text-red-400" />
                        </motion.button>
                    </div>
                </div>
            ) : (
                <motion.div
                    onClick={() => !uploading && inputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`relative h-24 rounded-xl border-2 border-dashed transition-all cursor-pointer flex items-center justify-center gap-3 ${dragOver
                        ? 'border-neon-cyan bg-neon-cyan/10'
                        : 'border-white/20 hover:border-white/40 bg-white/5'
                        } ${uploading ? 'pointer-events-none' : ''}`}
                    whileHover={{ scale: 1.01 }}
                >
                    {uploading ? (
                        <>
                            <Loader2 className="w-6 h-6 text-neon-cyan animate-spin" />
                            <span className="text-sm text-white/60">Uploading...</span>
                        </>
                    ) : (
                        <>
                            <div className="p-2 rounded-lg bg-white/10">
                                <FileText className="w-5 h-5 text-white/60" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-white/80">Upload {label}</p>
                                <p className="text-xs text-white/50">PDF, DOC up to 10MB</p>
                            </div>
                        </>
                    )}
                </motion.div>
            )}
        </div>
    );
}

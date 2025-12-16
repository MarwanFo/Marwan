"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const uploadImage = async (file: File) => {
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
            alert(`Failed to upload image: ${error.message || "Unknown error"}`);
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadImage(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            uploadImage(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const removeImage = () => {
        onChange('');
    };

    return (
        <div className="space-y-2">
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />

            {value ? (
                <div className="relative group rounded-xl overflow-hidden">
                    <img
                        src={value}
                        alt="Project preview"
                        className="w-full h-48 object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <motion.button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Upload className="w-5 h-5 text-white" />
                        </motion.button>
                        <motion.button
                            type="button"
                            onClick={removeImage}
                            className="p-2 rounded-lg bg-red-500/50 hover:bg-red-500/70 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <X className="w-5 h-5 text-white" />
                        </motion.button>
                    </div>
                </div>
            ) : (
                <motion.div
                    onClick={() => !uploading && inputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`relative h-48 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${dragOver
                        ? 'border-neon-cyan bg-neon-cyan/10'
                        : 'border-white/20 hover:border-white/40 bg-white/5'
                        } ${uploading ? 'pointer-events-none' : ''}`}
                    whileHover={{ scale: 1.01 }}
                >
                    {uploading ? (
                        <>
                            <Loader2 className="w-8 h-8 text-neon-cyan animate-spin" />
                            <span className="text-sm text-white/60">Uploading...</span>
                        </>
                    ) : (
                        <>
                            <div className="p-3 rounded-xl bg-white/10">
                                <ImageIcon className="w-6 h-6 text-white/60" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-white/80">Click to upload or drag & drop</p>
                                <p className="text-xs text-white/50 mt-1">PNG, JPG, GIF up to 5MB</p>
                            </div>
                        </>
                    )}
                </motion.div>
            )}
        </div>
    );
}

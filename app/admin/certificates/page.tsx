"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Certificate } from "@/lib/types";
import ImageUpload from "@/components/ImageUpload";
import {
    Plus,
    Pencil,
    Trash2,
    X,
    Save,
    Award,
    ExternalLink,
    Star,
    Calendar,
} from "lucide-react";

export default function CertificatesPage() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
    const [saving, setSaving] = useState(false);
    const supabase = createClient();

    const [formData, setFormData] = useState({
        title: "",
        issuer: "",
        date: "",
        credential_url: "",
        image_url: "",
        skills: "",
        featured: false,
    });

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("certificates")
            .select("id, title, issuer, date, credential_url, image_url, skills, featured, display_order, created_at")
            .order("display_order", { ascending: true });

        if (!error && data) {
            setCertificates(data);
        }
        setLoading(false);
    };

    const openModal = (certificate?: Certificate) => {
        if (certificate) {
            setEditingCertificate(certificate);
            setFormData({
                title: certificate.title,
                issuer: certificate.issuer,
                date: certificate.date || "",
                credential_url: certificate.credential_url || "",
                image_url: (certificate as any).image_url || "",
                skills: certificate.skills.join(", "),
                featured: certificate.featured,
            });
        } else {
            setEditingCertificate(null);
            setFormData({
                title: "",
                issuer: "",
                date: "",
                credential_url: "",
                image_url: "",
                skills: "",
                featured: false,
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCertificate(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const certificateData = {
            title: formData.title,
            issuer: formData.issuer,
            date: formData.date || null,
            credential_url: formData.credential_url || null,
            image_url: formData.image_url || null,
            skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
            featured: formData.featured,
            display_order: editingCertificate?.display_order || certificates.length,
        };

        if (editingCertificate) {
            await supabase
                .from("certificates")
                .update(certificateData)
                .eq("id", editingCertificate.id);
        } else {
            await supabase.from("certificates").insert(certificateData);
        }

        await fetchCertificates();
        closeModal();
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this certificate?")) {
            await supabase.from("certificates").delete().eq("id", id);
            await fetchCertificates();
        }
    };

    const inputClass = "w-full px-4 py-3 rounded-xl glass bg-white/5 border border-white/10 focus:border-neon-cyan/50 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 transition-all";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Certificates</h1>
                    <p className="text-white/60">Manage your certifications and credentials</p>
                </div>
                <motion.button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-neon-gradient text-background font-semibold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Certificate</span>
                </motion.button>
            </div>

            {/* Certificates Grid */}
            {loading ? (
                <div className="glass rounded-2xl p-12 text-center">
                    <div className="w-8 h-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white/60">Loading certificates...</p>
                </div>
            ) : certificates.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                    <p className="text-white/60 mb-4">No certificates yet</p>
                    <button
                        onClick={() => openModal()}
                        className="text-neon-cyan hover:text-white transition-colors"
                    >
                        Add your first certificate →
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {certificates.map((certificate) => (
                        <motion.div
                            key={certificate.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass rounded-xl p-5 group hover:bg-white/10 transition-colors relative"
                        >
                            {certificate.featured && (
                                <div className="absolute -top-2 -right-2">
                                    <div className="px-2 py-1 rounded-full bg-neon-gradient text-xs font-semibold text-background flex items-center gap-1">
                                        <Star className="w-3 h-3" />
                                        Featured
                                    </div>
                                </div>
                            )}

                            <div className="flex items-start gap-3 mb-3">
                                <div className="p-2 rounded-xl bg-neon-cyan/10 shrink-0">
                                    <Award className="w-5 h-5 text-neon-cyan" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-white truncate">{certificate.title}</h3>
                                    <p className="text-sm text-white/60">{certificate.issuer}</p>
                                </div>
                            </div>

                            {certificate.date && (
                                <div className="flex items-center gap-1 text-xs text-white/50 mb-3">
                                    <Calendar className="w-3 h-3" />
                                    <span>Earned {certificate.date}</span>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {certificate.skills.slice(0, 3).map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-2 py-0.5 rounded-full text-xs bg-white/5 text-white/60"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-white/10">
                                {certificate.credential_url ? (
                                    <a
                                        href={certificate.credential_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-xs text-neon-cyan hover:text-white transition-colors"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                        View Credential
                                    </a>
                                ) : (
                                    <span />
                                )}
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => openModal(certificate)}
                                        className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(certificate.id)}
                                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/60 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="glass rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white">
                                    {editingCertificate ? "Edit Certificate" : "Add New Certificate"}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-5 h-5 text-white/60" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                        Certificate Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g. AWS Certified Solutions Architect"
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-white/80 text-sm font-medium mb-2">
                                            Issuer *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.issuer}
                                            onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                                            placeholder="e.g. Amazon Web Services"
                                            required
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white/80 text-sm font-medium mb-2">
                                            Date
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            placeholder="e.g. 2024"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                        Certificate Image
                                    </label>
                                    <ImageUpload
                                        value={formData.image_url}
                                        onChange={(url) => setFormData({ ...formData, image_url: url })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                        Credential URL
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.credential_url}
                                        onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                                        placeholder="https://..."
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                        Skills (comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.skills}
                                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                        placeholder="Cloud Architecture, AWS, Security..."
                                        className={inputClass}
                                    />
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="featured"
                                        checked={formData.featured}
                                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                        className="w-5 h-5 rounded bg-white/10 border-white/20 text-neon-cyan focus:ring-neon-cyan"
                                    />
                                    <label htmlFor="featured" className="text-white/80">
                                        Featured certificate
                                    </label>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 py-3 rounded-xl border border-white/20 text-white/80 hover:bg-white/10 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 py-3 rounded-xl bg-neon-gradient text-background font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {saving ? (
                                            <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5" />
                                                <span>{editingCertificate ? "Update" : "Create"}</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

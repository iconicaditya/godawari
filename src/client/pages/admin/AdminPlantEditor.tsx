"use client";
import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from '@/client/next-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localQuery, localMutation } from '@/client/lib/localData';
import { ArrowLeft, ImagePlus, Save, Sparkles, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminLayout } from '@/client/components/admin/AdminLayout';
import { AdminCard, AdminButton, Input, Field, Select, Textarea, Toggle } from '@/client/components/admin/ui';

type PlantData = {
  _id?: string;
  slug: string;
  name: string;
  botanicalName: string;
  category: string;
  price: number;
  compareAtPrice: number | null;
  currency: string;
  shortDescription: string;
  description: string;
  careLevel: string;
  light: string;
  water: string;
  height: string;
  potIncluded: boolean;
  images: string[];
  tags: string[];
  inStock: boolean;
  stockCount: number;
  featured: boolean;
  newArrival: boolean;
  bestseller: boolean;
};

const empty: PlantData = {
  slug: '',
  name: '',
  botanicalName: '',
  category: 'indoor',
  price: 0,
  compareAtPrice: null,
  currency: 'NPR',
  shortDescription: '',
  description: '',
  careLevel: 'easy',
  light: 'Bright indirect',
  water: 'Weekly',
  height: '30–60 cm',
  potIncluded: true,
  images: [],
  tags: [],
  inStock: true,
  stockCount: 10,
  featured: false,
  newArrival: false,
  bestseller: false,
};

export default function AdminPlantEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<PlantData>(empty);
  const [imageInput, setImageInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const { data: existing } = useQuery({
    ...localQuery<PlantData>('admin.getPlant', { id }),
    enabled: !isNew,
  });

  useEffect(() => {
    if (existing && !isNew) setForm({ ...empty, ...existing });
  }, [existing, isNew]);

  const upsertMutation = useMutation({
    ...localMutation(isNew ? 'admin.createPlant' : 'admin.updatePlant'),
    onSuccess: () => {
      toast.success(isNew ? 'Plant added to the greenhouse' : 'Plant updated');
      queryClient.invalidateQueries({ queryKey: ['admin.listPlants'] });
      queryClient.invalidateQueries({ queryKey: ['admin.overview'] });
      navigate('/admin/plants');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function setField<K extends keyof PlantData>(k: K, v: PlantData[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function autoSlug() {
    const s = form.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    setField('slug', s);
  }

  function addImage() {
    const url = imageInput.trim();
    if (!url) return;
    setField('images', [...form.images, url]);
    setImageInput('');
  }

  function removeImage(i: number) {
    setField(
      'images',
      form.images.filter((_, idx) => idx !== i)
    );
  }

  function addTag() {
    const t = tagInput.trim();
    if (!t) return;
    setField('tags', Array.from(new Set([...form.tags, t])));
    setTagInput('');
  }

  function removeTag(t: string) {
    setField(
      'tags',
      form.tags.filter((x) => x !== t)
    );
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (form.images.length === 0) {
      toast.error('Please add at least one image URL');
      return;
    }
    if (!form.slug) {
      toast.error('Slug is required');
      return;
    }
    const payload = {
      ...(isNew ? {} : { id }),
      slug: form.slug,
      name: form.name,
      botanicalName: form.botanicalName,
      category: form.category,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      currency: form.currency,
      shortDescription: form.shortDescription,
      description: form.description,
      careLevel: form.careLevel,
      light: form.light,
      water: form.water,
      height: form.height,
      potIncluded: form.potIncluded,
      images: form.images,
      tags: form.tags,
      inStock: form.inStock,
      stockCount: Number(form.stockCount),
      featured: form.featured,
      newArrival: form.newArrival,
      bestseller: form.bestseller,
    };
    upsertMutation.mutate(payload);
  }

  return (
    <AdminLayout
      title={isNew ? 'New Plant' : `Edit · ${form.name || 'Plant'}`}
      subtitle={isNew ? 'Add to the catalog' : 'Update cultivar details'}
      actions={
        <Link to="/admin/plants">
          <AdminButton variant="ghost">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </AdminButton>
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="grid lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic */}
          <AdminCard>
            <h3 className="font-display text-2xl text-forest mb-1">Identity</h3>
            <p className="text-xs text-forest/50 mb-6">The botanical signature of this plant.</p>
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Common Name" required>
                <Input
                  required
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                  placeholder="e.g. Queen Phalaenopsis"
                  onBlur={() => !form.slug && autoSlug()}
                />
              </Field>
              <Field label="Botanical Name" required hint="Latin / italicised on storefront">
                <Input
                  required
                  value={form.botanicalName}
                  onChange={(e) => setField('botanicalName', e.target.value)}
                  placeholder="e.g. Phalaenopsis amabilis"
                />
              </Field>
              <Field label="Slug" required hint="URL-friendly identifier">
                <div className="flex gap-2">
                  <Input
                    required
                    value={form.slug}
                    onChange={(e) => setField('slug', e.target.value)}
                    placeholder="queen-phalaenopsis"
                  />
                  <AdminButton type="button" variant="outline" size="sm" onClick={autoSlug}>
                    <Sparkles className="w-3 h-3" /> Auto
                  </AdminButton>
                </div>
              </Field>
              <Field label="Category" required>
                <Select value={form.category} onChange={(e) => setField('category', e.target.value)}>
                  {['indoor', 'outdoor', 'succulent', 'flowering', 'herb', 'bonsai', 'fruit'].map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
          </AdminCard>

          {/* Description */}
          <AdminCard>
            <h3 className="font-display text-2xl text-forest mb-1">Description</h3>
            <p className="text-xs text-forest/50 mb-6">The story shown on the storefront.</p>
            <div className="space-y-5">
              <Field label="Short Description" required hint="One sentence used on cards & summaries.">
                <Textarea
                  required
                  rows={2}
                  value={form.shortDescription}
                  onChange={(e) => setField('shortDescription', e.target.value)}
                  placeholder="An elegant orchid with arching white blooms…"
                  className="min-h-[60px]"
                />
              </Field>
              <Field label="Full Description" required>
                <Textarea
                  required
                  rows={6}
                  value={form.description}
                  onChange={(e) => setField('description', e.target.value)}
                  placeholder="Origin, character, the experience of caring for it…"
                />
              </Field>
            </div>
          </AdminCard>

          {/* Care */}
          <AdminCard>
            <h3 className="font-display text-2xl text-forest mb-1">Care & Habit</h3>
            <p className="text-xs text-forest/50 mb-6">Practical attributes shown in the product detail.</p>
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Care Level" required>
                <Select value={form.careLevel} onChange={(e) => setField('careLevel', e.target.value)}>
                  {['easy', 'moderate', 'expert'].map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Mature Height">
                <Input
                  value={form.height}
                  onChange={(e) => setField('height', e.target.value)}
                  placeholder="e.g. 60–90 cm"
                />
              </Field>
              <Field label="Light">
                <Input
                  value={form.light}
                  onChange={(e) => setField('light', e.target.value)}
                  placeholder="e.g. Bright indirect"
                />
              </Field>
              <Field label="Water">
                <Input
                  value={form.water}
                  onChange={(e) => setField('water', e.target.value)}
                  placeholder="e.g. Weekly, allow to dry between"
                />
              </Field>
            </div>
          </AdminCard>

          {/* Images */}
          <AdminCard>
            <h3 className="font-display text-2xl text-forest mb-1">Imagery</h3>
            <p className="text-xs text-forest/50 mb-6">First image is the cover; subsequent ones build the gallery.</p>
            <div className="flex gap-2 mb-5">
              <Input
                placeholder="Paste image URL (Unsplash, CDN…)"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addImage();
                  }
                }}
              />
              <AdminButton type="button" onClick={addImage} variant="outline">
                <ImagePlus className="w-3.5 h-3.5" /> Add
              </AdminButton>
            </div>
            {form.images.length === 0 ? (
              <div className="border border-dashed border-stone/70 py-10 text-center text-sm text-forest/40">
                No images yet — add at least one URL above.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {form.images.map((src, i) => (
                  <div key={src + i} className="relative group">
                    <div className="aspect-square bg-cream overflow-hidden">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                    </div>
                    {i === 0 && (
                      <span className="absolute top-2 left-2 bg-forest text-cream text-[10px] tracking-widest uppercase px-1.5 py-0.5">
                        Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 p-1 bg-ivory/90 text-terracotta hover:bg-terracotta hover:text-cream transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </AdminCard>
        </div>

        {/* Sidebar column */}
        <div className="space-y-6">
          <AdminCard>
            <h3 className="font-display text-2xl text-forest mb-1">Pricing</h3>
            <p className="text-xs text-forest/50 mb-6">All prices in NPR.</p>
            <div className="space-y-5">
              <Field label="Price" required>
                <Input
                  type="number"
                  required
                  min={0}
                  value={form.price}
                  onChange={(e) => setField('price', Number(e.target.value))}
                />
              </Field>
              <Field label="Compare At" hint="Optional original price for sale display.">
                <Input
                  type="number"
                  min={0}
                  value={form.compareAtPrice ?? ''}
                  onChange={(e) =>
                    setField('compareAtPrice', e.target.value === '' ? null : Number(e.target.value))
                  }
                />
              </Field>
              <Field label="Currency">
                <Select value={form.currency} onChange={(e) => setField('currency', e.target.value)}>
                  <option value="NPR">NPR — Nepalese Rupee</option>
                  <option value="USD">USD — US Dollar</option>
                  <option value="INR">INR — Indian Rupee</option>
                </Select>
              </Field>
            </div>
          </AdminCard>

          <AdminCard>
            <h3 className="font-display text-2xl text-forest mb-1">Inventory</h3>
            <p className="text-xs text-forest/50 mb-6">Availability for the storefront.</p>
            <div className="space-y-4">
              <Toggle
                label="Available for purchase"
                hint="Toggle off to hide buy button."
                checked={form.inStock}
                onChange={(v) => setField('inStock', v)}
              />
              <Field label="Stock Count">
                <Input
                  type="number"
                  min={0}
                  value={form.stockCount}
                  onChange={(e) => setField('stockCount', Number(e.target.value))}
                />
              </Field>
              <Toggle
                label="Pot included"
                hint="Indicates a finished arrangement."
                checked={form.potIncluded}
                onChange={(v) => setField('potIncluded', v)}
              />
            </div>
          </AdminCard>

          <AdminCard>
            <h3 className="font-display text-2xl text-forest mb-1">Visibility</h3>
            <p className="text-xs text-forest/50 mb-6">Where this appears on the storefront.</p>
            <div className="space-y-3">
              <Toggle
                label="Featured"
                hint="Show in the homepage feature grid."
                checked={form.featured}
                onChange={(v) => setField('featured', v)}
              />
              <Toggle
                label="New Arrival"
                hint="Tagged with the New badge."
                checked={form.newArrival}
                onChange={(v) => setField('newArrival', v)}
              />
              <Toggle
                label="Bestseller"
                hint="Tagged with the Bestseller badge."
                checked={form.bestseller}
                onChange={(v) => setField('bestseller', v)}
              />
            </div>
          </AdminCard>

          <AdminCard>
            <h3 className="font-display text-2xl text-forest mb-1">Tags</h3>
            <p className="text-xs text-forest/50 mb-6">Used by search and filters.</p>
            <div className="flex gap-2 mb-4">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="e.g. low-light"
              />
              <AdminButton type="button" onClick={addTag} variant="outline">
                Add
              </AdminButton>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {form.tags.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => removeTag(t)}
                  className="inline-flex items-center gap-1 bg-cream border border-stone/60 px-2.5 py-1 text-[11px] tracking-wide hover:border-terracotta hover:text-terracotta transition-colors"
                >
                  {t} <X className="w-3 h-3" />
                </button>
              ))}
              {form.tags.length === 0 && <p className="text-xs text-forest/40">No tags yet</p>}
            </div>
          </AdminCard>

          <AdminButton type="submit" className="w-full justify-center" disabled={upsertMutation.isPending}>
            <Save className="w-3.5 h-3.5" />
            {upsertMutation.isPending ? 'Saving…' : isNew ? 'Add to Catalog' : 'Save Changes'}
          </AdminButton>
        </div>
      </form>
    </AdminLayout>
  );
}



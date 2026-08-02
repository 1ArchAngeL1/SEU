'use client';

import { useMemo, useState } from 'react';
import {
  Check,
  Loader2,
  Save,
  Trash2,
  MapPin,
  Copy,
  ClipboardPaste,
  Layers,
  CheckCheck,
} from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAllProjects } from '@/hooks/queries/use-projects';
import { useBuildingsByProject } from '@/hooks/queries/use-buildings';
import { useFloorsByBuilding } from '@/hooks/queries/use-floors';
import { useUnitsList, useUpdateUnit } from '@/hooks/queries/use-units';
import { fileUrl } from '@/lib/file-url';
import type { PolygonPoint, Unit } from '@/model/types/api';

/** Parse pasted polygon text into normalized points. Accepts:
 *  - JSON: [{"x":..,"y":..}, ...]  or  [[x,y], ...]
 *  - plain numbers: "x,y x,y ..."  or  "x,y,x,y,..."               */
function parsePolygon(text: string): PolygonPoint[] {
  const t = text.trim();
  if (!t) return [];
  try {
    const j = JSON.parse(t);
    if (Array.isArray(j) && j.length) {
      if (typeof j[0] === 'object' && j[0] && 'x' in j[0]) {
        return j
          .map((p: { x: number; y: number }) => ({ x: +p.x, y: +p.y }))
          .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));
      }
      if (Array.isArray(j[0])) {
        return j
          .map((p: number[]) => ({ x: +p[0], y: +p[1] }))
          .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));
      }
    }
  } catch {
    /* fall through to number extraction */
  }
  const nums = (t.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
  const pts: PolygonPoint[] = [];
  for (let i = 0; i + 1 < nums.length; i += 2) {
    pts.push({ x: nums[i], y: nums[i + 1] });
  }
  return pts;
}

function polygonToText(poly?: PolygonPoint[] | null): string {
  if (!poly?.length) return '';
  return JSON.stringify(poly.map((p) => ({ x: p.x, y: p.y })));
}

/** Sort numeric apartment numbers first (1,2,…), then non-numeric ones like
 *  commerce/office units (C1, C2-1) alphabetically — so every unit type shows. */
function byUnitNumber(a: Unit, b: Unit): number {
  const na = Number(a.unitNumber);
  const nb = Number(b.unitNumber);
  const af = Number.isFinite(na);
  const bf = Number.isFinite(nb);
  if (af && bf) return na - nb;
  if (af) return -1;
  if (bf) return 1;
  return String(a.unitNumber).localeCompare(String(b.unitNumber));
}

const COLORS = [
  '#2ecc71', '#ff6b35', '#3b82f6', '#ec4899', '#f59e0b', '#10b981',
  '#8b5cf6', '#06b6d4', '#ef4444', '#84cc16', '#14b8a6', '#a855f7',
  '#eab308', '#0ea5e9', '#f43f5e', '#22c55e',
];

export default function FloorPolygonsPage() {
  const [projectId, setProjectId] = useState('');
  const [buildingId, setBuildingId] = useState('');
  const [floorId, setFloorId] = useState('');
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState<string | null>(null);
  const [imgNatural, setImgNatural] = useState<{ w: number; h: number } | null>(null);
  // Copy buffer: a single polygon copied from a unit, pasteable into any unit.
  const [copied, setCopied] = useState<PolygonPoint[] | null>(null);
  const [copiedFrom, setCopiedFrom] = useState('');
  // Bulk: copy an entire floor's polygons (by unit order) into the current floor.
  const [copyFromFloorId, setCopyFromFloorId] = useState('');
  const [savingAll, setSavingAll] = useState(false);

  const projects = useAllProjects().data ?? [];
  const buildings = useBuildingsByProject(projectId || undefined).data ?? [];
  const floors = useFloorsByBuilding(buildingId || undefined).data ?? [];
  const floor = floors.find((f) => f.id === floorId);

  const unitsQ = useUnitsList(
    { building: buildingId || undefined, floorNumber: floor?.floorNumber },
    { page: 1, limit: 100 },
    'typePriority',
  );
  const units = useMemo(
    () =>
      [...(unitsQ.data?.items ?? [])].sort(
        byUnitNumber,
      ),
    [unitsQ.data],
  );
  const updateUnit = useUpdateUnit();

  // Units of the floor we're copying FROM (for the bulk floor copy).
  const copyFromFloor = floors.find((f) => f.id === copyFromFloorId);
  const srcUnitsQ = useUnitsList(
    { building: buildingId || undefined, floorNumber: copyFromFloor?.floorNumber },
    { page: 1, limit: 100 },
    'typePriority',
  );

  const floorImg = fileUrl(floor?.renderImage) || fileUrl(floor?.floorImageId);

  // Effective polygon per unit: live draft (if being edited) else the saved one.
  function polyFor(u: Unit): PolygonPoint[] {
    const d = drafts[u.id];
    if (d !== undefined) return parsePolygon(d);
    return u.polygon ?? [];
  }
  function textFor(u: Unit): string {
    return drafts[u.id] ?? polygonToText(u.polygon);
  }
  function setDraft(id: string, v: string) {
    setDrafts((p) => ({ ...p, [id]: v }));
  }

  async function save(u: Unit) {
    const polygon = parsePolygon(textFor(u));
    await updateUnit.mutateAsync({ id: u.id, input: { polygon } });
    setDrafts((p) => {
      const n = { ...p };
      delete n[u.id];
      return n;
    });
    setSavedFlash(u.id);
    setTimeout(() => setSavedFlash((s) => (s === u.id ? null : s)), 1500);
  }

  async function clear(u: Unit) {
    await updateUnit.mutateAsync({ id: u.id, input: { polygon: [] } });
    setDrafts((p) => ({ ...p, [u.id]: '' }));
  }

  function copyUnit(u: Unit) {
    const poly = polyFor(u);
    if (poly.length < 3) return;
    setCopied(poly);
    setCopiedFrom(`#${u.unitNumber}`);
  }
  function pasteUnit(u: Unit) {
    if (copied) setDraft(u.id, polygonToText(copied));
  }

  // Copy every polygon from another floor into this floor, matched by unit
  // order (both sorted by number). Fills drafts — review on the plan, then Save.
  function applyFloorCopy() {
    const src = [...(srcUnitsQ.data?.items ?? [])].sort(
      byUnitNumber,
    );
    const next = { ...drafts };
    const n = Math.min(src.length, units.length);
    let filled = 0;
    for (let i = 0; i < n; i++) {
      if (src[i].polygon?.length) {
        next[units[i].id] = polygonToText(src[i].polygon);
        filled++;
      }
    }
    setDrafts(next);
    return filled;
  }

  async function saveAll() {
    const toSave = units.filter(
      (u) => drafts[u.id] !== undefined && parsePolygon(drafts[u.id]).length >= 3,
    );
    if (!toSave.length) return;
    setSavingAll(true);
    try {
      for (const u of toSave) {
        await updateUnit.mutateAsync({
          id: u.id,
          input: { polygon: parsePolygon(drafts[u.id]) },
        });
      }
      setDrafts((prev) => {
        const n = { ...prev };
        toSave.forEach((u) => delete n[u.id]);
        return n;
      });
    } finally {
      setSavingAll(false);
    }
  }

  // One-click: copy the chosen floor's polygons onto this floor (matched by
  // unit order) and save immediately — no draft step.
  async function copyFloorAndSave() {
    const src = [...(srcUnitsQ.data?.items ?? [])].sort(
      byUnitNumber,
    );
    const n = Math.min(src.length, units.length);
    setSavingAll(true);
    try {
      for (let i = 0; i < n; i++) {
        const poly = src[i].polygon;
        if (poly && poly.length >= 3) {
          await updateUnit.mutateAsync({ id: units[i].id, input: { polygon: poly } });
        }
      }
    } finally {
      setSavingAll(false);
    }
  }

  const dirtyCount = units.filter(
    (u) => drafts[u.id] !== undefined && parsePolygon(drafts[u.id]).length >= 3,
  ).length;

  const projName = (id: string) => {
    const p = projects.find((x) => x.id === id);
    return p ? p.nameEn || p.nameKa : '';
  };

  return (
    <div>
      <AdminPageHeader
        title="Floor Polygons"
        description="Pick a floor, then paste a polygon for each apartment and save it directly."
      />

      {/* Selectors */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Select
          value={projectId}
          onValueChange={(v) => {
            setProjectId(v);
            setBuildingId('');
            setFloorId('');
          }}
        >
          <SelectTrigger className="w-56"><SelectValue placeholder="Project" /></SelectTrigger>
          <SelectContent>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.nameEn || p.nameKa}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={buildingId}
          onValueChange={(v) => {
            setBuildingId(v);
            setFloorId('');
          }}
          disabled={!projectId}
        >
          <SelectTrigger className="w-56"><SelectValue placeholder="Building / Block" /></SelectTrigger>
          <SelectContent>
            {buildings.map((b) => (
              <SelectItem key={b.id} value={b.id}>{b.nameEn || `Block ${b.block}`}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={floorId} onValueChange={setFloorId} disabled={!buildingId}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Floor" /></SelectTrigger>
          <SelectContent>
            {[...floors]
              .sort((a, b) => a.floorNumber - b.floorNumber)
              .map((f) => (
                <SelectItem key={f.id} value={f.id}>Floor {f.floorNumber}</SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {!floorId ? (
        <div className="rounded-2xl border border-dashed border-admin-border-soft bg-admin-card p-16 text-center font-montserrat text-seu-caption text-admin-fg-dim">
          Select a project, building and floor to begin.
        </div>
      ) : (
        <>
          {/* Toolbar: bulk copy-from-floor + save-all + copy buffer status */}
          <div className="flex flex-wrap items-center gap-3 mb-4 rounded-xl border border-admin-border-soft bg-admin-card p-3">
            <Layers className="size-4 text-admin-fg-dim" />
            <span className="font-montserrat text-seu-caption-sm text-admin-fg-muted">Copy all polygons from</span>
            <Select value={copyFromFloorId} onValueChange={setCopyFromFloorId}>
              <SelectTrigger className="w-40"><SelectValue placeholder="another floor" /></SelectTrigger>
              <SelectContent>
                {[...floors]
                  .filter((f) => f.id !== floorId)
                  .sort((a, b) => a.floorNumber - b.floorNumber)
                  .map((f) => (
                    <SelectItem key={f.id} value={f.id}>Floor {f.floorNumber}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <button
              type="button"
              onClick={applyFloorCopy}
              disabled={!copyFromFloorId || srcUnitsQ.isLoading}
              className="font-montserrat font-medium text-seu-caption-sm text-white bg-dark-green px-4 py-1.5 rounded-lg disabled:opacity-40 hover:bg-dark-green/85 transition-colors"
            >
              Load into drafts
            </button>
            <button
              type="button"
              onClick={copyFloorAndSave}
              disabled={!copyFromFloorId || srcUnitsQ.isLoading || savingAll}
              className="flex items-center gap-2 font-montserrat font-medium text-seu-caption-sm text-white bg-primary-green px-4 py-1.5 rounded-lg disabled:opacity-40 hover:bg-primary-green/85 transition-colors"
            >
              {savingAll ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCheck className="size-3.5" />}
              Copy &amp; save
            </button>
            <span className="font-montserrat text-seu-caption-sm text-admin-fg-dim">(matched by unit order)</span>

            <button
              type="button"
              onClick={saveAll}
              disabled={savingAll || dirtyCount === 0}
              className="ml-auto flex items-center gap-2 font-montserrat font-medium text-seu-caption-sm text-white bg-primary-green px-4 py-1.5 rounded-lg disabled:opacity-40 hover:bg-primary-green/85 transition-colors"
            >
              {savingAll ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCheck className="size-3.5" />}
              Save all{dirtyCount ? ` (${dirtyCount})` : ''}
            </button>
          </div>

          {copied && (
            <div className="flex items-center gap-2 mb-4 rounded-lg border border-primary-green/40 bg-primary-green/5 px-3 py-2 font-montserrat text-seu-caption-sm text-admin-fg">
              <Copy className="size-4 text-primary-green" />
              Copied polygon from <b>{copiedFrom}</b> ({copied.length} pts). Click <b>Paste</b> on any unit.
              <button type="button" onClick={() => { setCopied(null); setCopiedFrom(''); }} className="ml-2 text-admin-fg-dim hover:text-red">clear</button>
            </div>
          )}

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 items-start">
          {/* Floor image + overlay */}
          <div className="lg:sticky lg:top-4 rounded-2xl border border-admin-border-soft bg-admin-card p-3">
            {floorImg ? (
              <div
                className="relative w-full mx-auto bg-dark-green rounded-lg overflow-hidden"
                style={{
                  maxHeight: '78vh',
                  ...(imgNatural ? { aspectRatio: `${imgNatural.w} / ${imgNatural.h}` } : {}),
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={floorImg}
                  alt={`Floor ${floor?.floorNumber}`}
                  className="w-full h-full object-contain block"
                  onLoad={(e) =>
                    setImgNatural({
                      w: e.currentTarget.naturalWidth,
                      h: e.currentTarget.naturalHeight,
                    })
                  }
                />
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                  {units.map((u, i) => {
                    const poly = polyFor(u);
                    if (poly.length < 3) return null;
                    const isSel = selected === u.id;
                    const c = COLORS[i % COLORS.length];
                    const cx = poly.reduce((s, p) => s + p.x, 0) / poly.length;
                    const cy = poly.reduce((s, p) => s + p.y, 0) / poly.length;
                    return (
                      <g key={u.id} onClick={() => setSelected(u.id)} className="cursor-pointer">
                        <polygon
                          points={poly.map((p) => `${p.x},${p.y}`).join(' ')}
                          fill={c}
                          fillOpacity={isSel ? 0.55 : 0.3}
                          stroke={c}
                          strokeWidth={isSel ? 0.5 : 0.3}
                          vectorEffect="non-scaling-stroke"
                        />
                        <text x={cx} y={cy} fill="#fff" fontSize="2.4" textAnchor="middle" dominantBaseline="middle" style={{ paintOrder: 'stroke', stroke: '#0009', strokeWidth: 0.5 }}>
                          {u.unitNumber}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            ) : (
              <div className="h-64 grid place-items-center font-montserrat text-seu-caption text-admin-fg-dim">
                This floor has no image.
              </div>
            )}
            <p className="mt-2 font-montserrat text-seu-caption-sm text-admin-fg-dim text-center">
              Polygons are % of the image (0–100). Colored = has polygon · click a shape to select.
            </p>
          </div>

          {/* Unit list */}
          <div className="space-y-3">
            {unitsQ.isLoading ? (
              <div className="flex items-center gap-2 text-admin-fg-dim p-6">
                <Loader2 className="size-4 animate-spin" /> Loading units…
              </div>
            ) : units.length === 0 ? (
              <div className="rounded-xl border border-admin-border-soft bg-admin-card p-8 text-center text-admin-fg-dim font-montserrat text-seu-caption">
                No units on this floor.
              </div>
            ) : (
              units.map((u, i) => {
                const eff = polyFor(u);
                const savedPts = u.polygon?.length ?? 0;
                const dirty = drafts[u.id] !== undefined;
                const c = COLORS[i % COLORS.length];
                return (
                  <div
                    key={u.id}
                    onClick={() => setSelected(u.id)}
                    className={`rounded-xl border bg-admin-card p-3 transition-colors ${
                      selected === u.id ? 'border-primary-green/60' : 'border-admin-border-soft'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 font-montserrat text-seu-body-sm text-admin-fg">
                        <span className="inline-block size-3 rounded-sm" style={{ background: c }} />
                        <MapPin className="size-3.5 text-admin-fg-dim" />
                        <span className="font-semibold">#{u.unitNumber}</span>
                        <span className="text-admin-fg-dim text-seu-caption-sm">
                          {savedPts > 0 ? `${savedPts} pts saved` : 'no polygon'}
                          {dirty && eff.length >= 3 ? ` · ${eff.length} pts draft` : ''}
                        </span>
                      </div>
                      {savedFlash === u.id && (
                        <span className="flex items-center gap-1 text-primary-green text-seu-caption-sm">
                          <Check className="size-4" /> saved
                        </span>
                      )}
                    </div>
                    <textarea
                      value={textFor(u)}
                      onChange={(e) => setDraft(u.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      rows={2}
                      spellCheck={false}
                      placeholder='[{"x":18.7,"y":59.9},{"x":27.2,"y":59.9}, …]  — or  x,y x,y …'
                      className="w-full resize-y rounded-lg border border-admin-border-soft bg-admin-input-gradient px-3 py-2 font-mono text-[0.72rem] leading-snug text-admin-fg placeholder-admin-fg-dim focus:outline-none focus:border-primary-green/50"
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); save(u); }}
                        disabled={updateUnit.isPending}
                        className="flex items-center gap-2 bg-primary-green text-white font-montserrat font-medium text-seu-caption-sm px-4 py-1.5 rounded-lg hover:bg-primary-green/85 disabled:opacity-60 transition-colors"
                      >
                        <Save className="size-3.5" /> Save
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); clear(u); }}
                        disabled={updateUnit.isPending || savedPts === 0}
                        className="flex items-center gap-1.5 text-admin-fg-muted hover:text-red font-montserrat text-seu-caption-sm px-2 py-1.5 disabled:opacity-40 transition-colors"
                      >
                        <Trash2 className="size-3.5" /> Clear
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); copyUnit(u); }}
                        disabled={eff.length < 3}
                        title="Copy this polygon to the buffer"
                        className="flex items-center gap-1.5 text-admin-fg-muted hover:text-primary-green font-montserrat text-seu-caption-sm px-2 py-1.5 disabled:opacity-40 transition-colors"
                      >
                        <Copy className="size-3.5" /> Copy
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); pasteUnit(u); }}
                        disabled={!copied}
                        title="Paste the copied polygon here"
                        className="flex items-center gap-1.5 text-admin-fg-muted hover:text-primary-green font-montserrat text-seu-caption-sm px-2 py-1.5 disabled:opacity-40 transition-colors"
                      >
                        <ClipboardPaste className="size-3.5" /> Paste
                      </button>
                      <span className="ml-auto font-montserrat text-seu-caption-sm text-admin-fg-dim">
                        {projName(projectId)} · Block {floor && buildings.find(b=>b.id===buildingId)?.block} · Floor {floor?.floorNumber}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        </>
      )}
    </div>
  );
}

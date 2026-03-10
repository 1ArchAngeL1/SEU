'use client';

import { useState, useEffect, useCallback } from 'react';
import { addProject, getProjectsPaged, removeProject, getAllProjects } from '@/prisma/project';
import { createBuilding, getBuildingsPaged, removeBuilding, getAllBuildingsByProjectId } from '@/prisma/building';
import { createApartment, getAllApartmentsFiltered, removeApartment } from '@/prisma/apartment';
import { getContactRequests, removeContactRequest } from '@/prisma/contact';
import type { RoomType } from '@prisma/client';
import { ApartmentDTO } from '@/model/dto/apartment.dto';

type Tab = 'projects' | 'buildings' | 'apartments' | 'contacts';
type Project = { id: string; name: string; address: string };
type Building = { id: string; block: string };

const inputClass = 'bg-secondary-black/40 border border-secondary-black text-pale-gray placeholder:text-secondary-grey/60 rounded-lg px-3 py-2 text-seu-caption focus:outline-none focus:border-pale-gray/40 transition-colors';
const selectClass = 'bg-secondary-black/40 border border-secondary-black text-pale-gray rounded-lg px-3 py-2 text-seu-caption focus:outline-none focus:border-pale-gray/40 transition-colors';
const btnPrimary = 'bg-primary-green text-white font-montserrat font-medium text-seu-caption px-6 py-2 rounded-lg hover:bg-primary-green/85 transition-colors disabled:opacity-50';
const btnDanger = 'text-red/80 hover:text-red text-seu-caption-sm transition-colors';
const btnPage = 'px-3 py-1.5 border border-secondary-black rounded-lg text-seu-caption-sm text-pale-gray disabled:opacity-30 hover:bg-secondary-black/40 transition-colors';
const labelClass = 'text-seu-caption-sm text-secondary-grey font-montserrat';

// ---------- Shared UI components ----------

function Paginator({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex gap-3 mt-6 items-center justify-center">
      <button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1} className={btnPage}>Prev</button>
      <span className="text-seu-caption-sm text-secondary-grey">{page} / {totalPages}</span>
      <button onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages} className={btnPage}>Next</button>
    </div>
  );
}

function AdminTable({ headers, children, emptyColSpan, emptyText }: {
  headers: string[];
  children: React.ReactNode;
  emptyColSpan: number;
  emptyText: string;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-secondary-black">
      <table className="w-full text-seu-caption font-montserrat">
        <thead>
          <tr className="bg-secondary-black/40 text-left text-secondary-grey">
            {headers.map((h) => <th key={h} className="p-3 font-medium">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {children}
          {!children || (Array.isArray(children) && children.length === 0) ? (
            <tr><td colSpan={emptyColSpan} className="p-6 text-center text-secondary-grey/60">{emptyText}</td></tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

function EmptyRow({ colSpan, text }: { colSpan: number; text: string }) {
  return <tr><td colSpan={colSpan} className="p-6 text-center text-secondary-grey/60">{text}</td></tr>;
}

function TableRow({ children }: { children: React.ReactNode }) {
  return <tr className="border-t border-secondary-black hover:bg-secondary-black/20 transition-colors">{children}</tr>;
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

function ProjectSelect({ projects, value, onChange }: { projects: Project[]; value: string; onChange: (id: string) => void }) {
  return (
    <FormField label="Project">
      <select value={value} onChange={(e) => onChange(e.target.value)} className={selectClass}>
        {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
    </FormField>
  );
}

// ---------- Projects ----------

function ProjectsTab() {
  const [items, setItems] = useState<Array<{ id: string; name: string; address: string; createdAt: Date }>>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    const res = await getProjectsPaged(page, 10);
    setItems(res.items);
    setTotalPages(res.totalPages);
  }, [page]);

  useEffect(() => { load(); }, [load]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await addProject({ name: name.trim(), address: address.trim() });
    setName(''); setAddress('');
    setLoading(false);
    load();
  }

  async function handleRemove(id: string) {
    if (!confirm('Delete this project?')) return;
    await removeProject(id);
    load();
  }

  return (
    <div>
      <form onSubmit={handleAdd} className="flex gap-3 mb-8 flex-wrap">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" required className={inputClass} />
        <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" className={inputClass} />
        <button type="submit" disabled={loading} className={btnPrimary}>Add Project</button>
      </form>

      <div className="overflow-x-auto rounded-lg border border-secondary-black">
        <table className="w-full text-seu-caption font-montserrat">
          <thead>
            <tr className="bg-secondary-black/40 text-left text-secondary-grey">
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Address</th>
              <th className="p-3 font-medium">Created</th>
              <th className="p-3 font-medium w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0
              ? <EmptyRow colSpan={4} text="No projects" />
              : items.map((p) => (
                <TableRow key={p.id}>
                  <td className="p-3 text-pale-gray">{p.name}</td>
                  <td className="p-3 text-pale-gray/70">{p.address}</td>
                  <td className="p-3 text-pale-gray/50">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="p-3"><button onClick={() => handleRemove(p.id)} className={btnDanger}>Delete</button></td>
                </TableRow>
              ))}
          </tbody>
        </table>
      </div>

      <Paginator page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

// ---------- Buildings ----------

function BuildingsTab() {
  const [items, setItems] = useState<Array<{ id: string; block: string; floorCount: number; projectId: string; createdAt: Date; project: { name: string } }>>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState('');
  const [block, setBlock] = useState('');
  const [floorCount, setFloorCount] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch projects once on mount — no dependency on page/projectId
  useEffect(() => {
    getAllProjects().then((projs) => {
      setProjects(projs);
      if (projs.length > 0) setProjectId(projs[0].id);
    });
  }, []);

  // Load only depends on page — no cascade
  const load = useCallback(async () => {
    const res = await getBuildingsPaged({ page, pageSize: 10 });
    setItems(res.items as typeof items);
    setTotalPages(res.totalPages);
  }, [page]);

  useEffect(() => { load(); }, [load]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!projectId || !block.trim() || !floorCount) return;
    setLoading(true);
    await createBuilding({ projectId, block: block.trim(), floorCount: parseInt(floorCount) });
    setBlock(''); setFloorCount('');
    setLoading(false);
    load();
  }

  async function handleRemove(id: string) {
    if (!confirm('Delete this building?')) return;
    await removeBuilding(id);
    load();
  }

  return (
    <div>
      <form onSubmit={handleAdd} className="flex gap-3 mb-8 flex-wrap items-end">
        <ProjectSelect projects={projects} value={projectId} onChange={setProjectId} />
        <input value={block} onChange={(e) => setBlock(e.target.value)} placeholder="Block (e.g. A)" required className={inputClass} />
        <input value={floorCount} onChange={(e) => setFloorCount(e.target.value)} placeholder="Floor count" type="number" min="1" required className={`${inputClass} w-32`} />
        <button type="submit" disabled={loading} className={btnPrimary}>Add Building</button>
      </form>

      <div className="overflow-x-auto rounded-lg border border-secondary-black">
        <table className="w-full text-seu-caption font-montserrat">
          <thead>
            <tr className="bg-secondary-black/40 text-left text-secondary-grey">
              <th className="p-3 font-medium">Project</th>
              <th className="p-3 font-medium">Block</th>
              <th className="p-3 font-medium">Floors</th>
              <th className="p-3 font-medium">Created</th>
              <th className="p-3 font-medium w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0
              ? <EmptyRow colSpan={5} text="No buildings" />
              : items.map((b) => (
                <TableRow key={b.id}>
                  <td className="p-3 text-pale-gray">{b.project.name}</td>
                  <td className="p-3 text-pale-gray">{b.block}</td>
                  <td className="p-3 text-pale-gray/70">{b.floorCount}</td>
                  <td className="p-3 text-pale-gray/50">{new Date(b.createdAt).toLocaleDateString()}</td>
                  <td className="p-3"><button onClick={() => handleRemove(b.id)} className={btnDanger}>Delete</button></td>
                </TableRow>
              ))}
          </tbody>
        </table>
      </div>

      <Paginator page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

// ---------- Apartments ----------

const ROOM_TYPES: RoomType[] = ['BEDROOM', 'LIVING_ROOM', 'KITCHEN', 'BATHROOM', 'BALCONY', 'HALLWAY', 'STORAGE'];
const EMPTY_FORM = { floor: '', apartmentNo: '', totalSize: '', mainSize: '', openSpaceSize: '', bedroomCount: '', price: '' };

function ApartmentsTab() {
  const [items, setItems] = useState<ApartmentDTO[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [projects, setProjects] = useState<Project[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [buildingId, setBuildingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [rooms, setRooms] = useState<Array<{ roomType: RoomType; size: string }>>([]);

  // Fetch projects once on mount — no dependency cascade
  useEffect(() => {
    getAllProjects().then((projs) => {
      setProjects(projs);
      if (projs.length > 0) setSelectedProject(projs[0].id);
    });
  }, []);

  // Load apartments — only depends on page, no cascade
  const load = useCallback(async () => {
    const res = await getAllApartmentsFiltered({}, { page, pageSize: 10 });
    setItems(res.items as ApartmentDTO[]);
    setTotalPages(res.totalPages);
  }, [page]);

  useEffect(() => { load(); }, [load]);

  // Load buildings when project changes
  useEffect(() => {
    if (!selectedProject) return;
    getAllBuildingsByProjectId(selectedProject).then((b) => {
      setBuildings(b);
      setBuildingId(b.length > 0 ? b[0].id : '');
    });
  }, [selectedProject]);

  function updateForm(key: keyof typeof EMPTY_FORM, val: string) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function addRoom() { setRooms((prev) => [...prev, { roomType: 'BEDROOM', size: '' }]); }
  function removeRoom(idx: number) { setRooms((prev) => prev.filter((_, i) => i !== idx)); }
  function updateRoom(idx: number, key: 'roomType' | 'size', val: string) {
    setRooms((prev) => prev.map((r, i) => (i === idx ? { ...r, [key]: val } : r)));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!buildingId) return;
    setLoading(true);
    await createApartment({
      buildingId,
      floor: parseInt(form.floor),
      apartmentNo: parseInt(form.apartmentNo),
      totalSize: parseFloat(form.totalSize),
      mainSize: parseFloat(form.mainSize),
      openSpaceSize: parseFloat(form.openSpaceSize),
      bedroomCount: parseInt(form.bedroomCount),
      price: parseFloat(form.price),
      rooms: rooms.map((r) => ({ roomType: r.roomType, size: parseFloat(r.size) || 0 })),
    });
    setForm(EMPTY_FORM);
    setRooms([]);
    setLoading(false);
    load();
  }

  async function handleRemove(id: string) {
    if (!confirm('Delete this apartment?')) return;
    await removeApartment(id);
    load();
  }

  return (
    <div>
      <form onSubmit={handleAdd} className="mb-8 space-y-4">
        <div className="flex gap-3 flex-wrap items-end">
          <ProjectSelect projects={projects} value={selectedProject} onChange={setSelectedProject} />
          <FormField label="Building">
            <select value={buildingId} onChange={(e) => setBuildingId(e.target.value)} className={selectClass}>
              {buildings.map((b) => <option key={b.id} value={b.id}>Block {b.block}</option>)}
            </select>
          </FormField>
        </div>

        <div className="flex gap-3 flex-wrap">
          {([
            { key: 'floor', placeholder: 'Floor', width: 'w-24' },
            { key: 'apartmentNo', placeholder: 'Apt #', width: 'w-24' },
            { key: 'totalSize', placeholder: 'Total m²', width: 'w-28', step: '0.01' },
            { key: 'mainSize', placeholder: 'Main m²', width: 'w-28', step: '0.01' },
            { key: 'openSpaceSize', placeholder: 'Open m²', width: 'w-28', step: '0.01' },
            { key: 'bedroomCount', placeholder: 'Bedrooms', width: 'w-28', min: '0' },
            { key: 'price', placeholder: 'Price $', width: 'w-32', step: '0.01' },
          ] as Array<{ key: keyof typeof EMPTY_FORM; placeholder: string; width: string; step?: string; min?: string }>).map(({ key, placeholder, width, step, min }) => (
            <input
              key={key}
              value={form[key]}
              onChange={(e) => updateForm(key, e.target.value)}
              placeholder={placeholder}
              type="number"
              step={step}
              min={min}
              required
              className={`${inputClass} ${width}`}
            />
          ))}
        </div>

        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-seu-caption font-medium text-pale-gray/70 font-montserrat">Rooms</span>
            <button type="button" onClick={addRoom} className="text-primary-green text-seu-caption-sm hover:underline font-montserrat">+ Add room</button>
          </div>
          {rooms.map((room, idx) => (
            <div key={idx} className="flex gap-2 mb-2 items-center">
              <select value={room.roomType} onChange={(e) => updateRoom(idx, 'roomType', e.target.value)} className={selectClass}>
                {ROOM_TYPES.map((rt) => <option key={rt} value={rt}>{rt.replace('_', ' ')}</option>)}
              </select>
              <input value={room.size} onChange={(e) => updateRoom(idx, 'size', e.target.value)} placeholder="Size m²" type="number" step="0.01" className={`${inputClass} w-28`} />
              <button type="button" onClick={() => removeRoom(idx)} className={btnDanger}>Remove</button>
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading} className={btnPrimary}>Add Apartment</button>
      </form>

      <div className="overflow-x-auto rounded-lg border border-secondary-black">
        <table className="w-full text-seu-caption font-montserrat">
          <thead>
            <tr className="bg-secondary-black/40 text-left text-secondary-grey">
              <th className="p-3 font-medium">Building</th>
              <th className="p-3 font-medium">Floor</th>
              <th className="p-3 font-medium">Apt #</th>
              <th className="p-3 font-medium">Total m²</th>
              <th className="p-3 font-medium">Bedrooms</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0
              ? <EmptyRow colSpan={7} text="No apartments" />
              : items.map((a) => (
                <TableRow key={a.id}>
                  <td className="p-3 text-pale-gray">Block {a.building?.block}</td>
                  <td className="p-3 text-pale-gray">{a.floor}</td>
                  <td className="p-3 text-pale-gray">{a.apartmentNo}</td>
                  <td className="p-3 text-pale-gray/70">{a.totalSize}</td>
                  <td className="p-3 text-pale-gray/70">{a.bedroomCount}</td>
                  <td className="p-3 text-pale-gray">${a.price.toLocaleString()}</td>
                  <td className="p-3"><button onClick={() => handleRemove(a.id)} className={btnDanger}>Delete</button></td>
                </TableRow>
              ))}
          </tbody>
        </table>
      </div>

      <Paginator page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

// ---------- Contacts ----------

function ContactsTab() {
  const [items, setItems] = useState<Array<{ id: string; name: string; email: string; phone: string; createdAt: Date }>>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async () => {
    const res = await getContactRequests({ page, pageSize: 10 });
    setItems(res.items);
    setTotalPages(res.totalPages);
  }, [page]);

  useEffect(() => { load(); }, [load]);

  async function handleRemove(id: string) {
    if (!confirm('Delete this contact request?')) return;
    await removeContactRequest(id);
    load();
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-secondary-black">
        <table className="w-full text-seu-caption font-montserrat">
          <thead>
            <tr className="bg-secondary-black/40 text-left text-secondary-grey">
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Phone</th>
              <th className="p-3 font-medium">Received</th>
              <th className="p-3 font-medium w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0
              ? <EmptyRow colSpan={5} text="No contact requests" />
              : items.map((c) => (
                <TableRow key={c.id}>
                  <td className="p-3 text-pale-gray">{c.name}</td>
                  <td className="p-3 text-pale-gray/70">{c.email}</td>
                  <td className="p-3 text-pale-gray/70">{c.phone}</td>
                  <td className="p-3 text-pale-gray/50">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="p-3"><button onClick={() => handleRemove(c.id)} className={btnDanger}>Delete</button></td>
                </TableRow>
              ))}
          </tbody>
        </table>
      </div>

      <Paginator page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

// ---------- Main ----------

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('projects');

  return (
    <div className="min-h-screen bg-dark-green">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="font-[--font-bodoni] font-normal text-seu-heading-lg text-pale-gray mb-8">SEU Admin</h1>

        <div className="flex gap-1 mb-8 border-b border-secondary-black">
          {(['projects', 'buildings', 'apartments', 'contacts'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 font-montserrat font-medium text-seu-caption capitalize rounded-t-lg transition-colors ${
                tab === t
                  ? 'bg-secondary-black/60 text-pale-gray border border-secondary-black border-b-transparent -mb-px'
                  : 'text-secondary-grey hover:text-pale-gray/70'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="bg-secondary-black/30 border border-secondary-black rounded-lg p-6">
          {tab === 'projects' && <ProjectsTab />}
          {tab === 'buildings' && <BuildingsTab />}
          {tab === 'apartments' && <ApartmentsTab />}
          {tab === 'contacts' && <ContactsTab />}
        </div>
      </div>
    </div>
  );
}

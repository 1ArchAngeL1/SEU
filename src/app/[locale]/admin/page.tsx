'use client';

import { useState, useEffect, useCallback } from 'react';
import { addProject, getProjectsPaged, removeProject, getAllProjects } from '@/prisma/project';
import { addBuilding, getBuildingsPaged, removeBuilding, getAllBuildingsByProjectId } from '@/prisma/building';
import { addApartment, getApartmentsPaged, removeApartment } from '@/prisma/apartment';
import type { RoomType } from '@prisma/client';

type Tab = 'projects' | 'buildings' | 'apartments';

const inputClass = 'bg-secondary-black/40 border border-secondary-black text-pale-gray placeholder:text-secondary-grey/60 rounded-lg px-3 py-2 text-seu-caption focus:outline-none focus:border-pale-gray/40 transition-colors';
const selectClass = 'bg-secondary-black/40 border border-secondary-black text-pale-gray rounded-lg px-3 py-2 text-seu-caption focus:outline-none focus:border-pale-gray/40 transition-colors';
const btnPrimary = 'bg-primary-green text-white font-montserrat font-medium text-seu-caption px-6 py-2 rounded-lg hover:bg-primary-green/85 transition-colors disabled:opacity-50';
const btnDanger = 'text-red/80 hover:text-red text-seu-caption-sm transition-colors';
const btnPage = 'px-3 py-1.5 border border-secondary-black rounded-lg text-seu-caption-sm text-pale-gray disabled:opacity-30 hover:bg-secondary-black/40 transition-colors';
const labelClass = 'text-seu-caption-sm text-secondary-grey font-montserrat';

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
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Project name" required className={inputClass} />
        <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Address" className={inputClass} />
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
            {items.map(p => (
              <tr key={p.id} className="border-t border-secondary-black hover:bg-secondary-black/20 transition-colors">
                <td className="p-3 text-pale-gray">{p.name}</td>
                <td className="p-3 text-pale-gray/70">{p.address}</td>
                <td className="p-3 text-pale-gray/50">{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <button onClick={() => handleRemove(p.id)} className={btnDanger}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-secondary-grey/60">No projects</td></tr>}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex gap-3 mt-6 items-center justify-center">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className={btnPage}>Prev</button>
          <span className="text-seu-caption-sm text-secondary-grey">{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className={btnPage}>Next</button>
        </div>
      )}
    </div>
  );
}

// ---------- Buildings ----------

function BuildingsTab() {
  const [items, setItems] = useState<Array<{ id: string; block: string; floorCount: number; projectId: string; createdAt: Date; project: { name: string } }>>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [projects, setProjects] = useState<Array<{ id: string; name: string; address: string }>>([]);
  const [projectId, setProjectId] = useState('');
  const [block, setBlock] = useState('');
  const [floorCount, setFloorCount] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    const [res, projs] = await Promise.all([getBuildingsPaged(page, 10), getAllProjects()]);
    setItems(res.items as typeof items);
    setTotalPages(res.totalPages);
    setProjects(projs);
    if (!projectId && projs.length > 0) setProjectId(projs[0].id);
  }, [page, projectId]);

  useEffect(() => { load(); }, [load]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!projectId || !block.trim() || !floorCount) return;
    setLoading(true);
    await addBuilding({ projectId, block: block.trim(), floorCount: parseInt(floorCount) });
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
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Project</label>
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className={selectClass}>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <input value={block} onChange={e => setBlock(e.target.value)} placeholder="Block (e.g. A)" required className={inputClass} />
        <input value={floorCount} onChange={e => setFloorCount(e.target.value)} placeholder="Floor count" type="number" min="1" required className={`${inputClass} w-32`} />
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
            {items.map(b => (
              <tr key={b.id} className="border-t border-secondary-black hover:bg-secondary-black/20 transition-colors">
                <td className="p-3 text-pale-gray">{b.project.name}</td>
                <td className="p-3 text-pale-gray">{b.block}</td>
                <td className="p-3 text-pale-gray/70">{b.floorCount}</td>
                <td className="p-3 text-pale-gray/50">{new Date(b.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <button onClick={() => handleRemove(b.id)} className={btnDanger}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-secondary-grey/60">No buildings</td></tr>}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex gap-3 mt-6 items-center justify-center">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className={btnPage}>Prev</button>
          <span className="text-seu-caption-sm text-secondary-grey">{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className={btnPage}>Next</button>
        </div>
      )}
    </div>
  );
}

// ---------- Apartments ----------

const ROOM_TYPES: RoomType[] = ['BEDROOM', 'LIVING_ROOM', 'KITCHEN', 'BATHROOM', 'BALCONY', 'HALLWAY', 'STORAGE'];

function ApartmentsTab() {
  const [items, setItems] = useState<Array<{ id: string; floor: number; apartmentNo: number; totalSize: number; mainSize: number; openSpaceSize: number; bedroomCount: number; price: number; buildingId: string; createdAt: Date; building: { block: string; projectId: string } }>>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [projects, setProjects] = useState<Array<{ id: string; name: string; address: string }>>([]);
  const [buildings, setBuildings] = useState<Array<{ id: string; block: string }>>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [buildingId, setBuildingId] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    floor: '', apartmentNo: '', totalSize: '', mainSize: '', openSpaceSize: '', bedroomCount: '', price: '',
  });
  const [rooms, setRooms] = useState<Array<{ roomType: RoomType; size: string }>>([]);

  const load = useCallback(async () => {
    const [res, projs] = await Promise.all([getApartmentsPaged(page, 10), getAllProjects()]);
    setItems(res.items as typeof items);
    setTotalPages(res.totalPages);
    setProjects(projs);
    if (!selectedProject && projs.length > 0) setSelectedProject(projs[0].id);
  }, [page, selectedProject]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (selectedProject) {
      getAllBuildingsByProjectId(selectedProject).then(b => {
        setBuildings(b);
        if (b.length > 0) setBuildingId(b[0].id);
        else setBuildingId('');
      });
    }
  }, [selectedProject]);

  function updateForm(key: string, val: string) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  function addRoom() {
    setRooms(prev => [...prev, { roomType: 'BEDROOM', size: '' }]);
  }

  function removeRoom(idx: number) {
    setRooms(prev => prev.filter((_, i) => i !== idx));
  }

  function updateRoom(idx: number, key: 'roomType' | 'size', val: string) {
    setRooms(prev => prev.map((r, i) => i === idx ? { ...r, [key]: val } : r));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!buildingId) return;
    setLoading(true);
    await addApartment({
      buildingId,
      floor: parseInt(form.floor),
      apartmentNo: parseInt(form.apartmentNo),
      totalSize: parseFloat(form.totalSize),
      mainSize: parseFloat(form.mainSize),
      openSpaceSize: parseFloat(form.openSpaceSize),
      bedroomCount: parseInt(form.bedroomCount),
      price: parseFloat(form.price),
      rooms: rooms.map(r => ({ roomType: r.roomType, size: parseFloat(r.size) || 0 })),
    });
    setForm({ floor: '', apartmentNo: '', totalSize: '', mainSize: '', openSpaceSize: '', bedroomCount: '', price: '' });
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
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Project</label>
            <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className={selectClass}>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Building</label>
            <select value={buildingId} onChange={e => setBuildingId(e.target.value)} className={selectClass}>
              {buildings.map(b => <option key={b.id} value={b.id}>Block {b.block}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <input value={form.floor} onChange={e => updateForm('floor', e.target.value)} placeholder="Floor" type="number" required className={`${inputClass} w-24`} />
          <input value={form.apartmentNo} onChange={e => updateForm('apartmentNo', e.target.value)} placeholder="Apt #" type="number" required className={`${inputClass} w-24`} />
          <input value={form.totalSize} onChange={e => updateForm('totalSize', e.target.value)} placeholder="Total m\u00B2" type="number" step="0.01" required className={`${inputClass} w-28`} />
          <input value={form.mainSize} onChange={e => updateForm('mainSize', e.target.value)} placeholder="Main m\u00B2" type="number" step="0.01" required className={`${inputClass} w-28`} />
          <input value={form.openSpaceSize} onChange={e => updateForm('openSpaceSize', e.target.value)} placeholder="Open m\u00B2" type="number" step="0.01" required className={`${inputClass} w-28`} />
          <input value={form.bedroomCount} onChange={e => updateForm('bedroomCount', e.target.value)} placeholder="Bedrooms" type="number" min="0" required className={`${inputClass} w-28`} />
          <input value={form.price} onChange={e => updateForm('price', e.target.value)} placeholder="Price $" type="number" step="0.01" required className={`${inputClass} w-32`} />
        </div>

        {/* Rooms */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-seu-caption font-medium text-pale-gray/70 font-montserrat">Rooms</span>
            <button type="button" onClick={addRoom} className="text-primary-green text-seu-caption-sm hover:underline font-montserrat">+ Add room</button>
          </div>
          {rooms.map((room, idx) => (
            <div key={idx} className="flex gap-2 mb-2 items-center">
              <select value={room.roomType} onChange={e => updateRoom(idx, 'roomType', e.target.value)} className={selectClass}>
                {ROOM_TYPES.map(rt => <option key={rt} value={rt}>{rt.replace('_', ' ')}</option>)}
              </select>
              <input value={room.size} onChange={e => updateRoom(idx, 'size', e.target.value)} placeholder="Size m\u00B2" type="number" step="0.01" className={`${inputClass} w-28`} />
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
              <th className="p-3 font-medium">Total m\u00B2</th>
              <th className="p-3 font-medium">Bedrooms</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium">Created</th>
              <th className="p-3 font-medium w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(a => (
              <tr key={a.id} className="border-t border-secondary-black hover:bg-secondary-black/20 transition-colors">
                <td className="p-3 text-pale-gray">Block {a.building.block}</td>
                <td className="p-3 text-pale-gray">{a.floor}</td>
                <td className="p-3 text-pale-gray">{a.apartmentNo}</td>
                <td className="p-3 text-pale-gray/70">{a.totalSize}</td>
                <td className="p-3 text-pale-gray/70">{a.bedroomCount}</td>
                <td className="p-3 text-pale-gray">${a.price.toLocaleString()}</td>
                <td className="p-3 text-pale-gray/50">{new Date(a.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <button onClick={() => handleRemove(a.id)} className={btnDanger}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={8} className="p-6 text-center text-secondary-grey/60">No apartments</td></tr>}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex gap-3 mt-6 items-center justify-center">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className={btnPage}>Prev</button>
          <span className="text-seu-caption-sm text-secondary-grey">{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className={btnPage}>Next</button>
        </div>
      )}
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
          {(['projects', 'buildings', 'apartments'] as Tab[]).map(t => (
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
        </div>
      </div>
    </div>
  );
}

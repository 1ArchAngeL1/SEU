'use client';

import { useState, useEffect } from 'react';
import {
  addProject,
  getProjectsPaged,
  removeProject,
  getAllProjects,
} from '@/prisma/project';
import {
  createBuilding,
  getBuildingsPaged,
  removeBuilding,
  getAllBuildingsByProjectId,
} from '@/prisma/building';
import {
  createApartment,
  getAllApartmentsFiltered,
  removeApartment,
} from '@/prisma/apartment';
import { getContactRequests, removeContactRequest } from '@/prisma/contact';
import type { RoomType } from '@prisma/client';
import { ApartmentDTO } from '@/model/dto/apartment.dto';

type Tab = 'projects' | 'buildings' | 'apartments' | 'contacts';
type Project = { id: string; name: string; address: string };
type Building = { id: string; block: string };

const inputClass =
  'bg-secondary-black/40 border border-secondary-black text-pale-gray placeholder:text-secondary-grey/60 rounded-lg px-3 py-2 text-seu-caption focus:outline-none focus:border-pale-gray/40 transition-colors';
const selectClass =
  'bg-secondary-black/40 border border-secondary-black text-pale-gray rounded-lg px-3 py-2 text-seu-caption focus:outline-none focus:border-pale-gray/40 transition-colors';
const btnPrimary =
  'bg-primary-green text-white font-montserrat font-medium text-seu-caption px-6 py-2 rounded-lg hover:bg-primary-green/85 transition-colors disabled:opacity-50';
const btnDanger =
  'text-red/80 hover:text-red text-seu-caption-sm transition-colors';
const btnPage =
  'px-3 py-1.5 border border-secondary-black rounded-lg text-seu-caption-sm text-pale-gray disabled:opacity-30 hover:bg-secondary-black/40 transition-colors';
const labelClass = 'text-seu-caption-sm text-secondary-grey font-montserrat';

// ---------- Shared UI ----------

function Paginator({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex gap-3 mt-6 items-center justify-center">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className={btnPage}
      >
        Prev
      </button>
      <span className="text-seu-caption-sm text-secondary-grey">
        {page} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className={btnPage}
      >
        Next
      </button>
    </div>
  );
}

function EmptyRow({ colSpan, text }: { colSpan: number; text: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="p-6 text-center text-secondary-grey/60">
        {text}
      </td>
    </tr>
  );
}

function TableRow({ children }: { children: React.ReactNode }) {
  return (
    <tr className="border-t border-secondary-black hover:bg-secondary-black/20 transition-colors">
      {children}
    </tr>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

function ProjectSelect({
  projects,
  value,
  onChange,
}: {
  projects: Project[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <FormField label="Project">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={selectClass}
      >
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </FormField>
  );
}

// ---------- Projects ----------

function ProjectsTab() {
  const [page, setPage] = useState(1);
  const [rev, setRev] = useState(0);
  const [data, setData] = useState<{
    items: Array<{
      id: string;
      name: string;
      address: string;
      createdAt: Date;
    }>;
    totalPages: number;
  }>({ items: [], totalPages: 1 });
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProjectsPaged({ page, pageSize: 10 }).then((res) => {
      setData({ items: res.items, totalPages: res.totalPages });
    });
  }, [page, rev]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await addProject({ name: name.trim(), address: address.trim() });
    setName('');
    setAddress('');
    setLoading(false);
    setRev((r) => r + 1);
  }

  async function handleRemove(id: string) {
    if (!confirm('Delete this project?')) return;
    await removeProject(id);
    setRev((r) => r + 1);
  }

  return (
    <div>
      <form onSubmit={handleAdd} className="flex gap-3 mb-8 flex-wrap">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project name"
          required
          className={inputClass}
        />
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
          className={inputClass}
        />
        <button type="submit" disabled={loading} className={btnPrimary}>
          Add Project
        </button>
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
            {data.items.length === 0 ? (
              <EmptyRow colSpan={4} text="No projects" />
            ) : (
              data.items.map((p) => (
                <TableRow key={p.id}>
                  <td className="p-3 text-pale-gray">{p.name}</td>
                  <td className="p-3 text-pale-gray/70">{p.address}</td>
                  <td className="p-3 text-pale-gray/50">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleRemove(p.id)}
                      className={btnDanger}
                    >
                      Delete
                    </button>
                  </td>
                </TableRow>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Paginator
        page={page}
        totalPages={data.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

// ---------- Buildings ----------

function BuildingsTab() {
  const [page, setPage] = useState(1);
  const [rev, setRev] = useState(0);
  const [data, setData] = useState<{
    items: Array<{
      id: string;
      block: string;
      floorCount: number;
      projectId: string;
      createdAt: Date;
      project: { name: string };
    }>;
    totalPages: number;
  }>({ items: [], totalPages: 1 });
  const [projectState, setProjectState] = useState<{
    list: Project[];
    selected: string;
  }>({ list: [], selected: '' });
  const [block, setBlock] = useState('');
  const [floorCount, setFloorCount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllProjects().then((projs) => {
      setProjectState({ list: projs, selected: projs[0]?.id ?? '' });
    });
  }, []);

  useEffect(() => {
    getBuildingsPaged({ page, pageSize: 10 }).then((res) => {
      setData({
        items: res.items as typeof data.items,
        totalPages: res.totalPages,
      });
    });
  }, [page, rev]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!projectState.selected || !block.trim() || !floorCount) return;
    setLoading(true);
    await createBuilding({
      projectId: projectState.selected,
      block: block.trim(),
      floorCount: parseInt(floorCount),
    });
    setBlock('');
    setFloorCount('');
    setLoading(false);
    setRev((r) => r + 1);
  }

  async function handleRemove(id: string) {
    if (!confirm('Delete this building?')) return;
    await removeBuilding(id);
    setRev((r) => r + 1);
  }

  return (
    <div>
      <form
        onSubmit={handleAdd}
        className="flex gap-3 mb-8 flex-wrap items-end"
      >
        <ProjectSelect
          projects={projectState.list}
          value={projectState.selected}
          onChange={(id) =>
            setProjectState((prev) => ({ ...prev, selected: id }))
          }
        />
        <input
          value={block}
          onChange={(e) => setBlock(e.target.value)}
          placeholder="Block (e.g. A)"
          required
          className={inputClass}
        />
        <input
          value={floorCount}
          onChange={(e) => setFloorCount(e.target.value)}
          placeholder="Floor count"
          type="number"
          min="1"
          required
          className={`${inputClass} w-32`}
        />
        <button type="submit" disabled={loading} className={btnPrimary}>
          Add Building
        </button>
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
            {data.items.length === 0 ? (
              <EmptyRow colSpan={5} text="No buildings" />
            ) : (
              data.items.map((b) => (
                <TableRow key={b.id}>
                  <td className="p-3 text-pale-gray">{b.project.name}</td>
                  <td className="p-3 text-pale-gray">{b.block}</td>
                  <td className="p-3 text-pale-gray/70">{b.floorCount}</td>
                  <td className="p-3 text-pale-gray/50">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleRemove(b.id)}
                      className={btnDanger}
                    >
                      Delete
                    </button>
                  </td>
                </TableRow>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Paginator
        page={page}
        totalPages={data.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

// ---------- Apartments ----------

const ROOM_TYPES: RoomType[] = [
  'BEDROOM',
  'LIVING_ROOM',
  'KITCHEN',
  'BATHROOM',
  'BALCONY',
  'HALLWAY',
  'STORAGE',
];
const EMPTY_FORM = {
  floor: '',
  apartmentNo: '',
  totalSize: '',
  mainSize: '',
  openSpaceSize: '',
  bedroomCount: '',
  price: '',
};

function ApartmentsTab() {
  const [page, setPage] = useState(1);
  const [rev, setRev] = useState(0);
  const [data, setData] = useState<{
    items: ApartmentDTO[];
    totalPages: number;
  }>({ items: [], totalPages: 1 });
  const [projectState, setProjectState] = useState<{
    list: Project[];
    selected: string;
  }>({ list: [], selected: '' });
  const [buildingState, setBuildingState] = useState<{
    list: Building[];
    selected: string;
  }>({ list: [], selected: '' });
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [rooms, setRooms] = useState<
    Array<{ roomType: RoomType; size: string }>
  >([]);

  useEffect(() => {
    getAllProjects().then((projs) => {
      setProjectState({ list: projs, selected: projs[0]?.id ?? '' });
    });
  }, []);

  useEffect(() => {
    getAllApartmentsFiltered({}, { page, pageSize: 10 }).then((res) => {
      setData({
        items: res.items as ApartmentDTO[],
        totalPages: res.totalPages,
      });
    });
  }, [page, rev]);

  useEffect(() => {
    if (!projectState.selected) return;
    getAllBuildingsByProjectId(projectState.selected).then((b) => {
      setBuildingState({ list: b, selected: b[0]?.id ?? '' });
    });
  }, [projectState.selected]);

  function updateForm(key: keyof typeof EMPTY_FORM, val: string) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function addRoom() {
    setRooms((prev) => [...prev, { roomType: 'BEDROOM', size: '' }]);
  }
  function removeRoom(idx: number) {
    setRooms((prev) => prev.filter((_, i) => i !== idx));
  }
  function updateRoom(idx: number, key: 'roomType' | 'size', val: string) {
    setRooms((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, [key]: val } : r))
    );
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!buildingState.selected) return;
    setLoading(true);
    await createApartment({
      buildingId: buildingState.selected,
      floor: parseInt(form.floor),
      apartmentNo: parseInt(form.apartmentNo),
      totalSize: parseFloat(form.totalSize),
      mainSize: parseFloat(form.mainSize),
      openSpaceSize: parseFloat(form.openSpaceSize),
      bedroomCount: parseInt(form.bedroomCount),
      price: parseFloat(form.price),
      rooms: rooms.map((r) => ({
        roomType: r.roomType,
        size: parseFloat(r.size) || 0,
      })),
    });
    setForm(EMPTY_FORM);
    setRooms([]);
    setLoading(false);
    setRev((r) => r + 1);
  }

  async function handleRemove(id: string) {
    if (!confirm('Delete this apartment?')) return;
    await removeApartment(id);
    setRev((r) => r + 1);
  }

  return (
    <div>
      <form onSubmit={handleAdd} className="mb-8 space-y-4">
        <div className="flex gap-3 flex-wrap items-end">
          <ProjectSelect
            projects={projectState.list}
            value={projectState.selected}
            onChange={(id) =>
              setProjectState((prev) => ({ ...prev, selected: id }))
            }
          />
          <FormField label="Building">
            <select
              value={buildingState.selected}
              onChange={(e) =>
                setBuildingState((prev) => ({
                  ...prev,
                  selected: e.target.value,
                }))
              }
              className={selectClass}
            >
              {buildingState.list.map((b) => (
                <option key={b.id} value={b.id}>
                  Block {b.block}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="flex gap-3 flex-wrap">
          {(
            [
              { key: 'floor', placeholder: 'Floor', width: 'w-24' },
              { key: 'apartmentNo', placeholder: 'Apt #', width: 'w-24' },
              {
                key: 'totalSize',
                placeholder: 'Total m²',
                width: 'w-28',
                step: '0.01',
              },
              {
                key: 'mainSize',
                placeholder: 'Main m²',
                width: 'w-28',
                step: '0.01',
              },
              {
                key: 'openSpaceSize',
                placeholder: 'Open m²',
                width: 'w-28',
                step: '0.01',
              },
              {
                key: 'bedroomCount',
                placeholder: 'Bedrooms',
                width: 'w-28',
                min: '0',
              },
              {
                key: 'price',
                placeholder: 'Price $',
                width: 'w-32',
                step: '0.01',
              },
            ] as Array<{
              key: keyof typeof EMPTY_FORM;
              placeholder: string;
              width: string;
              step?: string;
              min?: string;
            }>
          ).map(({ key, placeholder, width, step, min }) => (
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
            <span className="text-seu-caption font-medium text-pale-gray/70 font-montserrat">
              Rooms
            </span>
            <button
              type="button"
              onClick={addRoom}
              className="text-primary-green text-seu-caption-sm hover:underline font-montserrat"
            >
              + Add room
            </button>
          </div>
          {rooms.map((room, idx) => (
            <div key={idx} className="flex gap-2 mb-2 items-center">
              <select
                value={room.roomType}
                onChange={(e) => updateRoom(idx, 'roomType', e.target.value)}
                className={selectClass}
              >
                {ROOM_TYPES.map((rt) => (
                  <option key={rt} value={rt}>
                    {rt.replace('_', ' ')}
                  </option>
                ))}
              </select>
              <input
                value={room.size}
                onChange={(e) => updateRoom(idx, 'size', e.target.value)}
                placeholder="Size m²"
                type="number"
                step="0.01"
                className={`${inputClass} w-28`}
              />
              <button
                type="button"
                onClick={() => removeRoom(idx)}
                className={btnDanger}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading} className={btnPrimary}>
          Add Apartment
        </button>
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
            {data.items.length === 0 ? (
              <EmptyRow colSpan={7} text="No apartments" />
            ) : (
              data.items.map((a) => (
                <TableRow key={a.id}>
                  <td className="p-3 text-pale-gray">
                    Block {a.building?.block}
                  </td>
                  <td className="p-3 text-pale-gray">{a.floor}</td>
                  <td className="p-3 text-pale-gray">{a.apartmentNo}</td>
                  <td className="p-3 text-pale-gray/70">{a.totalSize}</td>
                  <td className="p-3 text-pale-gray/70">{a.bedroomCount}</td>
                  <td className="p-3 text-pale-gray">
                    ${a.price.toLocaleString()}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleRemove(a.id)}
                      className={btnDanger}
                    >
                      Delete
                    </button>
                  </td>
                </TableRow>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Paginator
        page={page}
        totalPages={data.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

// ---------- Contacts ----------

function ContactsTab() {
  const [page, setPage] = useState(1);
  const [rev, setRev] = useState(0);
  const [data, setData] = useState<{
    items: Array<{
      id: string;
      name: string;
      email: string;
      phone: string;
      createdAt: Date;
    }>;
    totalPages: number;
  }>({ items: [], totalPages: 1 });

  useEffect(() => {
    getContactRequests({ page, pageSize: 10 }).then((res) => {
      setData({ items: res.items, totalPages: res.totalPages });
    });
  }, [page, rev]);

  async function handleRemove(id: string) {
    if (!confirm('Delete this contact request?')) return;
    await removeContactRequest(id);
    setRev((r) => r + 1);
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
            {data.items.length === 0 ? (
              <EmptyRow colSpan={5} text="No contact requests" />
            ) : (
              data.items.map((c) => (
                <TableRow key={c.id}>
                  <td className="p-3 text-pale-gray">{c.name}</td>
                  <td className="p-3 text-pale-gray/70">{c.email}</td>
                  <td className="p-3 text-pale-gray/70">{c.phone}</td>
                  <td className="p-3 text-pale-gray/50">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleRemove(c.id)}
                      className={btnDanger}
                    >
                      Delete
                    </button>
                  </td>
                </TableRow>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Paginator
        page={page}
        totalPages={data.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

// ---------- Main ----------

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('projects');

  return (
    <div className="min-h-screen bg-dark-green">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="font-[--font-bodoni] font-normal text-seu-heading-lg text-pale-gray mb-8">
          SEU Admin
        </h1>

        <div className="flex gap-1 mb-8 border-b border-secondary-black">
          {(['projects', 'buildings', 'apartments', 'contacts'] as Tab[]).map(
            (t) => (
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
            )
          )}
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

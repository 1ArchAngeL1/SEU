'use client';

import { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import {
  getAllApartmentsFiltered,
  updateApartment,
  removeApartment,
} from '@/prisma/apartment';
import { getAllProjects } from '@/prisma/project';
import { getAllBuildingsByProjectId } from '@/prisma/building';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import StatusBadge from '@/components/admin/StatusBadge';
import type { ApartmentDTO } from '@/model/dto/apartment.dto';
import type { ApartmentStatus } from '@prisma/client';

const btnPage =
  'px-3 py-1.5 border border-secondary-black rounded-lg text-seu-caption-sm text-pale-gray disabled:opacity-30 hover:bg-secondary-black/40 transition-colors';
const selectClass =
  'bg-secondary-black/40 border border-secondary-black text-pale-gray rounded-lg px-3 py-2 text-seu-caption focus:outline-none focus:border-pale-gray/40 transition-colors';

export default function ApartmentsPage() {
  const [page, setPage] = useState(1);
  const [rev, setRev] = useState(0);
  const [data, setData] = useState<{
    items: ApartmentDTO[];
    totalPages: number;
  }>({ items: [], totalPages: 1 });

  const [projects, setProjects] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [buildings, setBuildings] = useState<
    Array<{ id: string; block: string }>
  >([]);
  const [filterProject, setFilterProject] = useState('');
  const [filterBuilding, setFilterBuilding] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    getAllProjects().then(setProjects);
  }, []);

  useEffect(() => {
    if (!filterProject) {
      setBuildings([]);
      setFilterBuilding('');
      return;
    }
    getAllBuildingsByProjectId(filterProject).then((b) => {
      setBuildings(b);
      setFilterBuilding('');
    });
  }, [filterProject]);

  useEffect(() => {
    getAllApartmentsFiltered(
      {
        buildingId: filterBuilding || undefined,
        status: (filterStatus as ApartmentStatus) || undefined,
      },
      { page, pageSize: 10 }
    ).then((res) => {
      setData({ items: res.items as ApartmentDTO[], totalPages: res.totalPages });
    });
  }, [page, rev, filterBuilding, filterStatus]);

  async function handleStatusChange(id: string, status: ApartmentStatus) {
    await updateApartment(id, { status });
    setRev((r) => r + 1);
  }

  async function handleRemove(id: string) {
    if (!confirm('Delete this apartment?')) return;
    await removeApartment(id);
    setRev((r) => r + 1);
  }

  return (
    <div>
      <AdminPageHeader
        title="Apartments"
        description="View and manage all apartments across projects"
      />

      <div className="flex gap-3 mb-4 flex-wrap">
        <select
          value={filterProject}
          onChange={(e) => {
            setFilterProject(e.target.value);
            setPage(1);
          }}
          className={selectClass}
        >
          <option value="">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {buildings.length > 0 && (
          <select
            value={filterBuilding}
            onChange={(e) => {
              setFilterBuilding(e.target.value);
              setPage(1);
            }}
            className={selectClass}
          >
            <option value="">All Buildings</option>
            {buildings.map((b) => (
              <option key={b.id} value={b.id}>
                Block {b.block}
              </option>
            ))}
          </select>
        )}

        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
          className={selectClass}
        >
          <option value="">All Statuses</option>
          <option value="AVAILABLE">Available</option>
          <option value="RESERVED">Reserved</option>
          <option value="SOLD">Sold</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-secondary-black">
        <table className="w-full text-seu-caption font-montserrat">
          <thead>
            <tr className="bg-secondary-black/40 text-left text-secondary-grey">
              <th className="p-3 font-medium">Project</th>
              <th className="p-3 font-medium">Building</th>
              <th className="p-3 font-medium">Floor</th>
              <th className="p-3 font-medium">Apt #</th>
              <th className="p-3 font-medium">Area m²</th>
              <th className="p-3 font-medium">Bedrooms</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium">$/m²</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.items.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="p-6 text-center text-secondary-grey/60"
                >
                  No apartments found
                </td>
              </tr>
            ) : (
              data.items.map((a) => (
                <tr
                  key={a.id}
                  className="border-t border-secondary-black hover:bg-secondary-black/20 transition-colors"
                >
                  <td className="p-3 text-pale-gray">
                    {a.building?.project?.name}
                  </td>
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
                  <td className="p-3 text-pale-gray/70">
                    ${Math.round(a.price / a.totalSize).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRemove(a.id)}
                        className="text-red/60 hover:text-red transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data.totalPages > 1 && (
        <div className="flex gap-3 mt-6 items-center justify-center">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className={btnPage}
          >
            Prev
          </button>
          <span className="text-seu-caption-sm text-secondary-grey">
            {page} / {data.totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(data.totalPages, page + 1))}
            disabled={page === data.totalPages}
            className={btnPage}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

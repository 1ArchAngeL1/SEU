'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, Plus, Grid3X3, List } from 'lucide-react';
import type { ApartmentDTO } from '@/model/dto/apartment.dto';
import type { ApartmentStatus, RoomType } from '@prisma/client';
import {
  createApartment,
  updateApartment,
  removeApartment,
  getApartmentsByBuildingId,
} from '@/prisma/apartment';
import ChessBoard from './chess/ChessBoard';
import StoryView from './story/StoryView';
import ApartmentForm from './forms/ApartmentForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type ViewMode = 'chess' | 'story';

interface BuildingDetailClientProps {
  building: {
    id: string;
    block: string;
    floorCount: number;
    project: { id: string; name: string };
  };
  initialApartments: ApartmentDTO[];
}

export default function BuildingDetailClient({
  building,
  initialApartments,
}: BuildingDetailClientProps) {
  const [view, setView] = useState<ViewMode>('chess');
  const [apartments, setApartments] =
    useState<ApartmentDTO[]>(initialApartments);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingApt, setEditingApt] = useState<ApartmentDTO | null>(null);
  const [prefill, setPrefill] = useState<{
    floor?: number;
    position?: number;
  }>({});

  const refresh = useCallback(async () => {
    const data = await getApartmentsByBuildingId(building.id);
    setApartments(data);
  }, [building.id]);

  function handleCellClick(apt: ApartmentDTO) {
    setEditingApt(apt);
    setPrefill({});
    setDialogOpen(true);
  }

  function handleEmptyCellClick(floor: number, position: number) {
    setEditingApt(null);
    setPrefill({ floor, position });
    setDialogOpen(true);
  }

  function handleAddClick() {
    setEditingApt(null);
    setPrefill({});
    setDialogOpen(true);
  }

  async function handleSubmit(data: {
    buildingId: string;
    floor: number;
    apartmentNo: number;
    position: number;
    totalSize: number;
    mainSize: number;
    openSpaceSize: number;
    bedroomCount: number;
    price: number;
    status: ApartmentStatus;
    rooms: Array<{ roomType: RoomType; size: number }>;
  }) {
    if (editingApt) {
      const { buildingId, ...updateData } = data;
      await updateApartment(editingApt.id, updateData);
    } else {
      await createApartment(data);
    }
    setDialogOpen(false);
    setEditingApt(null);
    await refresh();
  }

  async function handleDelete() {
    if (!editingApt) return;
    if (!confirm('Delete this apartment?')) return;
    await removeApartment(editingApt.id);
    setDialogOpen(false);
    setEditingApt(null);
    await refresh();
  }

  // Stats
  const total = apartments.length;
  const available = apartments.filter(
    (a) => a.status === 'AVAILABLE'
  ).length;
  const reserved = apartments.filter(
    (a) => a.status === 'RESERVED'
  ).length;
  const sold = apartments.filter((a) => a.status === 'SOLD').length;
  const avgPricePerM2 =
    total > 0
      ? Math.round(
          apartments.reduce((sum, a) => sum + a.price / a.totalSize, 0) /
            total
        )
      : 0;

  const btnToggle = (active: boolean) =>
    cn(
      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-montserrat font-medium text-seu-caption-sm transition-colors',
      active
        ? 'bg-secondary-black/60 text-pale-gray'
        : 'text-secondary-grey hover:text-pale-gray/70'
    );

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 font-montserrat text-seu-caption-sm">
        <Link
          href="/admin/buildings"
          className="text-secondary-grey hover:text-pale-gray transition-colors flex items-center gap-1"
        >
          <ChevronLeft className="size-3.5" />
          Buildings
        </Link>
        <span className="text-secondary-grey/40">/</span>
        <span className="text-pale-gray/70">{building.project.name}</span>
        <span className="text-secondary-grey/40">/</span>
        <span className="text-pale-gray">Block {building.block}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-[--font-bodoni] font-normal text-seu-heading text-pale-gray">
            Block {building.block}
          </h1>
          <p className="text-seu-caption text-secondary-grey font-montserrat mt-1">
            {building.project.name} &middot; {building.floorCount} floors
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="bg-primary-green text-white font-montserrat font-medium text-seu-caption px-4 py-2 rounded-lg hover:bg-primary-green/85 transition-colors flex items-center gap-2"
        >
          <Plus className="size-4" />
          Add Apartment
        </button>
      </div>

      {/* Stats bar */}
      <div className="flex gap-6 mb-6 font-montserrat text-seu-caption-sm">
        <div>
          <span className="text-secondary-grey">Total: </span>
          <span className="text-pale-gray font-medium">{total}</span>
        </div>
        <div>
          <span className="text-secondary-grey">Available: </span>
          <span className="text-[#4ade80] font-medium">{available}</span>
        </div>
        <div>
          <span className="text-secondary-grey">Reserved: </span>
          <span className="text-[#c9a962] font-medium">{reserved}</span>
        </div>
        <div>
          <span className="text-secondary-grey">Sold: </span>
          <span className="text-red font-medium">{sold}</span>
        </div>
        <div>
          <span className="text-secondary-grey">Avg $/m²: </span>
          <span className="text-pale-gray font-medium">
            ${avgPricePerM2.toLocaleString()}
          </span>
        </div>
      </div>

      {/* View toggle */}
      <div className="flex gap-1 mb-6 p-1 bg-secondary-black/20 rounded-lg w-fit">
        <button
          onClick={() => setView('chess')}
          className={btnToggle(view === 'chess')}
        >
          <Grid3X3 className="size-3.5" />
          Chess
        </button>
        <button
          onClick={() => setView('story')}
          className={btnToggle(view === 'story')}
        >
          <List className="size-3.5" />
          Story
        </button>
      </div>

      {/* View */}
      {view === 'chess' ? (
        <ChessBoard
          apartments={apartments}
          floorCount={building.floorCount}
          onCellClick={handleCellClick}
          onEmptyCellClick={handleEmptyCellClick}
        />
      ) : (
        <StoryView
          apartments={apartments}
          floorCount={building.floorCount}
          onApartmentClick={handleCellClick}
        />
      )}

      {/* Edit/Create dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-dark-green border-secondary-black max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-pale-gray font-[--font-bodoni]">
              {editingApt
                ? `Edit Apartment #${editingApt.apartmentNo}`
                : 'New Apartment'}
            </DialogTitle>
          </DialogHeader>
          <ApartmentForm
            buildingId={building.id}
            initialData={
              editingApt
                ? {
                    floor: editingApt.floor,
                    apartmentNo: editingApt.apartmentNo,
                    position: editingApt.position,
                    totalSize: editingApt.totalSize,
                    mainSize: editingApt.mainSize,
                    openSpaceSize: editingApt.openSpaceSize,
                    bedroomCount: editingApt.bedroomCount,
                    price: editingApt.price,
                    status: editingApt.status,
                    rooms: editingApt.rooms,
                  }
                : {
                    floor: prefill.floor,
                    position: prefill.position,
                  }
            }
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
            submitLabel={editingApt ? 'Update' : 'Create'}
          />
          {editingApt && (
            <button
              onClick={handleDelete}
              className="text-red/70 hover:text-red text-seu-caption-sm font-montserrat transition-colors mt-2"
            >
              Delete this apartment
            </button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

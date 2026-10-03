import { ArrowRight, Plus } from 'lucide-react'
import type { ReactNode } from 'react'
import { pointsLabel } from './editor-summary'

export const INCOMPLETE_MESSAGE = 'Elegí un piloto para cada posición antes de guardar.'

type Props = {
  readonly classified: number
  readonly eligible: number
  readonly total: number
  readonly canSave: boolean
  readonly isSaving: boolean
  readonly showIncomplete: boolean
  readonly onCancel: () => void
}

const BOX = 'border-2 border-primary bg-surface-container px-3 py-2 font-headline uppercase'

export const AddDriverButton = ({
  disabled,
  onAdd,
}: {
  readonly disabled: boolean
  readonly onAdd: () => void
}): ReactNode => (
  <button
    type="button"
    disabled={disabled}
    onClick={onAdd}
    className="flex w-full items-center justify-center gap-2 border-2 border-primary bg-surface-container-lowest px-6 py-3 font-bold font-headline text-primary text-xs uppercase tracking-wider shadow-[4px_4px_0px_0px_#1a1a1a] hover:bg-primary hover:text-on-primary active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-40 sm:w-auto"
  >
    <Plus className="size-4" aria-hidden />
    <span>Agregar piloto a la clasificación</span>
  </button>
)

export const EditorActions = (props: Props): ReactNode => (
  <section className="sticky bottom-4 z-40 flex flex-col items-stretch justify-between gap-6 border-2 border-primary bg-surface-container-lowest p-4 shadow-[6px_6px_0px_0px_#1a1a1a] sm:p-6 xl:flex-row xl:items-center">
    <div className="flex flex-wrap items-center gap-4">
      <div className={BOX}>
        <div className="font-bold text-[10px] text-on-surface-variant">Pilotos clasificados</div>
        <div className="font-bold text-base text-primary">
          {props.classified} de {props.eligible} inscriptos
        </div>
      </div>
      <div className={BOX}>
        <div className="font-bold text-[10px] text-on-surface-variant">Total asignado</div>
        <div className="font-bold text-base text-primary">{pointsLabel(props.total)}</div>
      </div>
      {props.showIncomplete ? (
        <p className="font-bold font-headline text-secondary text-xs uppercase">
          {INCOMPLETE_MESSAGE}
        </p>
      ) : null}
    </div>
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={props.onCancel}
        className="border-2 border-primary bg-surface-container-lowest px-5 py-3 font-bold font-headline text-primary text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px_#1a1a1a] hover:bg-secondary hover:text-on-primary active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
      >
        Cancelar cambios
      </button>
      <button
        type="submit"
        disabled={!props.canSave || props.isSaving}
        className="flex items-center justify-center gap-2 border-2 border-primary bg-primary-container px-7 py-3 font-black font-headline text-on-primary-container text-sm uppercase tracking-widest shadow-[4px_4px_0px_0px_#1a1a1a] hover:bg-primary hover:text-on-primary active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50"
      >
        <span>{props.isSaving ? 'Guardando...' : 'Guardar resultado'}</span>
        <ArrowRight className="size-[18px]" aria-hidden />
      </button>
    </div>
  </section>
)

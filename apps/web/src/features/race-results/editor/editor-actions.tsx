import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

export const INCOMPLETE_MESSAGE = 'Elegí un piloto para cada posición antes de guardar.'

type Props = {
  readonly canAdd: boolean
  readonly canSave: boolean
  readonly isSaving: boolean
  readonly showIncomplete: boolean
  readonly onAdd: () => void
}

export const EditorActions = (props: Props): ReactNode => (
  <div className="flex flex-col gap-2">
    {props.showIncomplete ? <p className="text-sm text-destructive">{INCOMPLETE_MESSAGE}</p> : null}
    <div className="flex gap-2">
      <Button type="button" variant="outline" disabled={!props.canAdd} onClick={props.onAdd}>
        Agregar piloto
      </Button>
      <Button type="submit" disabled={!props.canSave || props.isSaving}>
        {props.isSaving ? 'Guardando...' : 'Guardar resultado'}
      </Button>
    </div>
  </div>
)

import { ChevronDown } from 'lucide-react'
import { useMemo, useState } from 'react'

export type MultiSelectOption = {
  value: string
  label: string
  hint?: string
  group?: string
}

export function MultiSelect({
  label,
  options,
  values,
  onChange,
  error,
  empty = 'Aucune option disponible.',
}: {
  label: string
  options: MultiSelectOption[]
  values: string[]
  onChange: (next: string[]) => void
  error?: string
  empty?: string
}) {
  const [open, setOpen] = useState(false);
  const groups = useMemo(() => {
    const map = new Map<string, MultiSelectOption[]>();
    for (const option of options) {
      const key = option.group ?? '';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(option);
    }
    return [...map.entries()];
  }, [options]);
  const selectedCount = values.length;
  const toggle = (value: string) => {
    onChange(
      values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value],
    );
  };
  const toggleGroup = (groupOptions: MultiSelectOption[]) => {
    const groupValues = groupOptions.map((option) => option.value);
    const allSelected = groupValues.every((value) => values.includes(value));
    if (allSelected) {
      onChange(values.filter((value) => !groupValues.includes(value)));
    } else {
      onChange([
        ...values,
        ...groupValues.filter((value) => !values.includes(value)),
      ]);
    }
  };
  const isGroupSelected = (groupOptions: MultiSelectOption[]) =>
    groupOptions.length > 0 &&
    groupOptions.every((option) => values.includes(option.value));
  return (
    <div className="multi-select">
      <span className="multi-select-label">{label}</span>
      <button
        type="button"
        className={`multi-select-trigger ${open ? 'multi-select-trigger--open' : ''}`}
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        <span className="multi-select-summary">
          {selectedCount === 0
            ? 'Aucune sélection'
            : `${selectedCount} sélectionné${selectedCount > 1 ? 's' : ''}`}
        </span>
        <ChevronDown size={15} />
      </button>
      {error && <small className="field-error">{error}</small>}
      {open && (
        <>
          <div className="multi-select-backdrop" onClick={() => setOpen(false)} />
          <div className="multi-select-panel">
            {options.length === 0 && (
              <div className="multi-select-empty">{empty}</div>
            )}
            {groups.map(([group, groupOptions]) => (
              <div className="multi-group" key={group || 'default'}>
                {group && (
                  <div className="multi-group-head">
                    <label className="multi-option">
                      <input
                        type="checkbox"
                        className="multi-option-checkbox"
                        checked={isGroupSelected(groupOptions)}
                        onChange={() => toggleGroup(groupOptions)}
                      />
                      <b className="multi-group-title">{group}</b>
                    </label>
                    <small>
                      {
                        groupOptions.filter((option) =>
                          values.includes(option.value),
                        ).length
                      }
                      /{groupOptions.length}
                    </small>
                  </div>
                )}
                <div className="multi-options">
                  {groupOptions.map((option) => (
                    <label className="multi-option" key={option.value}>
                      <input
                        type="checkbox"
                        className="multi-option-checkbox"
                        checked={values.includes(option.value)}
                        onChange={() => toggle(option.value)}
                      />
                      <span className="multi-option-copy">
                        <b>{option.label}</b>
                        {option.hint && <small>{option.hint}</small>}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
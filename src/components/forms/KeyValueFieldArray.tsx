import { useFieldArray, type Control, type FieldErrors, type FieldValues, type Path, type UseFormRegister } from 'react-hook-form';
import { Button } from '../common/Button';

type KeyValueFieldArrayProps<TFormValues extends FieldValues> = {
  control: Control<TFormValues>;
  errors?: FieldErrors<TFormValues>;
  name: Path<TFormValues>;
  label: string;
  register: UseFormRegister<TFormValues>;
};

export const KeyValueFieldArray = <TFormValues extends FieldValues>({
  control,
  errors,
  name,
  label,
  register,
}: KeyValueFieldArrayProps<TFormValues>) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as never,
  });

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <label className="field-label mb-0">{label}</label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => append({ id: crypto.randomUUID(), key: '', value: '' } as never)}
        >
          Add row
        </Button>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-2">
            <input className="control-input" placeholder="Key" {...register(`${name}.${index}.key` as Path<TFormValues>)} />
            <input className="control-input" placeholder="Value" {...register(`${name}.${index}.value` as Path<TFormValues>)} />
            <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
              Remove
            </Button>
          </div>
        ))}
      </div>

      {errors?.[name] ? (
        <p className="mt-2 text-xs text-rose-500">Complete both fields for every partially filled row.</p>
      ) : null}
    </div>
  );
};

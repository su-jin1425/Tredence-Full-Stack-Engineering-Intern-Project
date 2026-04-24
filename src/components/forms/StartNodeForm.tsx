import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { StartNodeData } from '../../types/workflow';
import { startNodeSchema } from '../../types/workflow';
import { Button } from '../common/Button';
import { KeyValueFieldArray } from './KeyValueFieldArray';

type StartNodeFormProps = {
  data: StartNodeData;
  onSave: (data: StartNodeData) => void;
};

export const StartNodeForm = ({ data, onSave }: StartNodeFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<StartNodeData>({
    resolver: zodResolver(startNodeSchema),
    defaultValues: data,
  });

  useEffect(() => {
    reset(data);
  }, [data, reset]);

  return (
    <form className="space-y-5" onSubmit={handleSubmit((values) => onSave({ ...values, kind: 'start' }))}>
      <div>
        <label className="field-label">Title</label>
        <input className="control-input" placeholder="Workflow start title" {...register('title')} />
        {errors.title ? <p className="mt-2 text-xs text-rose-500">{errors.title.message}</p> : null}
      </div>

      <KeyValueFieldArray control={control} errors={errors} name="metadata" label="Metadata" register={register} />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        Save Start Node
      </Button>
    </form>
  );
};

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { EndNodeData } from '../../types/workflow';
import { endNodeSchema } from '../../types/workflow';
import { Button } from '../common/Button';

type EndNodeFormProps = {
  data: EndNodeData;
  onSave: (data: EndNodeData) => void;
};

export const EndNodeForm = ({ data, onSave }: EndNodeFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EndNodeData>({
    resolver: zodResolver(endNodeSchema),
    defaultValues: data,
  });

  useEffect(() => {
    reset(data);
  }, [data, reset]);

  return (
    <form className="space-y-5" onSubmit={handleSubmit((values) => onSave({ ...values, kind: 'end' }))}>
      <div>
        <label className="field-label">End Message</label>
        <textarea className="control-input min-h-28" placeholder="Workflow completion message" {...register('endMessage')} />
        {errors.endMessage ? <p className="mt-2 text-xs text-rose-500">{errors.endMessage.message}</p> : null}
      </div>

      <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900/70">
        <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-500" {...register('summary')} />
        Include summary in completion state
      </label>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        Save End Node
      </Button>
    </form>
  );
};

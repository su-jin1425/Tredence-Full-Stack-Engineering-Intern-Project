import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { TaskNodeData } from '../../types/workflow';
import { taskNodeSchema } from '../../types/workflow';
import { Button } from '../common/Button';
import { KeyValueFieldArray } from './KeyValueFieldArray';

type TaskNodeFormProps = {
  data: TaskNodeData;
  onSave: (data: TaskNodeData) => void;
};

export const TaskNodeForm = ({ data, onSave }: TaskNodeFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TaskNodeData>({
    resolver: zodResolver(taskNodeSchema),
    defaultValues: data,
  });

  useEffect(() => {
    reset(data);
  }, [data, reset]);

  return (
    <form className="space-y-5" onSubmit={handleSubmit((values) => onSave({ ...values, kind: 'task' }))}>
      <div>
        <label className="field-label">Title</label>
        <input className="control-input" placeholder="Task title" {...register('title')} />
        {errors.title ? <p className="mt-2 text-xs text-rose-500">{errors.title.message}</p> : null}
      </div>

      <div>
        <label className="field-label">Description</label>
        <textarea className="control-input min-h-28" placeholder="Describe the work to complete" {...register('description')} />
        {errors.description ? <p className="mt-2 text-xs text-rose-500">{errors.description.message}</p> : null}
      </div>

      <div>
        <label className="field-label">Assignee</label>
        <input className="control-input" placeholder="HR Coordinator" {...register('assignee')} />
        {errors.assignee ? <p className="mt-2 text-xs text-rose-500">{errors.assignee.message}</p> : null}
      </div>

      <div>
        <label className="field-label">Due Date</label>
        <input className="control-input" type="date" {...register('dueDate')} />
        {errors.dueDate ? <p className="mt-2 text-xs text-rose-500">{errors.dueDate.message}</p> : null}
      </div>

      <KeyValueFieldArray control={control} errors={errors} name="customFields" label="Custom Fields" register={register} />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        Save Task Node
      </Button>
    </form>
  );
};

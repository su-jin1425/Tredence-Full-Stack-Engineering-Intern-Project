import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { AutomatedNodeData, AutomationAction } from '../../types/workflow';
import { automatedNodeSchema } from '../../types/workflow';
import { Button } from '../common/Button';

type AutomatedNodeFormProps = {
  data: AutomatedNodeData;
  actions: AutomationAction[];
  onSave: (data: AutomatedNodeData) => void;
};

export const AutomatedNodeForm = ({ data, actions, onSave }: AutomatedNodeFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AutomatedNodeData>({
    resolver: zodResolver(automatedNodeSchema),
    defaultValues: data,
  });

  const actionId = watch('actionId');
  const selectedAction = useMemo(() => actions.find((action) => action.id === actionId), [actionId, actions]);

  useEffect(() => {
    reset(data);
  }, [data, reset]);

  useEffect(() => {
    if (!selectedAction) {
      return;
    }

    const currentParams = getValues('params') ?? {};
    setValue('actionLabel', selectedAction.label);
    setValue(
      'params',
      selectedAction.params.reduce<Record<string, string>>((accumulator, param) => {
        accumulator[param] = currentParams[param] ?? '';
        return accumulator;
      }, {}),
      { shouldValidate: true },
    );
  }, [getValues, selectedAction, setValue]);

  return (
    <form className="space-y-5" onSubmit={handleSubmit((values) => onSave({ ...values, kind: 'automated' }))}>
      <div>
        <label className="field-label">Title</label>
        <input className="control-input" placeholder="Automated step title" {...register('title')} />
        {errors.title ? <p className="mt-2 text-xs text-rose-500">{errors.title.message}</p> : null}
      </div>

      <div>
        <label className="field-label">Action</label>
        <select className="control-input" {...register('actionId')}>
          <option value="">Select automation action</option>
          {actions.map((action) => (
            <option key={action.id} value={action.id}>
              {action.label}
            </option>
          ))}
        </select>
        {errors.actionId ? <p className="mt-2 text-xs text-rose-500">{errors.actionId.message}</p> : null}
      </div>

      {selectedAction ? (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/80">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Dynamic parameters</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">These fields come from the selected automation action.</p>
          </div>

          {selectedAction.params.map((param) => (
            <div key={param}>
              <label className="field-label">{param}</label>
              <input className="control-input" placeholder={`Enter ${param}`} {...register(`params.${param}`)} />
            </div>
          ))}
        </div>
      ) : null}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        Save Automated Node
      </Button>
    </form>
  );
};

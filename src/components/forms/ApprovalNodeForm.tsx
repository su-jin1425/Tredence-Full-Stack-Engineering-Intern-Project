import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { ApprovalNodeData } from '../../types/workflow';
import { approvalNodeSchema } from '../../types/workflow';
import { Button } from '../common/Button';

type ApprovalNodeFormProps = {
  data: ApprovalNodeData;
  onSave: (data: ApprovalNodeData) => void;
};

export const ApprovalNodeForm = ({ data, onSave }: ApprovalNodeFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ApprovalNodeData>({
    resolver: zodResolver(approvalNodeSchema),
    defaultValues: data,
  });

  useEffect(() => {
    reset(data);
  }, [data, reset]);

  return (
    <form className="space-y-5" onSubmit={handleSubmit((values) => onSave({ ...values, kind: 'approval' }))}>
      <div>
        <label className="field-label">Title</label>
        <input className="control-input" placeholder="Approval title" {...register('title')} />
        {errors.title ? <p className="mt-2 text-xs text-rose-500">{errors.title.message}</p> : null}
      </div>

      <div>
        <label className="field-label">Approver Role</label>
        <input className="control-input" placeholder="Hiring Manager" {...register('approverRole')} />
        {errors.approverRole ? <p className="mt-2 text-xs text-rose-500">{errors.approverRole.message}</p> : null}
      </div>

      <div>
        <label className="field-label">Threshold</label>
        <input className="control-input" type="number" min={1} max={100} {...register('threshold', { valueAsNumber: true })} />
        {errors.threshold ? <p className="mt-2 text-xs text-rose-500">{errors.threshold.message}</p> : null}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        Save Approval Node
      </Button>
    </form>
  );
};

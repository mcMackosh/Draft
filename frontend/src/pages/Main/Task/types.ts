import { Dayjs } from 'dayjs';
import { TaskUpdateDto, TaskCreateDto } from '../../../type/task';
import { ApiErrorResponse } from '../../../type/global';
import { UserRole } from '../../../type/auth_role';

export interface FormValues {
  name: string;
  description: string;
  priority: string;
  tagId?: number;
  status: string;
  executorId?: number;
  startExecutionAt: Dayjs | null;
  endExecutionAt: Dayjs | null;
}

export interface CreateUpdateTaskModalProps {
  open: boolean;
  onClose: () => void;
  taskId?: number;
  projectId: number;
}

export type PrepareTaskDtoFn = (values: FormValues) => Omit<TaskUpdateDto, 'id'>;

export type ShouldDisableFieldFn = (fieldName: keyof FormValues) => boolean;
export type ShouldHideButtonFn = (buttonType: 'delete' | 'submit' | 'cancel') => boolean;

export interface TaskFormHandlers {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (e: { target: { name: any; value: any } }) => void;
  handleDateChange: (name: keyof FormValues) => (date: Dayjs | null) => void;
  handleSubmit: () => Promise<void>;
  handleDelete: () => Promise<void>;
  shouldDisableField: ShouldDisableFieldFn;
  shouldHideButton: ShouldHideButtonFn;
}

export const initialValues: FormValues = {
  name: '',
  description: '',
  priority: 'MEDIUM',
  status: 'New',
  startExecutionAt: null,
  endExecutionAt: null,
};

export const statusOptions = [
  'New', 'In Progress', 'Pending Review', 'Completed', 'Blocked',
  'On Hold', 'Testing', 'Ready for Deployment'
];

export const priorityOptions = ['LOW', 'MEDIUM', 'HIGH'];
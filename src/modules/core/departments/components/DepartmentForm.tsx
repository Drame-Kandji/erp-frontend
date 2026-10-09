import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Save } from 'lucide-react'
import type { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { Organization } from '../../organizations/domain/organization'
import type { Department, DepartmentPayload } from '../domain/department'

const departmentSchema = z.object({
  organization: z.string().uuid('Sélectionnez une organisation valide.'),
  name: z.string().trim().min(1, 'Le nom est obligatoire.'),
  code: z
    .string()
    .trim()
    .min(1, 'Le code est obligatoire.')
    .max(50, 'Le code ne peut pas dépasser 50 caractères.'),
  description: z.string(),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;
type ApiValidationErrors = Record<string, string[] | string>;

export function DepartmentForm({
  organizations,
  initialDepartment,
  isSubmitting,
  submitError,
  onSubmit,
  onCancel,
}: {
  organizations: Organization[];
  initialDepartment?: Department;
  isSubmitting: boolean;
  submitError: unknown;
  onSubmit: (payload: DepartmentPayload) => Promise<void>;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      organization: initialDepartment?.organization ?? organizations[0]?.id ?? "",
      name: initialDepartment?.name ?? "",
      code: initialDepartment?.code ?? "",
      description: initialDepartment?.description ?? "",
    },
  });
  const showSubmitError =
    Boolean(submitError) && !(submitError as { response?: unknown }).response;
  const submit = async (values: DepartmentFormValues) => {
    try {
      await onSubmit(values);
    } catch (error) {
      const response = (error as { response?: { data?: ApiValidationErrors } })
        .response?.data;
      if (response)
        Object.entries(response).forEach(([field, value]) => {
          const message = Array.isArray(value) ? value[0] : value;
          if (field in values)
            setError(field as keyof DepartmentFormValues, { message });
        });
    }
  };
  return (
    <form className="organization-form" onSubmit={handleSubmit(submit)}>
      <div className="form-toolbar">
        <button type="button" className="secondary-button" onClick={onCancel}>
          <ArrowLeft size={16} />
          Retour
        </button>
        <button type="submit" className="primary-button" disabled={isSubmitting}>
          <Save size={16} />
          {isSubmitting ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
      {showSubmitError && (
        <p className="form-error">
          Impossible d’enregistrer le département. Vérifiez les champs puis
          réessayez.
        </p>
      )}
      <div className="form-grid">
        <section className="panel form-section">
          <div className="form-section-heading">
            <span className="eyebrow">IDENTITÉ</span>
            <h2>Informations générales</h2>
          </div>
          <FormField label="Organisation" error={errors.organization?.message}>
            <select {...register("organization")}>
              <option value="">Sélectionnez une organisation</option>
              {organizations.map((organization) => (
                <option value={organization.id} key={organization.id}>
                  {organization.name} · {organization.code}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Nom du département" error={errors.name?.message}>
            <input {...register("name")} placeholder="Ex. Ressources humaines" />
          </FormField>
          <FormField label="Code" error={errors.code?.message}>
            <input {...register("code")} placeholder="Ex. RH" />
          </FormField>
        </section>
        <section className="panel form-section">
          <div className="form-section-heading">
            <span className="eyebrow">DESCRIPTION</span>
            <h2>Périmètre du département</h2>
          </div>
          <FormField label="Description" error={errors.description?.message}>
            <textarea
              {...register('description')}
              rows={6}
              placeholder="Décrivez le rôle et le périmètre du département"
            />
          </FormField>
          <div className="form-note">
            Le département est rattaché à une organisation ; son code est unique
            au sein de cette organisation.
          </div>
        </section>
      </div>
    </form>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="form-field">
      <span>{label}</span>
      {children}
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Save } from 'lucide-react'
import type { ReactNode } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import type { Organization } from '../../../core/organizations/domain/organization'
import type { User } from '../../users/domain/user'
import type { Role, RolePayload } from '../domain/role'
import { useAllPermissionsQuery } from '../hooks/usePermissionsQuery'
import { useUsersLookupQuery } from '../../users/hooks/useUsersQuery'
import { MultiSelect } from '../../../../shared/components/MultiSelect'

const roleSchema = z.object({
  organization: z.string().uuid('Sélectionnez une organisation valide.'),
  name: z
    .string()
    .trim()
    .min(1, 'Le nom est obligatoire.')
    .max(150, 'Le nom ne peut pas dépasser 150 caractères.'),
  code: z
    .string()
    .trim()
    .min(1, 'Le code est obligatoire.')
    .max(50, 'Le code ne peut pas dépasser 50 caractères.'),
  description: z.string(),
  permissions: z.array(z.string()),
  users: z.array(z.string().uuid('Utilisateur invalide.')),
});

type RoleFormValues = z.infer<typeof roleSchema>;
type ApiValidationErrors = Record<string, string[] | string>;

export function RoleForm({
  organizations,
  initialRole,
  isSubmitting,
  submitError,
  onSubmit,
  onCancel,
}: {
  organizations: Organization[];
  initialRole?: Role;
  isSubmitting: boolean;
  submitError: unknown;
  onSubmit: (payload: RolePayload) => Promise<void>;
  onCancel: () => void;
}) {
  const permissionsQuery = useAllPermissionsQuery();
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    control,
    formState: { errors },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      organization: initialRole?.organization ?? organizations[0]?.id ?? '',
      name: initialRole?.name ?? '',
      code: initialRole?.code ?? '',
      description: initialRole?.description ?? '',
      permissions: (initialRole?.permissions ?? []).map(String),
      users: initialRole?.users ?? [],
    },
  });
  const organization = useWatch({ control, name: 'organization' });
  const permissions = useWatch({ control, name: 'permissions' });
  const users = useWatch({ control, name: 'users' });
  const usersQuery = useUsersLookupQuery(organization || undefined);
  const permissionOptions =
    (permissionsQuery.data ?? []).map((permission) => ({
      value: String(permission.id),
      label: permission.codename,
      hint: permission.permission_code,
      group: permission.app_label,
    })) ?? [];
  const userOptions = (usersQuery.data ?? []).map((user: User) => ({
    value: user.id,
    label: fullName(user) || user.email,
    hint: user.email,
  }));
  const showSubmitError =
    Boolean(submitError) && !(submitError as { response?: unknown }).response;

  const changeOrganization = (value: string) => {
    setValue('organization', value);
    setValue('users', []);
  };

  const submit = async (values: RoleFormValues) => {
    try {
      await onSubmit({
        ...values,
        permissions: values.permissions.map(Number),
        users: values.users,
      });
    } catch (error) {
      const response = (error as { response?: { data?: ApiValidationErrors } })
        .response?.data;
      if (response)
        Object.entries(response).forEach(([field, value]) => {
          const message = Array.isArray(value) ? value[0] : value;
          if (field in values)
            setError(field as keyof RoleFormValues, { message });
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
          {isSubmitting ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
      {showSubmitError && (
        <p className="form-error">
          Impossible d’enregistrer le rôle. Vérifiez les champs puis réessayez.
        </p>
      )}
      <div className="form-grid">
        <section className="panel form-section">
          <div className="form-section-heading">
            <span className="eyebrow">IDENTITÉ</span>
            <h2>Informations générales</h2>
          </div>
          <FormField label="Organisation" error={errors.organization?.message}>
            <select
              {...register('organization', {
                onChange: (event) => changeOrganization(event.target.value),
              })}
            >
              <option value="">Sélectionnez une organisation</option>
              {organizations.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name} · {item.code}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Nom du rôle" error={errors.name?.message}>
            <input {...register('name')} placeholder="Ex. Chef de site" />
          </FormField>
          <FormField label="Code" error={errors.code?.message}>
            <input
              {...register('code')}
              placeholder="Ex. SITE_MANAGER"
              style={{ textTransform: 'uppercase' }}
            />
          </FormField>
          <FormField label="Description" error={errors.description?.message}>
            <textarea
              {...register('description')}
              rows={4}
              placeholder="Décrivez le périmètre de responsabilité du rôle"
            />
          </FormField>
        </section>
        <section className="panel form-section">
          <div className="form-section-heading">
            <span className="eyebrow">PERMISSIONS</span>
            <h2>Droits accordés</h2>
          </div>
          {permissionsQuery.isLoading ? (
            <div className="form-note">Chargement des permissions…</div>
          ) : (
            <MultiSelect
              label="Permissions système"
              options={permissionOptions}
              values={permissions}
              onChange={(next) => setValue('permissions', next)}
              error={errors.permissions?.message}
              empty="Aucune permission système disponible."
            />
          )}
          <div className="form-note">
            Les permissions sont groupées par application. Un rôle n’est
            effectif que s’il dispose d’au moins une permission.
          </div>
        </section>
      </div>
      <section className="panel form-section">
        <div className="form-section-heading">
          <span className="eyebrow">UTILISATEURS</span>
          <h2>Titulaires du rôle</h2>
        </div>
        {usersQuery.isLoading ? (
          <div className="form-note">Chargement des utilisateurs…</div>
        ) : (
          <MultiSelect
            label="Utilisateurs assignés"
            options={userOptions}
            values={users}
            onChange={(next) => setValue('users', next)}
            error={errors.users?.message}
            empty="Aucun utilisateur dans cette organisation."
          />
        )}
      </section>
    </form>
  );
}

function fullName(user: User) {
  return `${user.first_name} ${user.last_name}`.trim();
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
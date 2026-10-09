import { Plus, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { MultiSelect } from '../../../../shared/components/MultiSelect'
import type { Role } from '../../roles/domain/role'
import { useAllPermissionsQuery } from '../../roles/hooks/usePermissionsQuery'
import {
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useRolesLookupQuery,
} from '../../roles/hooks/useRolesQuery'

const miniRoleSchema = z.object({
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
});

type MiniRoleValues = z.infer<typeof miniRoleSchema>;
type ApiErrors = Record<string, string[] | string>;

export function UserRolesManager({
  organization,
  selected,
  onChange,
  error,
}: {
  organization: string;
  selected: string[];
  onChange: (next: string[]) => void;
  error?: string;
}) {
  const rolesQuery = useRolesLookupQuery(organization || undefined);
  const permissionsQuery = useAllPermissionsQuery();
  const createRole = useCreateRoleMutation();
  const deleteRole = useDeleteRoleMutation();
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');

  const form = useForm<MiniRoleValues>({
    defaultValues: { name: '', code: '', description: '', permissions: [] },
  });
  const watchedPermissions = useWatch({ control: form.control, name: 'permissions' });

  const roles = rolesQuery.data ?? [];
  const permissionOptions = (permissionsQuery.data ?? []).map((permission) => ({
    value: String(permission.id),
    label: permission.codename,
    hint: permission.permission_code,
    group: permission.app_label,
  }));

  const toggle = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((item) => item !== id)
        : [...selected, id],
    );
  };

  const remove = async (role: Role) => {
    if (!window.confirm(`Supprimer le rôle « ${role.name} » ? Cette action est irréversible.`)) return;
    await deleteRole.mutateAsync(role.id);
    onChange(selected.filter((item) => item !== role.id));
  };

  const closeCreate = () => {
    setCreating(false);
    setFormError('');
    form.reset();
  };

  const submitCreate = async () => {
    const parsed = miniRoleSchema.safeParse(form.getValues());
    if (!parsed.success) {
      setFormError('');
      parsed.error.issues.forEach((issue) => {
        const field = String(issue.path[0] ?? 'name');
        form.setError(field as keyof MiniRoleValues, { message: issue.message });
      });
      return;
    }
    try {
      const created = await createRole.mutateAsync({
        organization,
        name: parsed.data.name,
        code: parsed.data.code,
        description: parsed.data.description,
        permissions: parsed.data.permissions.map(Number),
        users: [],
      });
      onChange(selected.includes(created.id) ? selected : [...selected, created.id]);
      closeCreate();
    } catch (createError) {
      const response = (createError as { response?: { data?: ApiErrors } })
        .response?.data;
      let message = '';
      if (response) {
        for (const field of ['name', 'code', 'description', 'permissions'] as const) {
          const value = response[field];
          if (value) {
            form.setError(field as keyof MiniRoleValues, {
              message: Array.isArray(value) ? value[0] : value,
            });
            message = message || 'Vérifiez les champs du rôle.';
          }
        }
        if (response.detail) message = String(response.detail);
      }
      setFormError(message || 'Impossible de créer le rôle. Réessayez.');
    }
  };

  return (
    <section className="panel form-section">
      <div className="form-section-heading">
        <span className="eyebrow">PERMISSIONS · RÔLES</span>
        <h2>Rôles de l'organisation</h2>
        <p className="form-section-sub">
          Assignez des rôles existants ou créez-en un sans quitter cette page.
        </p>
      </div>
      <div className="role-manager">
        <div className="role-manager-assign">
          <MultiSelect
            label="Rôles assignés à l'utilisateur"
            options={roles.map((role) => ({
              value: role.id,
              label: role.name,
              hint: role.code,
            }))}
            values={selected}
            onChange={onChange}
            error={error}
            empty="Aucun rôle dans cette organisation."
          />
          {rolesQuery.isLoading && (
            <small className="field-error role-manager-hint">
              Chargement des rôles…
            </small>
          )}
        </div>
        <div className="role-manager-list">
          <div className="role-manager-list-head">
            <b>Rôles existants</b>
            {!rolesQuery.isLoading && (
              <span className="role-manager-count">
                {roles.length} rôle{roles.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          {rolesQuery.isLoading ? null : roles.length === 0 ? (
            <div className="role-manager-empty">
              Aucun rôle dans cette organisation.
            </div>
          ) : (
            roles.map((role) => (
              <div
                className={`role-manager-row ${selected.includes(role.id) ? 'role-manager-row--selected' : ''}`}
                key={role.id}
              >
                <label className="role-manager-check">
                  <input
                    type="checkbox"
                    checked={selected.includes(role.id)}
                    onChange={() => toggle(role.id)}
                  />
                </label>
                <div className="role-manager-copy">
                  <b>{role.name}</b>
                  <div className="role-manager-meta">
                    <span className="role-badge">{role.code}</span>
                    <span>{role.permissions.length} permission(s)</span>
                    <span>· {role.users.length} utilisateur(s)</span>
                  </div>
                </div>
                <div className="role-manager-actions">
                  <button
                    type="button"
                    className="role-manager-delete"
                    aria-label={`Supprimer ${role.name}`}
                    onClick={() => remove(role)}
                    disabled={deleteRole.isPending}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="role-manager-create">
          {creating ? (
            <div>
              <div className="role-manager-create-head">
                <b>Nouveau rôle</b>
                <button type="button" className="text-button" onClick={closeCreate}>
                  Annuler
                </button>
              </div>
              {formError && <p className="form-error">{formError}</p>}
              <div className="role-manager-create-grid">
                <FormField label="Nom du rôle" error={form.formState.errors.name?.message}>
                  <input
                    {...form.register('name')}
                    placeholder="Ex. Chef de site"
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        submitCreate();
                      }
                    }}
                  />
                </FormField>
                <FormField label="Code" error={form.formState.errors.code?.message}>
                  <input
                    {...form.register('code')}
                    placeholder="Ex. SITE_MANAGER"
                    style={{ textTransform: 'uppercase' }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        submitCreate();
                      }
                    }}
                  />
                </FormField>
              </div>
              <div className="role-manager-create-full">
                {permissionsQuery.isLoading ? (
                  <div className="form-note">Chargement des permissions…</div>
                ) : (
                  <MultiSelect
                    label="Permissions accordées"
                    options={permissionOptions}
                    values={watchedPermissions}
                    onChange={(next) => form.setValue('permissions', next)}
                    error={form.formState.errors.permissions?.message}
                  />
                )}
              </div>
              <div className="role-manager-create-actions">
                <button
                  type="button"
                  className="primary-button"
                  onClick={submitCreate}
                  disabled={createRole.isPending}
                >
                  <Plus size={15} />
                  {createRole.isPending ? 'Création…' : 'Créer le rôle'}
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="role-manager-add"
              onClick={() => setCreating(true)}
              disabled={!organization}
              title={organization ? undefined : 'Sélectionnez d’abord une organisation'}
            >
              <Plus size={15} />
              Créer un rôle dans cette organisation
            </button>
          )}
        </div>
      </div>
    </section>
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
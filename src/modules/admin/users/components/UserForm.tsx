import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Save } from 'lucide-react'
import type { ReactNode } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import type { Organization } from '../../../core/organizations/domain/organization'
import { useDepartmentsLookupQuery } from '../../../core/departments/hooks/useDepartmentsQuery'
import { useSitesLookupQuery } from '../../../core/sites/hooks/useSitesQuery'
import type { User, UserCreatePayload, UserPayload } from '../domain/user'
import { UserRolesManager } from './UserRolesManager'

const baseSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "L'adresse email est obligatoire.")
    .email('Adresse email invalide.'),
  first_name: z.string().trim().min(1, 'Le prénom est obligatoire.'),
  last_name: z.string().trim().min(1, 'Le nom est obligatoire.'),
  phone: z.string(),
  organization: z.string().uuid('Sélectionnez une organisation valide.'),
  site: z.string().uuid('Site invalide.').optional().or(z.literal('')),
  department: z.string().uuid('Département invalide.').optional().or(z.literal('')),
  roles: z.array(z.string().uuid('Rôle invalide.')),
  status: z.enum(['active', 'inactive', 'suspended']),
  is_active: z.boolean(),
});

const createSchema = baseSchema.extend({
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères.'),
});

type BaseFormValues = z.infer<typeof baseSchema>;
type FormValues = BaseFormValues & { password?: string };
type ApiValidationErrors = Record<string, string[] | string>;
type UserFormPayload = UserCreatePayload | UserPayload;

export function UserForm({
  organizations,
  initialUser,
  createMode = false,
  isSubmitting,
  submitError,
  onSubmit,
  onCancel,
}: {
  organizations: Organization[];
  initialUser?: User;
  createMode?: boolean;
  isSubmitting: boolean;
  submitError: unknown;
  onSubmit: (payload: UserFormPayload) => Promise<void>;
  onCancel: () => void;
}) {
  const schema = createMode ? createSchema : baseSchema;
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: initialUser?.email ?? '',
      password: '',
      first_name: initialUser?.first_name ?? '',
      last_name: initialUser?.last_name ?? '',
      phone: initialUser?.phone ?? '',
      organization: initialUser?.organization ?? organizations[0]?.id ?? '',
      site: initialUser?.site ?? '',
      department: initialUser?.department ?? '',
      roles: initialUser?.roles ?? [],
      status: initialUser?.status ?? 'active',
      is_active: initialUser?.is_active ?? true,
    },
  });
  const organization = useWatch({ control, name: 'organization' });
  const roles = useWatch({ control, name: 'roles' });
  const sitesQuery = useSitesLookupQuery(organization || undefined);
  const departmentsQuery = useDepartmentsLookupQuery(organization || undefined);
  const showSubmitError =
    Boolean(submitError) && !(submitError as { response?: unknown }).response;

  const changeOrganization = (value: string) => {
    setValue('organization', value);
    setValue('site', '');
    setValue('department', '');
    setValue('roles', []);
  };

  const submit = async (values: FormValues) => {
    const { password, ...profile } = values;
    const payload = {
      ...profile,
      site: values.site || null,
      department: values.department || null,
    };
    try {
      await onSubmit(
        createMode ? { ...payload, password: password ?? '' } : payload,
      );
    } catch (error) {
      const response = (error as { response?: { data?: ApiValidationErrors } })
        .response?.data;
      if (response)
        Object.entries(response).forEach(([field, value]) => {
          const message = Array.isArray(value) ? value[0] : value;
          if (field in values)
            setError(field as keyof FormValues, { message });
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
          Impossible d’enregistrer l’utilisateur. Vérifiez les champs puis
          réessayez.
        </p>
      )}
      <div className="form-grid">
        <section className="panel form-section">
          <div className="form-section-heading">
            <span className="eyebrow">IDENTITÉ</span>
            <h2>Coordonnées du compte</h2>
          </div>
          <FormField label="Prénom" error={errors.first_name?.message}>
            <input {...register('first_name')} placeholder="Ex. Aminata" />
          </FormField>
          <FormField label="Nom" error={errors.last_name?.message}>
            <input {...register('last_name')} placeholder="Ex. Diop" />
          </FormField>
          <FormField label="Adresse email" error={errors.email?.message}>
            <input
              type="email"
              {...register('email')}
              placeholder="prenom@entreprise.com"
            />
          </FormField>
          <FormField label="Téléphone" error={errors.phone?.message}>
            <input {...register('phone')} placeholder="Ex. +221 77 000 00 00" />
          </FormField>
          {createMode && (
            <FormField label="Mot de passe" error={errors.password?.message}>
              <input
                type="password"
                {...register('password')}
                placeholder="8 caractères minimum"
                autoComplete="new-password"
              />
            </FormField>
          )}
        </section>
        <section className="panel form-section">
          <div className="form-section-heading">
            <span className="eyebrow">AFFECTATION</span>
            <h2>Rattachement tenant</h2>
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
          <FormField label="Site" error={errors.site?.message}>
            <select {...register('site')}>
              <option value="">Non assigné</option>
              {(sitesQuery.data ?? []).map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name} · {item.code}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Département" error={errors.department?.message}>
            <select {...register('department')}>
              <option value="">Non assigné</option>
              {(departmentsQuery.data ?? []).map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name} · {item.code}
                </option>
              ))}
            </select>
          </FormField>
        </section>
      </div>
      <UserRolesManager
        organization={organization}
        selected={roles}
        onChange={(next) => setValue('roles', next)}
        error={errors.roles?.message}
      />
      <section className="panel form-section">
        <div className="form-section-heading">
          <span className="eyebrow">COMPTE</span>
          <h2>État du compte</h2>
        </div>
        <FormField label="Statut" error={errors.status?.message}>
          <select {...register('status')}>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="suspended">Suspendu</option>
          </select>
        </FormField>
        <FormField label="Compte actif" error={errors.is_active?.message}>
          <label className="check-row">
            <input type="checkbox" {...register('is_active')} />
            <span className="check-row-copy">
              <b>Activer l’authentification</b>
              <small>
                Un statut « inactif » ou « suspendu » désactive le compte, quel
                que soit ce réglage.
              </small>
            </span>
          </label>
        </FormField>
      </section>
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
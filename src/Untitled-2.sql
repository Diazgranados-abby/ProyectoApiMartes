SELECT
    column_name,
    is_identity,
    identity_generation
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'plan_ajustes'
  AND column_name = 'id_plan_ajuste';
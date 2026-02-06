insert into public.dojos (id, name, city, country, contact, website)
values
  (gen_random_uuid(), 'Dojo Exemple', 'Paris', 'France', 'contact@dojo-exemple.fr', 'https://dojo-exemple.fr');

insert into public.users (id, role, created_at)
values
  (gen_random_uuid(), 'teacher', now()),
  (gen_random_uuid(), 'practitioner', now());

insert into public.content_items (type, title, body_md, level, allowed_autonomous, tags, media_urls)
values
  ('posture', 'Posture d’ancrage', 'Posture de base pour la stabilité et l’attention au souffle.', 'débutant', true, '["ancrage", "respiration"]', '[]'),
  ('marche', 'Marche attentive', 'Marche lente avec attention à l’axe et au pas.', 'débutant', true, '["axe", "équilibre"]', '[]'),
  ('meditation', 'Assise silencieuse', 'Méditation courte de retour au calme.', 'tous niveaux', true, '["calme", "attention"]', '[]');

insert into public.programs (id, title, description, visibility)
values
  (gen_random_uuid(), 'Rituel quotidien (20 min)', 'Séance courte de préparation + marche + retour au calme.', 'public');

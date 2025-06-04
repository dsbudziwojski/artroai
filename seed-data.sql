BEGIN;

TRUNCATE follower, image, user_profile RESTART IDENTITY CASCADE;

INSERT INTO user_profile (
  username,
  first_name,
  last_name,
  bio,
  email,
  isAdmin,
  profile_image_path
)
VALUES
  ('neo01',   'Thomas',  'Anderson', 'Hacker by night, data architect by day.',            'neo01@example.com', FALSE, '/api/generated-images/neo01_profile.png'),
  ('trinity', 'Trinity', 'Jones',    'Matrix operative & UX designer.',                     'trinity@example.com', FALSE, '/api/generated-images/trinity_profile.png'),
  ('morp03',  'Morpheus','Smith',    'I’m trying to free your mind.',                       'morp03@example.com', TRUE,  '/api/generated-images/morp03_profile.png'),
  ('agent44', 'Agent',   'Brown',    'Enforcer of the system.',                             'agent44@example.com', FALSE, '/api/generated-images/agent44_profile.png'),
  ('cypher9', 'Mr.',     'Cypher',   'Ignorance is bliss.',                                 'cypher9@example.com', FALSE, '/api/generated-images/cypher9_profile.png'),
  ('oracle8', 'The',     'Oracle',   'Know thyself.',                                       'oracle8@example.com', FALSE, '/api/generated-images/oracle8_profile.png'),
  ('novaX00', 'Nova',    'Xavier',   'Interstellar explorer mapping new galaxies.',         'novaX00@example.com', FALSE, '/api/generated-images/novaX00_profile.png')
ON CONFLICT (username) DO NOTHING;

INSERT INTO follower(user_id, following_id)
VALUES
  ('neo01',    'trinity'),
  ('neo01',    'morp03'),
  ('trinity',  'morp03'),
  ('morp03',   'neo01'),
  ('cypher9',  'agent44'),
  ('oracle8',  'neo01'),
  ('novaX00',  'morp03'),
  ('novaX00',  'neo01'),
  ('trinity',  'oracle8'),
  ('morp03',   'oracle8')
ON CONFLICT DO NOTHING;

INSERT INTO image(path, prompt, hashtags, created_by, date_created) VALUES
  ('/api/generated-images/neo01_1.png', 'Futuristic cityscape at dusk, neon reflections on wet streets', '#futuristic #neon #city', 'neo01', '2025-05-01'),
  ('/api/generated-images/neo01_2.png', 'Cyberpunk alley with holographic graffiti and rainy ambiance', '#cyberpunk #hologram #rain', 'neo01', '2025-05-02'),
  ('/api/generated-images/neo01_3.png', 'High-tech monorail gliding above a neon skyline', '#monorail #future #skyline', 'neo01', '2025-05-03'),
  ('/api/generated-images/trinity_1.png', 'Blade Runner–style megacity with flying cars at night', '#bladerunner #vehicles #night', 'trinity', '2025-05-01'),
  ('/api/generated-images/trinity_2.png', 'One-person hacking pod glowing with circuits', '#hacking #pod #circuits', 'trinity', '2025-05-02'),
  ('/api/generated-images/trinity_3.png', 'Digital rain falling over a crowded virtual marketplace', '#digital #market #rain', 'trinity', '2025-05-03'),
  ('/api/generated-images/morp03_1.png', 'Red pill and blue pill on a reflective surface in neon light', '#choices #pills #reflection', 'morp03', '2025-05-01'),
  ('/api/generated-images/morp03_2.png', 'Ancient oracle in futuristic robes with glowing eyes', '#oracle #futuristic #robes', 'morp03', '2025-05-02'),
  ('/api/generated-images/morp03_3.png', 'A ship’s bridge filled with holographic control panels', '#ship #holographic #controls', 'morp03', '2025-05-03'),
  ('/api/generated-images/agent44_1.png', 'Sleek black-cybernetic suit in a futuristic background', '#cybernetic #suit #futuristic', 'agent44', '2025-05-01'),
  ('/api/generated-images/agent44_2.png', 'Menacing sentinel robot patrolling a neon corridor', '#robot #sentinel #corridor', 'agent44', '2025-05-02'),
  ('/api/generated-images/agent44_3.png', 'Digital code cascading down a dark screen', '#code #matrix #dark', 'agent44', '2025-05-03'),
  ('/api/generated-images/cypher9_1.png', 'Glitch art portrait with neon distortions', '#glitch #portrait #neon', 'cypher9', '2025-05-01'),
  ('/api/generated-images/cypher9_2.png', 'Rusty data server room lit by ominous red glow', '#server #red #rust', 'cypher9', '2025-05-02'),
  ('/api/generated-images/cypher9_3.png', 'Encrypted message floating in cyberspace', '#encryption #cyberspace #text', 'cypher9', '2025-05-03'),
  ('/api/generated-images/oracle8_1.png', 'Crystal ball with swirling galaxies inside, neon trim', '#crystal #galaxy #neon', 'oracle8', '2025-05-01'),
  ('/api/generated-images/oracle8_2.png', 'Futuristic library filled with holographic books', '#library #hologram #books', 'oracle8', '2025-05-02'),
  ('/api/generated-images/oracle8_3.png', 'Abstract neural network visualization in 3D', '#neural #network #3D', 'oracle8', '2025-05-03'),
  ('/api/generated-images/novaX00_1.png', 'Warp-drive starship emerging from a nebula', '#space #nebula #starship', 'novaX00', '2025-05-01'),
  ('/api/generated-images/novaX00_2.png', 'Astronaut planting a flag on an uncharted exoplanet', '#astronaut #exoplanet #flag', 'novaX00', '2025-05-02'),
  ('/api/generated-images/novaX00_3.png', 'Celestial map hologram projecting future voyages', '#hologram #map #voyage', 'novaX00', '2025-05-03'),
  ('/api/generated-images/novaX00_4.png', 'Alien monolith under a binary-star sky', '#alien #monolith #twinstar', 'novaX00', '2025-05-04')
ON CONFLICT DO NOTHING;

COMMIT;

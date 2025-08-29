-- Insert Nigerian states (all 36 + FCT)
INSERT INTO public.states (name, code) VALUES
('Abia', 'AB'),
('Adamawa', 'AD'),
('Akwa Ibom', 'AK'),
('Anambra', 'AN'),
('Bauchi', 'BA'),
('Bayelsa', 'BY'),
('Benue', 'BE'),
('Borno', 'BO'),
('Cross River', 'CR'),
('Delta', 'DE'),
('Ebonyi', 'EB'),
('Edo', 'ED'),
('Ekiti', 'EK'),
('Enugu', 'EN'),
('Federal Capital Territory', 'FC'),
('Gombe', 'GO'),
('Imo', 'IM'),
('Jigawa', 'JI'),
('Kaduna', 'KD'),
('Kano', 'KN'),
('Katsina', 'KT'),
('Kebbi', 'KE'),
('Kogi', 'KO'),
('Kwara', 'KW'),
('Lagos', 'LA'),
('Nasarawa', 'NA'),
('Niger', 'NI'),
('Ogun', 'OG'),
('Ondo', 'ON'),
('Osun', 'OS'),
('Oyo', 'OY'),
('Plateau', 'PL'),
('Rivers', 'RI'),
('Sokoto', 'SO'),
('Taraba', 'TA'),
('Yobe', 'YO'),
('Zamfara', 'ZA');

-- Insert sample LGAs for major states (Lagos, Kano, Rivers, Kaduna, Oyo)
-- Lagos LGAs
INSERT INTO public.lgas (name, state_id) VALUES
('Agege', (SELECT id FROM public.states WHERE code = 'LA')),
('Alimosho', (SELECT id FROM public.states WHERE code = 'LA')),
('Amuwo-Odofin', (SELECT id FROM public.states WHERE code = 'LA')),
('Apapa', (SELECT id FROM public.states WHERE code = 'LA')),
('Badagry', (SELECT id FROM public.states WHERE code = 'LA')),
('Epe', (SELECT id FROM public.states WHERE code = 'LA')),
('Eti-Osa', (SELECT id FROM public.states WHERE code = 'LA')),
('Ibeju-Lekki', (SELECT id FROM public.states WHERE code = 'LA')),
('Ifako-Ijaiye', (SELECT id FROM public.states WHERE code = 'LA')),
('Ikeja', (SELECT id FROM public.states WHERE code = 'LA')),
('Ikorodu', (SELECT id FROM public.states WHERE code = 'LA')),
('Kosofe', (SELECT id FROM public.states WHERE code = 'LA')),
('Lagos Island', (SELECT id FROM public.states WHERE code = 'LA')),
('Lagos Mainland', (SELECT id FROM public.states WHERE code = 'LA')),
('Mushin', (SELECT id FROM public.states WHERE code = 'LA')),
('Ojo', (SELECT id FROM public.states WHERE code = 'LA')),
('Oshodi-Isolo', (SELECT id FROM public.states WHERE code = 'LA')),
('Shomolu', (SELECT id FROM public.states WHERE code = 'LA')),
('Surulere', (SELECT id FROM public.states WHERE code = 'LA'));

-- Kano LGAs
INSERT INTO public.lgas (name, state_id) VALUES
('Ajingi', (SELECT id FROM public.states WHERE code = 'KN')),
('Albasu', (SELECT id FROM public.states WHERE code = 'KN')),
('Bagwai', (SELECT id FROM public.states WHERE code = 'KN')),
('Bebeji', (SELECT id FROM public.states WHERE code = 'KN')),
('Bichi', (SELECT id FROM public.states WHERE code = 'KN')),
('Bunkure', (SELECT id FROM public.states WHERE code = 'KN')),
('Dala', (SELECT id FROM public.states WHERE code = 'KN')),
('Dambatta', (SELECT id FROM public.states WHERE code = 'KN')),
('Dawakin Kudu', (SELECT id FROM public.states WHERE code = 'KN')),
('Dawakin Tofa', (SELECT id FROM public.states WHERE code = 'KN')),
('Doguwa', (SELECT id FROM public.states WHERE code = 'KN')),
('Fagge', (SELECT id FROM public.states WHERE code = 'KN')),
('Gabasawa', (SELECT id FROM public.states WHERE code = 'KN')),
('Garko', (SELECT id FROM public.states WHERE code = 'KN')),
('Garun Mallam', (SELECT id FROM public.states WHERE code = 'KN')),
('Gaya', (SELECT id FROM public.states WHERE code = 'KN')),
('Gezawa', (SELECT id FROM public.states WHERE code = 'KN')),
('Gwale', (SELECT id FROM public.states WHERE code = 'KN')),
('Gwarzo', (SELECT id FROM public.states WHERE code = 'KN')),
('Kabo', (SELECT id FROM public.states WHERE code = 'KN')),
('Kano Municipal', (SELECT id FROM public.states WHERE code = 'KN')),
('Karaye', (SELECT id FROM public.states WHERE code = 'KN')),
('Kibiya', (SELECT id FROM public.states WHERE code = 'KN')),
('Kiru', (SELECT id FROM public.states WHERE code = 'KN')),
('Kumbotso', (SELECT id FROM public.states WHERE code = 'KN')),
('Kunchi', (SELECT id FROM public.states WHERE code = 'KN')),
('Kura', (SELECT id FROM public.states WHERE code = 'KN')),
('Madobi', (SELECT id FROM public.states WHERE code = 'KN')),
('Makoda', (SELECT id FROM public.states WHERE code = 'KN')),
('Minjibir', (SELECT id FROM public.states WHERE code = 'KN')),
('Nasarawa', (SELECT id FROM public.states WHERE code = 'KN')),
('Rano', (SELECT id FROM public.states WHERE code = 'KN')),
('Rimin Gado', (SELECT id FROM public.states WHERE code = 'KN')),
('Rogo', (SELECT id FROM public.states WHERE code = 'KN')),
('Shanono', (SELECT id FROM public.states WHERE code = 'KN')),
('Sumaila', (SELECT id FROM public.states WHERE code = 'KN')),
('Takai', (SELECT id FROM public.states WHERE code = 'KN')),
('Tarauni', (SELECT id FROM public.states WHERE code = 'KN')),
('Tofa', (SELECT id FROM public.states WHERE code = 'KN')),
('Tsanyawa', (SELECT id FROM public.states WHERE code = 'KN')),
('Tudun Wada', (SELECT id FROM public.states WHERE code = 'KN')),
('Ungogo', (SELECT id FROM public.states WHERE code = 'KN')),
('Warawa', (SELECT id FROM public.states WHERE code = 'KN')),
('Wudil', (SELECT id FROM public.states WHERE code = 'KN'));

-- Rivers LGAs
INSERT INTO public.lgas (name, state_id) VALUES
('Abua/Odual', (SELECT id FROM public.states WHERE code = 'RI')),
('Ahoada East', (SELECT id FROM public.states WHERE code = 'RI')),
('Ahoada West', (SELECT id FROM public.states WHERE code = 'RI')),
('Akuku-Toru', (SELECT id FROM public.states WHERE code = 'RI')),
('Andoni', (SELECT id FROM public.states WHERE code = 'RI')),
('Asari-Toru', (SELECT id FROM public.states WHERE code = 'RI')),
('Bonny', (SELECT id FROM public.states WHERE code = 'RI')),
('Degema', (SELECT id FROM public.states WHERE code = 'RI')),
('Eleme', (SELECT id FROM public.states WHERE code = 'RI')),
('Emohua', (SELECT id FROM public.states WHERE code = 'RI')),
('Etche', (SELECT id FROM public.states WHERE code = 'RI')),
('Gokana', (SELECT id FROM public.states WHERE code = 'RI')),
('Ikwerre', (SELECT id FROM public.states WHERE code = 'RI')),
('Khana', (SELECT id FROM public.states WHERE code = 'RI')),
('Obio/Akpor', (SELECT id FROM public.states WHERE code = 'RI')),
('Ogba/Egbema/Ndoni', (SELECT id FROM public.states WHERE code = 'RI')),
('Ogu/Bolo', (SELECT id FROM public.states WHERE code = 'RI')),
('Okrika', (SELECT id FROM public.states WHERE code = 'RI')),
('Omuma', (SELECT id FROM public.states WHERE code = 'RI')),
('Opobo/Nkoro', (SELECT id FROM public.states WHERE code = 'RI')),
('Oyigbo', (SELECT id FROM public.states WHERE code = 'RI')),
('Port Harcourt', (SELECT id FROM public.states WHERE code = 'RI')),
('Tai', (SELECT id FROM public.states WHERE code = 'RI'));

-- Kaduna LGAs
INSERT INTO public.lgas (name, state_id) VALUES
('Birnin Gwari', (SELECT id FROM public.states WHERE code = 'KD')),
('Chikun', (SELECT id FROM public.states WHERE code = 'KD')),
('Giwa', (SELECT id FROM public.states WHERE code = 'KD')),
('Igabi', (SELECT id FROM public.states WHERE code = 'KD')),
('Ikara', (SELECT id FROM public.states WHERE code = 'KD')),
('Jaba', (SELECT id FROM public.states WHERE code = 'KD')),
('Jema''a', (SELECT id FROM public.states WHERE code = 'KD')),
('Kachia', (SELECT id FROM public.states WHERE code = 'KD')),
('Kaduna North', (SELECT id FROM public.states WHERE code = 'KD')),
('Kaduna South', (SELECT id FROM public.states WHERE code = 'KD')),
('Kagarko', (SELECT id FROM public.states WHERE code = 'KD')),
('Kajuru', (SELECT id FROM public.states WHERE code = 'KD')),
('Kaura', (SELECT id FROM public.states WHERE code = 'KD')),
('Kauru', (SELECT id FROM public.states WHERE code = 'KD')),
('Kubau', (SELECT id FROM public.states WHERE code = 'KD')),
('Kudan', (SELECT id FROM public.states WHERE code = 'KD')),
('Lere', (SELECT id FROM public.states WHERE code = 'KD')),
('Makarfi', (SELECT id FROM public.states WHERE code = 'KD')),
('Sabon Gari', (SELECT id FROM public.states WHERE code = 'KD')),
('Sanga', (SELECT id FROM public.states WHERE code = 'KD')),
('Soba', (SELECT id FROM public.states WHERE code = 'KD')),
('Zangon Kataf', (SELECT id FROM public.states WHERE code = 'KD')),
('Zaria', (SELECT id FROM public.states WHERE code = 'KD'));

-- Oyo LGAs
INSERT INTO public.lgas (name, state_id) VALUES
('Afijio', (SELECT id FROM public.states WHERE code = 'OY')),
('Akinyele', (SELECT id FROM public.states WHERE code = 'OY')),
('Atiba', (SELECT id FROM public.states WHERE code = 'OY')),
('Atisbo', (SELECT id FROM public.states WHERE code = 'OY')),
('Egbeda', (SELECT id FROM public.states WHERE code = 'OY')),
('Ibadan North', (SELECT id FROM public.states WHERE code = 'OY')),
('Ibadan North-East', (SELECT id FROM public.states WHERE code = 'OY')),
('Ibadan North-West', (SELECT id FROM public.states WHERE code = 'OY')),
('Ibadan South-East', (SELECT id FROM public.states WHERE code = 'OY')),
('Ibadan South-West', (SELECT id FROM public.states WHERE code = 'OY')),
('Ibarapa Central', (SELECT id FROM public.states WHERE code = 'OY')),
('Ibarapa East', (SELECT id FROM public.states WHERE code = 'OY')),
('Ibarapa North', (SELECT id FROM public.states WHERE code = 'OY')),
('Ido', (SELECT id FROM public.states WHERE code = 'OY')),
('Irepo', (SELECT id FROM public.states WHERE code = 'OY')),
('Iseyin', (SELECT id FROM public.states WHERE code = 'OY')),
('Itesiwaju', (SELECT id FROM public.states WHERE code = 'OY')),
('Iwajowa', (SELECT id FROM public.states WHERE code = 'OY')),
('Kajola', (SELECT id FROM public.states WHERE code = 'OY')),
('Lagelu', (SELECT id FROM public.states WHERE code = 'OY')),
('Ogbomosho North', (SELECT id FROM public.states WHERE code = 'OY')),
('Ogbomosho South', (SELECT id FROM public.states WHERE code = 'OY')),
('Ogo Oluwa', (SELECT id FROM public.states WHERE code = 'OY')),
('Olorunsogo', (SELECT id FROM public.states WHERE code = 'OY')),
('Oluyole', (SELECT id FROM public.states WHERE code = 'OY')),
('Ona Ara', (SELECT id FROM public.states WHERE code = 'OY')),
('Orelope', (SELECT id FROM public.states WHERE code = 'OY')),
('Ori Ire', (SELECT id FROM public.states WHERE code = 'OY')),
('Oyo East', (SELECT id FROM public.states WHERE code = 'OY')),
('Oyo West', (SELECT id FROM public.states WHERE code = 'OY')),
('Saki East', (SELECT id FROM public.states WHERE code = 'OY')),
('Saki West', (SELECT id FROM public.states WHERE code = 'OY')),
('Surulere', (SELECT id FROM public.states WHERE code = 'OY'));

-- Note: Sample user profiles will be created when users sign up through the application
-- The following are just examples of what the data structure would look like

-- Example of how a profile would be created (commented out as it requires auth.users)
/*
-- Sample farmer profile (would be created after user signs up)
INSERT INTO public.profiles (id, user_type, phone, full_name, is_verified, is_approved) VALUES
('sample-farmer-uuid', 'farmer', '+2348012345678', 'John Doe', true, true);

INSERT INTO public.farmer_profiles (
  user_id, farm_name, farm_size_hectares, state_id, lga_id, 
  address, latitude, longitude, primary_crops, certifications, years_farming
) VALUES (
  'sample-farmer-uuid',
  'Green Valley Farm',
  25.5,
  (SELECT id FROM public.states WHERE code = 'LA'),
  (SELECT id FROM public.lgas WHERE name = 'Ikorodu' AND state_id = (SELECT id FROM public.states WHERE code = 'LA')),
  'Ikorodu, Lagos State',
  6.6018,
  3.3515,
  ARRAY['Rice', 'Maize'],
  ARRAY['Organic'],
  8
);

-- Sample buyer profile (would be created after user signs up)
INSERT INTO public.profiles (id, user_type, phone, full_name, is_verified, is_approved) VALUES
('sample-buyer-uuid', 'buyer', '+2348098765432', 'Jane Smith', true, true);

INSERT INTO public.buyer_profiles (
  user_id, company_name, company_type, cac_number, state_id, lga_id,
  address, purchase_capacity_tons, preferred_crops, payment_terms
) VALUES (
  'sample-buyer-uuid',
  'Nigerian Food Processors Ltd',
  'processor',
  'RC123456',
  (SELECT id FROM public.states WHERE code = 'LA'),
  (SELECT id FROM public.lgas WHERE name = 'Ikeja' AND state_id = (SELECT id FROM public.states WHERE code = 'LA')),
  'Ikeja, Lagos State',
  100.0,
  ARRAY['Rice', 'Maize', 'Cassava'],
  ARRAY['cash', 'credit_30_days']
);
*/

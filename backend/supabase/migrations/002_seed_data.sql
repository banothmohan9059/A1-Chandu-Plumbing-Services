-- ==============================================================================
-- A1 CHANDU PLUMBING SERVICES - SEED DATA MIGRATION
-- ==============================================================================

-- 1. SITE SETTINGS
INSERT INTO public.site_settings (
  id, business_name, owner_name, phone, whatsapp, email,
  working_hours, tagline, experience_years, location_base,
  hero_title, hero_description
) VALUES (
  'primary',
  'A1 Chandu Plumbing Services',
  'Chandu',
  '7032270517',
  '7032270517',
  'chandubanoth00@gmail.com',
  '24/7 Emergency Service',
  'Professional Plumbing. Quality You Can Trust.',
  5,
  'Miyapur, Hyderabad, Telangana, India',
  'Professional Plumbing. Exceptional Workmanship.',
  'From emergency plumbing repairs to complete renovation and grouting, A1 Chandu Plumbing Services delivers dependable solutions with quality workmanship across Hyderabad.'
) ON CONFLICT (id) DO UPDATE SET
  business_name = EXCLUDED.business_name,
  owner_name = EXCLUDED.owner_name,
  phone = EXCLUDED.phone,
  whatsapp = EXCLUDED.whatsapp,
  email = EXCLUDED.email,
  working_hours = EXCLUDED.working_hours,
  tagline = EXCLUDED.tagline,
  experience_years = EXCLUDED.experience_years,
  location_base = EXCLUDED.location_base;

-- 2. 25 SERVICE AREAS IN HYDERABAD
INSERT INTO public.service_areas (name, slug, district, is_enabled, display_order, popular) VALUES
  ('Miyapur', 'miyapur', 'Hyderabad / Medchal', TRUE, 1, TRUE),
  ('Ameenpur', 'ameenpur', 'Sangareddy / Hyderabad', TRUE, 2, TRUE),
  ('Beerumguda', 'beerumguda', 'Sangareddy', TRUE, 3, FALSE),
  ('Krishnareddypet', 'krishnareddypet', 'Sangareddy', TRUE, 4, FALSE),
  ('BHEL', 'bhel', 'Hyderabad / Sangareddy', TRUE, 5, TRUE),
  ('Lingampally', 'lingampally', 'Hyderabad', TRUE, 6, TRUE),
  ('Isnapur', 'isnapur', 'Sangareddy', TRUE, 7, FALSE),
  ('Patancheru', 'patancheru', 'Sangareddy', TRUE, 8, TRUE),
  ('Indresham', 'indresham', 'Sangareddy', TRUE, 9, FALSE),
  ('Gowlidoddy', 'gowlidoddy', 'Hyderabad', TRUE, 10, FALSE),
  ('TNGO''s Colony', 'tngos-colony', 'Gachibowli, Hyderabad', TRUE, 11, FALSE),
  ('Gachibowli', 'gachibowli', 'Hyderabad', TRUE, 12, TRUE),
  ('Manikonda', 'manikonda', 'Hyderabad', TRUE, 13, TRUE),
  ('Narsingi', 'narsingi', 'Hyderabad', TRUE, 14, FALSE),
  ('Kokapet', 'kokapet', 'Hyderabad', TRUE, 15, TRUE),
  ('Hafeezpet', 'hafeezpet', 'Hyderabad', TRUE, 16, TRUE),
  ('Kondapur', 'kondapur', 'Hyderabad', TRUE, 17, TRUE),
  ('Bachupally', 'bachupally', 'Medchal-Malkajgiri', TRUE, 18, TRUE),
  ('Mallampet', 'mallampet', 'Medchal-Malkajgiri', TRUE, 19, FALSE),
  ('JNTU', 'jntu', 'Kukatpally, Hyderabad', TRUE, 20, TRUE),
  ('Nizampet', 'nizampet', 'Medchal-Malkajgiri', TRUE, 21, TRUE),
  ('KPHB Colony', 'kphb-colony', 'Kukatpally, Hyderabad', TRUE, 22, TRUE),
  ('Kukatpally', 'kukatpally', 'Hyderabad', TRUE, 23, TRUE),
  ('Chandanagar', 'chandanagar', 'Hyderabad', TRUE, 24, TRUE),
  ('HMT Swarnapuri', 'hmt-swarnapuri', 'Miyapur, Hyderabad', TRUE, 25, FALSE)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  is_enabled = EXCLUDED.is_enabled,
  display_order = EXCLUDED.display_order;

-- 3. 14 CORE SERVICES
INSERT INTO public.services (
  slug, title, short_description, full_description, icon, image_url,
  is_featured, is_published, display_order, common_problems, what_included,
  benefits, work_process, faqs, seo_title, seo_meta_description
) VALUES
(
  'emergency-plumbing-services',
  'Emergency Plumbing Services',
  'Rapid response for urgent pipe bursts, heavy water leaks, and overflow emergencies across Hyderabad 24/7.',
  'When plumbing disasters strike in the middle of the night or during festive gatherings, you need immediate, trustworthy assistance. A1 Chandu Plumbing Services provides round-the-clock emergency dispatch with prompt arrival, diagnostic troubleshooting, and decisive pipe isolation to safeguard your home against structural water damage.',
  'AlertTriangle',
  'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=1200&q=80',
  TRUE, TRUE, 1,
  '["Burst main supply pipes flooding rooms", "Severe ceiling or concealed wall leaks", "Overhead tank overflowing uncontrollably", "Sudden sewer or toilet backflow", "Broken main valves unable to shut off"]'::jsonb,
  '["Rapid emergency dispatch with specialized toolkits", "Immediate water supply isolation & pressure containment", "Temporary or permanent heavy-duty bypass repair", "Concealed leakage inspection", "Comprehensive post-fix pressure testing"]'::jsonb,
  '["Available 24 hours a day, 7 days a week", "Prevents expensive structural masonry damage", "Direct personal contact with technician Chandu", "Transparent upfront emergency pricing with no hidden charges"]'::jsonb,
  '["Instant phone or WhatsApp consultation to advise safety measures", "Rapid arrival at your Hyderabad locality", "System shutdown and targeted emergency containment", "Permanent durable pipe replacement or fitting fix", "Testing under full hydraulic pressure"]'::jsonb,
  '[{"q": "How fast can you reach in an emergency?", "a": "Depending on your Hyderabad locality (Miyapur, Kukatpally, Gachibowli, Ameenpur, etc.), we dispatch immediately and typically arrive within 30-45 minutes."}, {"q": "What should I do while waiting?", "a": "Shut off your main water meter or motor switch immediately and open ground taps to bleed remaining line pressure."}]'::jsonb,
  'Emergency Plumber in Hyderabad | 24/7 Rapid Response | A1 Chandu',
  '24/7 Emergency plumbing in Hyderabad. Fast response for burst pipes, severe leakages, and valve failures in Miyapur, Gachibowli, Kukatpally and nearby areas.'
),
(
  'pipe-leak-repair',
  'Pipe Leak Repair',
  'Precision detection and non-destructive repair of concealed wall, ceiling, and underground pipe leaks.',
  'Concealed pipe leaks can silently degrade wall plaster, foster harmful mold, and inflate water pumping bills. We specialize in locating the exact source of concealed and exposed pipe leaks using systematic moisture profiling and acoustic tracing, followed by neat architectural wall opening and durable pipe coupling.',
  'Droplets',
  'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1200&q=80',
  TRUE, TRUE, 2,
  '["Damp patches and peeling paint on bathroom-adjacent walls", "Mysterious water seepage dripping from ceiling slabs", "Constant pump running due to underground pipeline drops", "Rusted GI pipe pinholes and degraded CPVC joint welds"]'::jsonb,
  '["Non-destructive acoustic and visual leak localization", "Neat masonry cut out with minimal wall disruption", "Replacement with premium CPVC/UPVC pressure rated pipes", "High-grade solvent welding & compression couplings", "Full pressure load holding test before wall closing"]'::jsonb,
  '["Saves masonry and expensive wall tiles from unnecessary destruction", "Eliminates recurrent dampness and odor", "Ensures long-term waterproof pipe joints"]'::jsonb,
  '["Systematic inspection of damp lines and water routing", "Exact pin-point isolation of cracked fitting or pipe joint", "Surgical cut-out and replacement with certified fittings", "Joint curing and static water holding verification"]'::jsonb,
  '[{"q": "Will you break my entire bathroom wall?", "a": "No. We target only the exact 6-8 inch zone where the leak resides, minimizing tile and wall disruption."}, {"q": "Do you repair both CPVC and old GI metal pipes?", "a": "Yes, we transition older GI piping to modern CPVC/UPVC using proper brass threaded adaptors."}]'::jsonb,
  'Pipe Leak Repair in Hyderabad | Concealed Leak Specialists | A1 Chandu',
  'Professional pipe leak repair in Miyapur, Kukatpally, Gachibowli Hyderabad. Non-destructive detection, CPVC/UPVC pipe repairs, and damp wall waterproofing solutions.'
),
(
  'bathroom-plumbing',
  'Bathroom Plumbing',
  'End-to-end luxury sanitaryware installation, concealed diverters, showers, basins, and drainage alignments.',
  'Modern luxury bathrooms require architectural precision. From concealed thermostatic diverters, wall-hung WC frames, overhead rain showers, and bespoke counter basins, A1 Chandu provides flawless installation adhering strictly to manufacturer gradient and pressure tolerances.',
  'Bath',
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
  TRUE, TRUE, 3,
  '["Leaking concealed single-lever diverters", "Low water pressure in shower heads", "Wobbly wall-hung commodes and leaking concealed cisterns", "Drainage smell returning through floor traps", "Dripping health faucets and angle cocks"]'::jsonb,
  '["Concealed diverter body plumbing & trim kit setup", "Wall-hung and floor-mounted toilet commode mounting", "Overhead rain shower arm & hand shower plumbing", "Countertop and vanity basin faucet installations", "Anti-cockroach floor trap alignment"]'::jsonb,
  '["Luxurious finish without scratch or scuff marks on fixtures", "Optimal water pressure balancing between hot & cold lines", "Zero-leakage guarantee on concealed joints"]'::jsonb,
  '["Initial line pressure and vertical gradient layout", "Precision rough-in plumbing during tile renovation or refit", "Careful installation of sanitaryware with teflon & silicone sealing", "Operational water test across hot, cold, and diverter settings"]'::jsonb,
  '[{"q": "Can you install luxury brands like Kohler, Jaquar, Grohe?", "a": "Yes, we have deep hands-on experience installing premium fittings from Kohler, Jaquar, Grohe, Hindware, and American Standard."}]'::jsonb,
  'Bathroom Plumbing Services in Hyderabad | Sanitary Fitting Specialists',
  'Luxury bathroom plumbing in Hyderabad. Diverter installation, shower fitting, wall-hung commode setup in Miyapur, Gachibowli, Kokapet, Kondapur.'
),
(
  'drain-and-sewer-cleaning',
  'Drain and Sewer Cleaning',
  'Heavy-duty unblocking of choked bathroom drains, kitchen lines, Nahani traps, and domestic sewer lines.',
  'Stubborn blockages caused by hair buildup, soap scum, grease coagulation, or external debris demand professional mechanical rodding and pressure flushing. We clear stubborn blockages safely without cracking your PVC drainage lines.',
  'Trash2',
  'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1200&q=80',
  FALSE, TRUE, 4,
  '["Water pooling in bathroom floor drains", "Kitchen sink gurgling and backing up dirty water", "Foul sewer gas smells permeating the residence", "Main chamber overflow in apartment or villa driveway"]'::jsonb,
  '["Mechanical rotary drain snake augering", "Grease and sediment line de-scaling", "Nahani trap disassembly and deep cleanout", "Manhole chamber line clearing and flushing", "Disinfection and flow-rate testing"]'::jsonb,
  '["Fast restoration of uninterrupted drainage flow", "Prevents backflow contamination in living areas", "Gentle on underground PVC pipelines without chemical destruction"]'::jsonb,
  '["Locate blockage point via trap access or cleanout ports", "Feed mechanical spring snake to break down solid buildup", "High-volume flush to push residual debris into the city main", "Verify clean continuous drainage with multi-fixture test"]'::jsonb,
  '[{"q": "Do you use harsh acid that ruins pipes?", "a": "No, we use mechanical rodding and high-pressure water clearing. Harsh acids damage PVC pipes and melt joint cement."}]'::jsonb,
  'Drain & Sewer Cleaning Hyderabad | Choked Pipe Clearing | A1 Chandu',
  'Expert drain unblocking, kitchen sink line clearing, and sewer cleanout across Miyapur, Kukatpally, Lingampally, Hyderabad.'
),
(
  'kitchen-sink-and-tap-repair',
  'Kitchen Sink and Tap Repair',
  'Repair and installation of kitchen sink faucets, pull-out sprayers, bottle traps, RO connections, and waste couplings.',
  'Your kitchen is the hardworking heart of the home. We service leaking swan-neck taps, dual-flow sink mixers, waste coupling leakages, garbage disposals, and water purifier RO inlet connections with speed and tidiness.',
  'Utensils',
  'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
  FALSE, TRUE, 5,
  '["Continuous drip from sink mixer or kitchen tap", "Water accumulating inside the under-sink cabinet", "Loose or wobbly sink tap base", "Broken or jammed sink waste coupling strainer", "RO waste line leaking into under-counter cabinetry"]'::jsonb,
  '["Ceramic disc cartridge replacement for kitchen mixers", "New kitchen sink faucet & pull-out spray installation", "Stainless steel / granite sink waste coupling refitting", "Flexible bottle trap & waste pipe realignment", "Water purifier inlet valve & drainage setup"]'::jsonb,
  '["Eliminates annoying dripping sounds and water wastage", "Prevents wooden modular kitchen cabinets from rotting", "Smooth, leak-proof faucet operation"]'::jsonb,
  '["Isolate undersink angle valves", "Inspect cartridge wear and seating seals", "Fit precision brass or ceramic replacement components", "Siliconize sink flange joints and test for leak-free drainage"]'::jsonb,
  '[{"q": "Can you fix modular kitchen taps without breaking woodwork?", "a": "Yes, our specialized basin wrenches access tight spaces behind sinks without disturbing modular carpentry."}]'::jsonb,
  'Kitchen Sink & Tap Repair Hyderabad | Sink Mixer Installation',
  'Fix kitchen sink leaks, tap dripping, sink mixer installation, and under-sink drainage in Miyapur, Gachibowli, Kukatpally, Hyderabad.'
),
(
  'water-heater-geyser-installation',
  'Water Heater / Geyser Installation',
  'Safe, certified electrical and plumbing hookup for storage geysers, instant water heaters, and solar heating lines.',
  'Faulty geyser connections can lead to dangerous pressure vessel ruptures or electrical hazards. We provide safety-compliant wall mounting, stainless steel braided inlet/outlet plumbing, and multi-function pressure relief valve (NRV) installation for instant, storage, and gas geysers.',
  'Flame',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
  TRUE, TRUE, 6,
  '["Water leaking from geyser inlet/outlet pipes", "Multi-function non-return valve constantly dripping", "Geyser shifting or loosening on tiled bathroom walls", "Insufficient hot water flow reaching shower or diverter", "Need new geyser installation in newly occupied flat"]'::jsonb,
  '["Heavy-duty anchor bolting suitable for hollow & solid brick walls", "Premium braided SS 304 hot/cold connection hoses", "Multi-function safety valve (NRV) installation", "Thermal pressure check and joint seal testing", "Old geyser unmounting and safe disposal if required"]'::jsonb,
  '["Rock-solid wall anchoring prevents accidental falls", "Certified safety valve installation protects appliance lifespan", "Balanced hot water pressure to your shower"]'::jsonb,
  '["Mark plumb level on wall avoiding concealed electrical conduits", "Drill and fix heavy anchor bolts", "Mount appliance and plumb hot/cold lines with NRV", "Bleed air from tank before power connection to prevent element burnout"]'::jsonb,
  '[{"q": "Do you install all brands like AO Smith, Bajaj, Havells, Racold?", "a": "Yes, we install all major brands including AO Smith, Havells, Racold, Crompton, Bajaj, and Venus."}]'::jsonb,
  'Geyser Installation & Repair in Hyderabad | Water Heater Plumber',
  'Safe water heater & geyser installation in Hyderabad. Storage and instant geyser mounting, safety valve fitting in Miyapur, Kondapur, Kukatpally.'
),
(
  'pipe-installation-and-replacement',
  'Pipe Installation and Replacement',
  'Comprehensive plumbing repiping for residential apartments, independent villas, and commercial buildings.',
  'Whether replacing corroded galvanised iron (GI) plumbing in older Hyderabad apartments or laying fresh CPVC, UPVC, and SWR drainage systems for newly built villas, A1 Chandu delivers neat, engineered pipe routing with correct slopes and robust anchoring.',
  'GitBranch',
  'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=1200&q=80',
  FALSE, TRUE, 7,
  '["Rusty, discolored water caused by corroded GI pipes", "Inadequate water flow due to heavy mineral scaling in lines", "Multiple recurring leaks in ageing plumbing network", "Fresh plumbing required for home extension or floor addition"]'::jsonb,
  '["Complete pipe network schematic and pressure layout", "Removal or bypass of old rusted iron pipes", "New CPVC hot/cold water supply line installation", "PVC / SWR drainage pipe laying with cleanout tees", "Pipe clamps, supports, and hydraulic pressure testing"]'::jsonb,
  '["Restores crystal-clear water purity and high pressure", "Eliminates chronic leakages once and for all", "50+ year lifespan with certified SDR-11 CPVC pipes"]'::jsonb,
  '["Inspect layout and design most efficient hydraulic path", "Securely clamp lines along wall channels or shaft chases", "Solvent-weld fittings with industrial-grade ASTM primer and cement", "Hold 10 bar static pressure test for 2 hours to certify joints"]'::jsonb,
  '[{"q": "What pipe brand do you recommend?", "a": "We recommend and use top certified brands such as Astral, Ashirvad, and Supreme CPVC/UPVC."}]'::jsonb,
  'Plumbing Repiping & Pipe Installation Hyderabad | CPVC / UPVC',
  'Complete house repiping, CPVC water line installation, and drainage line replacement in Hyderabad by A1 Chandu Plumbing Services.'
),
(
  'water-tank-installation',
  'Water Tank Installation and Cleaning',
  'Overhead Sintex/triple-layer tank installation, automatic ball-valve float switches, and tank pipeline interconnection.',
  'Overhead water storage is critical in Hyderabad. We install, raise, and interconnect rooftop water tanks (Sintex, Plasto, Ashirvad) with high-flow brass ball valves, air vent loops, tank overflow alarms, and regular chemical-free pressure cleaning.',
  'Database',
  'https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=1200&q=80',
  FALSE, TRUE, 8,
  '["Water tank continuously overflowing and wasting water", "Cracked or leaking rooftop plastic water tank", "Low water pressure in upper floor bathrooms", "Sediment and algae buildup at the bottom of overhead tank", "Need multi-tank interconnection for extra storage"]'::jsonb,
  '["Rooftop base preparation and tank leveling", "Tank nipple fittings with heavy-duty EPDM gaskets", "Heavy-duty brass ball valve / float switch setup", "Dedicated high air-vent pipe to improve line pressure", "Multi-tank distribution manifold plumbing"]'::jsonb,
  '["Zero water wastage with reliable shutoff mechanisms", "Boosts gravity water pressure in showerheads", "Clean, safe, well-ventilated water storage"]'::jsonb,
  '["Calculate appropriate pipe diameters for optimal gravity feed", "Install heavy-duty tank union couplings for easy future maintenance", "Connect inlet, outlet, overflow, and washout drainage lines", "Inspect watertight seals under maximum hydrostatic load"]'::jsonb,
  '[{"q": "How do you improve low gravity pressure without a booster pump?", "a": "By increasing outlet header pipe diameter and optimizing vertical air release vents, gravity flow is substantially enhanced."}]'::jsonb,
  'Overhead Water Tank Installation & Fitting in Hyderabad | A1 Chandu',
  'Overhead water tank installation, float valve fitting, tank interconnection, and cleaning services in Miyapur, Ameenpur, Kukatpally Hyderabad.'
),
(
  'toilet-repair-and-installation',
  'Toilet Repair and Installation',
  'Precision repair and installation of western commodes, flush tanks, concealed cisterns, flush valves, and seals.',
  'A malfunctioning toilet is an immediate hygiene and comfort issue. From replacing worn flush valve flush seals that waste thousands of liters to mounting new rimless western commodes with wax rings, we ensure total odor containment and quiet, powerful flushes.',
  'ShieldCheck',
  'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=1200&q=80',
  FALSE, TRUE, 9,
  '["Water running constantly in flush tank / commode bowl", "Foul sewer smell coming from the base of the toilet", "Slow filling flush cistern or broken push button", "Loose, rocking toilet commode on tile floor", "Broken flush valve or cracked ceramic bowl"]'::jsonb,
  '["Concealed cistern mechanism repair (Geberit, Jaquar, Kohler)", "Dual flush valve & inlet fill valve replacement", "New western commode installation with hygienic wax ring seal", "Silicone sanitary sealing around bowl base", "Angle cock and braided health faucet hookup"]'::jsonb,
  '["Stops costly water meter leakage instantly", "Completely seals away toxic sewer odors with wax gasket", "Quiet, efficient dual-flush mechanism"]'::jsonb,
  '["Inspect cistern internals or remove existing toilet safely", "Inspect drain pipe flange collar and floor level", "Seat new toilet with heavy-duty wax ring and floor bolts", "Calibrate float level and test dual-flush efficiency"]'::jsonb,
  '[{"q": "Can you repair concealed flush tanks embedded inside the wall?", "a": "Yes, concealed cisterns are serviced directly through the front push plate without breaking wall tiles."}]'::jsonb,
  'Toilet Repair & Commode Installation Hyderabad | Flush Tank Plumber',
  'Western commode installation, concealed cistern repair, toilet leak fixing in Miyapur, Gachibowli, Kukatpally, Hyderabad.'
),
(
  'commercial-plumbing',
  'Commercial Plumbing',
  'Specialized plumbing infrastructure maintenance for offices, restaurants, retail shops, clinics, and gated communities.',
  'Commercial establishments require fast turnaround, preventive plumbing maintenance, and robust fixtures that withstand heavy public footfall. A1 Chandu provides contract and on-call commercial plumbing across corporate hubs like Gachibowli, Kokapet, and Kondapur.',
  'Building2',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  FALSE, TRUE, 10,
  '["High-traffic restroom urinal sensor failures and overflows", "Commercial kitchen grease trap clogging", "Multi-story water supply distribution failures", "Emergency pump breakdown halting building operations"]'::jsonb,
  '["Commercial sensor taps and auto-flush urinal repair", "Grease trap plumbing and line clearing", "Sump to overhead tank commercial pipe lines", "Restroom multi-stall maintenance and fixture upgrades", "Priority response SLA for commercial clients"]'::jsonb,
  '["Minimizes business disruption and customer downtime", "Maintains public health and hygiene standards", "Professional GST billing and transparent service records"]'::jsonb,
  '["On-site facility assessment and problem diagnosis", "Scheduled off-hours work when required to avoid business interference", "Installation of heavy-duty commercial grade components", "System verification and routine maintenance schedule"]'::jsonb,
  '[{"q": "Do you offer service outside regular office hours?", "a": "Yes, we can perform commercial repairs during early morning or evening hours to avoid disrupting your staff."}]'::jsonb,
  'Commercial Plumbing Services in Hyderabad | Office & Retail Plumber',
  'Commercial plumbing maintenance in Gachibowli, Kokapet, Kondapur Hyderabad. Sensor taps, urinal valves, grease traps for offices & restaurants.'
),
(
  'water-pump-repair',
  'Water Pump Repair and Installation',
  'Installation and electrical-plumbing repair of submersible pumps, monoblock sump motors, and pressure booster pumps.',
  'When your water pump fails, your entire household routine halts. We troubleshoot pump priming issues, leaking mechanical seals, foot valve failures, pressure booster pump sensor faults, and automated water-level controller wiring.',
  'Zap',
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
  FALSE, TRUE, 11,
  '["Motor running continuously but not lifting water to overhead tank", "Booster pump fluctuating or turning on/off every few seconds", "Leaking mechanical shaft seal spraying water in pump room", "Burnt foot valve or cracked suction line drawing air", "Water level controller failing to trigger motor switch"]'::jsonb,
  '["Submersible and monoblock motor diagnostic and repair", "Suction and delivery line plumbing with heavy-duty check valves", "Pressure tank membrane calibration for booster pumps", "Foot valve replacement in underground sumps", "Automatic water-level controller sensor wiring"]'::jsonb,
  '["Restores dependable water delivery across the property", "Protects motor from dry-run burnout", "Optimal pressure in booster systems for high-rise showers"]'::jsonb,
  '["Check electrical supply, capacitor, and motor windings", "Verify suction line integrity and foot valve seal", "Prime system and replace defective valves or mechanical seals", "Run full pump cycle under head pressure to verify flow rate"]'::jsonb,
  '[{"q": "Why is my motor running without pumping water?", "a": "This usually indicates loss of priming, a jammed foot valve, or a cracked suction pipe allowing air in. We fix this promptly."}]'::jsonb,
  'Water Pump Repair & Booster Pump Plumber Hyderabad | A1 Chandu',
  'Sump motor repair, booster pump installation, foot valve replacement in Miyapur, Kukatpally, Lingampally Hyderabad.'
),
(
  'home-renovation-services',
  'Home Renovation Services',
  'Complete architectural bathroom and kitchen remodels, pipe rerouting, tile dismantling, and sanitary remodeling.',
  'Transform older or builder-grade bathrooms and kitchens into modern, functional spaces. Chandu brings 5 years of verified field expertise to oversee the intricate intersection of plumbing, tiling, waterproofing, and fixture mounting with single-point accountability.',
  'Hammer',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
  TRUE, TRUE, 12,
  '["Outdated bathroom layout with cramped, inefficient fittings", "Water seepage destroying walls behind bathroom tiles", "Desire to convert traditional Indian WC to modern wall-hung commode", "Modular kitchen plumbing upgrade with dishwasher/RO lines"]'::jsonb,
  '["Careful dismantling of old tiles and sanitaryware", "Fresh concealed hot/cold piping layout with diverters", "Multi-coat polymer waterproofing over slab", "Premium tile laying with laser alignment and leveling clips", "Final luxury fixture fitting and siliconization"]'::jsonb,
  '["End-to-end single point accountability — no plumber-tiler blame game", "Modern aesthetics that increase property value", "Long-term waterproofing security backed by experienced workmanship"]'::jsonb,
  '["Initial site walkthrough and design consultation", "Demolition and neat structural chase cutting", "Core plumbing rough-in and waterproofing application", "Tile installation, grouting, and final sanitaryware fitting"]'::jsonb,
  '[{"q": "How long does a complete bathroom renovation take?", "a": "Typically 6 to 10 days depending on tile choice, plumbing rerouting, and waterproofing curing times."}]'::jsonb,
  'Bathroom & Home Renovation Services Hyderabad | A1 Chandu',
  'Complete bathroom renovation, kitchen remodeling, plumbing rerouting, and tile installation in Miyapur, Gachibowli, Kukatpally, Hyderabad.'
),
(
  'grouting-services',
  'Grouting Services (Epoxy & Cementitious)',
  'Specialized waterproof epoxy grouting for bathroom tile floors, shower corners, swimming pools, and kitchen backsplashes.',
  'Traditional cement grouts dissolve over time, allowing dirty water to seep underneath tiles and cause ceiling leaks in the apartment below. A1 Chandu specializes in high-strength epoxy grouting (Laticrete, Roff, Kerakoll) that is 100% waterproof, stain-resistant, and mold-proof.',
  'Sparkles',
  'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=1200&q=80',
  TRUE, TRUE, 13,
  '["Black mold and discolored grout lines in shower stalls", "Water leaking to the apartment directly below through tile joints", "Hollow, crumbling cement grout between floor tiles", "Stained kitchen backsplash grout absorbing cooking oil"]'::jsonb,
  '["Deep mechanical raking and vacuum cleaning of old joint grout", "Antimicrobial surface disinfection", "Application of 100% solid high-performance epoxy resin grout", "Precision sponge tooling and residue-free hazing wash", "Perimeter waterproof silicone sealing"]'::jsonb,
  '["100% waterproof barrier prevents leaks to lower floor slabs", "Permanently resists bathroom chemicals, acid, and grime", "Colors do not fade, peel, or turn yellow with age"]'::jsonb,
  '["Clean and rake joints to minimum 3mm depth", "Allow joints to dry completely to ensure maximum epoxy adhesion", "Mix dual-component resin with color-matched quartz filler", "Fill joints under pressure and wash clean with specialized emulsifier"]'::jsonb,
  '[{"q": "Can epoxy grouting stop an active floor leak to the flat below?", "a": "Yes! If the leak is through tile joints rather than a burst supply pipe, epoxy grouting forms an impenetrable seal that permanently cures floor seepage."}]'::jsonb,
  'Epoxy Grouting Services Hyderabad | Tile Waterproofing Plumber',
  'Professional epoxy tile grouting in Hyderabad. Stop bathroom floor water leakage to downstairs flats in Miyapur, Kondapur, Kukatpally.'
),
(
  'other-plumbing-services',
  'Other Plumbing & General Sanitary Services',
  'Custom plumbing solutions, balcony water lines, garden spigots, washing machine drains, and pressure troubleshooting.',
  'Have a unique requirement not covered in standard categories? From connecting new automatic washing machines, installing balcony utility taps, troubleshooting water hammering noises, to custom pressure regulator valves, Chandu handles all plumbing needs.',
  'HelpCircle',
  'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=1200&q=80',
  FALSE, TRUE, 14,
  '["Automatic washing machine inlet/drainage hookup missing in utility balcony", "Loud banging/hammering noise in pipes when taps are shut", "Balcony planter tap installation", "General household plumbing inspection before buying or renting"]'::jsonb,
  '["Utility balcony plumbing for front-load/top-load washers", "Water hammer arrestor fitting", "Garden spigot and outdoor faucet installations", "Pre-purchase home plumbing health inspection", "Custom bypass valves and water meters"]'::jsonb,
  '["Customized solutions tailored to your unique house design", "High quality brass valves that do not jam", "Friendly, transparent professional guidance"]'::jsonb,
  '["Understand specific homeowner requirements", "Suggest the cleanest, most aesthetic piping route", "Install fittings using certified materials", "Perform functional flow and pressure checks"]'::jsonb,
  '[{"q": "Can you visit just for small handyman plumbing fixes?", "a": "Yes, no job is too small or too large for A1 Chandu. We value every customer relationship."}]'::jsonb,
  'General Plumbing Services in Hyderabad | Handyman Plumber | A1 Chandu',
  'Custom plumbing repairs, washing machine installation, balcony taps, and water pressure fixing in Miyapur & Hyderabad.'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  icon = EXCLUDED.icon,
  image_url = EXCLUDED.image_url,
  is_featured = EXCLUDED.is_featured,
  display_order = EXCLUDED.display_order,
  common_problems = EXCLUDED.common_problems,
  what_included = EXCLUDED.what_included,
  benefits = EXCLUDED.benefits,
  work_process = EXCLUDED.work_process,
  faqs = EXCLUDED.faqs,
  seo_title = EXCLUDED.seo_title,
  seo_meta_description = EXCLUDED.seo_meta_description;

-- 4. FREQUENTLY ASKED QUESTIONS (FAQS)
INSERT INTO public.faqs (question, answer, category, is_published, display_order) VALUES
(
  'What areas in Hyderabad does A1 Chandu Plumbing Services cover?',
  'We serve 25 major localities across Hyderabad including Miyapur, Ameenpur, Beerumguda, BHEL, Lingampally, Isnapur, Patancheru, Gachibowli, Manikonda, Kokapet, Hafeezpet, Kondapur, Bachupally, JNTU, Nizampet, KPHB Colony, Kukatpally, and Chandanagar.',
  'General', TRUE, 1
),
(
  'Do you provide 24/7 emergency plumbing services?',
  'Yes! We provide 24/7 emergency plumbing response across Hyderabad for critical issues like burst main pipelines, severe bathroom ceiling leaks, overflowing overhead tanks, and broken shut-off valves. Call us directly at 7032270517.',
  'Emergency', TRUE, 2
),
(
  'What are your service charges, and do you provide an upfront estimate?',
  'We believe in 100% transparent and affordable pricing. For standard repairs, we quote a clear inspection and service fee before starting any work. For complex renovations or repiping, Chandu personally conducts an on-site inspection and provides a detailed quotation with no hidden costs.',
  'Pricing', TRUE, 3
),
(
  'What is the difference between cement grout and epoxy grout for bathroom leaks?',
  'Standard cement grout is porous and degrades over time with water and chemical cleaners, causing water to seep into the floor slab and leak to the flat below. Epoxy grout is 100% waterproof, chemical-resistant, and non-porous, making it the most permanent solution for bathroom floor seepage without breaking tiles.',
  'Services', TRUE, 4
),
(
  'Who will carry out the plumbing work?',
  'Chandu, who has 5 years of verified field experience in Hyderabad, personally manages and executes the jobs, ensuring top-tier craftsmanship, clean work practices, and genuine customer satisfaction.',
  'General', TRUE, 5
),
(
  'How do I book an appointment or emergency visit?',
  'You can call directly at 7032270517, send a WhatsApp message to 7032270517, or fill out the online enquiry form on our website. We respond promptly!',
  'Booking', TRUE, 6
);

-- 5. INITIAL PORTFOLIO / GALLERY (Clearly marked as representative workmanship demonstrations until Chandu uploads live site images via admin dashboard)
INSERT INTO public.projects (
  title, category, description, primary_image_url,
  before_image_url, after_image_url, is_before_after,
  is_published, display_order
) VALUES
(
  'Concealed Diverter & Rain Shower Installation',
  'Bathroom Plumbing',
  'Architectural rough-in and trim kit installation for a luxury dual-diverter bathroom system in Miyapur.',
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
  TRUE, TRUE, 1
),
(
  'Waterproof Epoxy Grouting for Shower Stall',
  'Grouting Services',
  'Complete joint raking and anti-stain epoxy grouting to cure recurring lower-floor ceiling dampness in Kukatpally.',
  'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=800&q=80',
  TRUE, TRUE, 2
),
(
  'Overhead Multi-Tank Gravity Flow Interconnection',
  'Water Tank Installation',
  'Dual 1000L tank interconnection with high-flow brass ball valves and vertical air vents in Ameenpur.',
  'https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=1200&q=80',
  NULL, NULL, FALSE, TRUE, 3
),
(
  'Modern Kitchen Sink Mixer & RO Filtration Plumbing',
  'Kitchen Plumbing',
  'High-arc pull-out faucet setup with under-sink waste trap alignment and concealed RO drain connection in Gachibowli.',
  'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
  NULL, NULL, FALSE, TRUE, 4
);

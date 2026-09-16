-- English explanations, additive and compatible with older clients.
-- Source guard covers description, hand, and accepted discards.
begin;
alter table public.problems add column if not exists description_en text;
alter table public.problems_casual add column if not exists description_en text;
create or replace function public.clear_stale_english_description() returns trigger
language plpgsql set search_path = public as $$
begin
  if new.description is distinct from old.description
     or new.tiles_str is distinct from old.tiles_str
     or new.correct_discards is distinct from old.correct_discards then
    new.description_en := null;
  end if;
  return new;
end;
$$;
drop trigger if exists clear_stale_english_description on public.problems;
create trigger clear_stale_english_description before update on public.problems
for each row execute function public.clear_stale_english_description();
drop trigger if exists clear_stale_english_description on public.problems_casual;
create trigger clear_stale_english_description before update on public.problems_casual
for each row execute function public.clear_stale_english_description();

do $migration$
declare affected integer;
begin
  with translations(id, source_hash, english) as (values
('04aa265b-8371-448c-a376-b4fc79a6b63d','3a935dde055512686bc74351fff51e3f13488877c6b39f94004f758e9e5924a8','Discard 5p: wait on 4p, 7p, 8p, 9p (7 copies before accounting for other visible tiles).
Discard 8p: wait on 4p, 5p, 6p, 9p (7 copies before accounting for other visible tiles).
Discard 9p: wait on 3p, 6p, 7p (8 copies before accounting for other visible tiles).
Discard 4p: wait on 3p, 6p, 7p (8 copies before accounting for other visible tiles).'),
('06b88146-a44b-4835-91f3-9b984cd60305','b245f089cb8415ea662bd1b1d40798b2cd3447f09d6589a5e41e5d13427aef45','Discard 6s: wait on 1s, 2s, 3s, 7s (11 copies before accounting for other visible tiles).
Discard 2s: wait on 3s, 5s, 6s, 9s (9 copies before accounting for other visible tiles).'),
('09e3d632-4686-4072-b696-2347de007173','07c3601f8a38586edd94fdd0808a17738b588e98a208e1a2ecb5c21921608466','Discard 8p: wait on 1p, 2p, 3p, 4p (11 copies before accounting for other visible tiles).'),
('0d754d83-f980-46a9-bd91-474684ccd282','7bca7c53c305128bcc6b2d0d993d1bfa60fe5ce8d14a4447b3ba33fd2e80737d','Discard 3s: wait on 1s, 4s, 6s, 7s, 9s (16 copies before accounting for other visible tiles).'),
('165ebbc6-71aa-4424-bd95-c3cbea8af611','a4f9bca6c58f45fdb77aab5968d8938d448d0a004858a28a59e385cb89b426da','Discard 7p: wait on 2p, 3p, 4p, 5p, 8p (12 copies before accounting for other visible tiles).
Discard 2p: wait on 1p, 4p, 7p, 8p (12 copies before accounting for other visible tiles).'),
('16e74d21-1e90-4294-b65f-f9b29d8ed47c','a763d3bec5be915f98197dd9c4f9b47a508d201692a599492b4993ab322115c0','Discard 3p: wait on 1p, 2p, 4p, 5p, 7p, 8p (17 copies before accounting for other visible tiles).'),
('2102dbea-0b58-42ea-8d26-67f1e60256f8','622be32617bd3cf6cd3077a471721ddb9d182a9571f45df87f4b42649a9cecb9','Discard 2p: wait on 1p, 4p, 7p, 8p (12 copies before accounting for other visible tiles).'),
('2237aa48-3d07-4df8-a98d-c82ad7f2f9e0','e5b00a3103dbac23352fc4b81b8cfe4dda1e73aad14b4d2809c1df0ca3aa6f88','Discard 4s: wait on 2s, 5s, 7s, 8s, 9s (13 copies before accounting for other visible tiles).
Discard 7s: wait on 2s, 3s, 4s, 5s, 9s (13 copies before accounting for other visible tiles).'),
('2698d45c-c7a9-4e05-a59e-939b55fa8341','17b3c127348a87060659eaab5fb471b78204492db5de98f4e7b1695c9c16fc69','Discard 8p: wait on 1p, 3p, 4p, 6p, 7p, 9p (17 copies before accounting for other visible tiles).'),
('289b26b3-0753-475c-9b10-2edeebe97fe9','c83ba0165157f7d0a31aa549b6c0a9d96dc33babc1d78f29145433bfaf6c0b6f','Discard 5p: wait on 1p, 3p, 4p, 6p, 9p (15 copies before accounting for other visible tiles).
Discard 8p: wait on 1p, 3p, 4p, 6p, 7p, 9p (17 copies before accounting for other visible tiles).'),
('28e4dd14-cb3c-44f4-9a08-a5cc08db3fd0','a28016b1eadcd1615d682e240a9b95ee9e2b8ee73a5fbec2c7d6f0726e6a53c5','Discard 2s: wait on 4s, 5s, 6s, 9s (11 copies before accounting for other visible tiles).
Discard 1s: wait on 2s, 5s, 6s, 9s (11 copies before accounting for other visible tiles).'),
('29511db0-ead2-4017-98ae-14b62b7d8835','05c53fc15f75f6983f96cea5f4226588c6ba2a2a1b18a8728dfe8007ec7b2653','Discard 7s: wait on 2s, 3s, 5s, 6s, 8s (14 copies before accounting for other visible tiles).'),
('2c86df79-68e2-4711-85d4-d0c4e70f619c','b904a080757e0c88579d926f3bd8989100dc1d4bf4a20c37154473afaaf6488f','Discard 5s: wait on 1s, 2s, 4s, 7s (12 copies before accounting for other visible tiles).
Discard 2s: wait on 4s, 5s, 7s, 8s (9 copies before accounting for other visible tiles).'),
('2ed877e1-8d7d-43e2-8118-19853f3990f9','8d3a1b4efff87746cf48c63902a12c92bde1864d58970da43eef0ace6375472e','Discard 5s: wait on 1s, 4s, 6s, 7s (11 copies before accounting for other visible tiles).
Discard 2s: wait on 3s, 4s, 6s, 7s (10 copies before accounting for other visible tiles).'),
('32f8c90d-4067-4995-b1b9-33e02433bf6f','16f1b6208bad2b9e4b121af8e5314fcc0e0048e94b46e698b31eead7a73125de','Discard 3s: wait on 2s, 5s, 8s (7 copies before accounting for other visible tiles).
Discard 2s: wait on 3s, 6s, 9s (7 copies before accounting for other visible tiles).'),
('34c2620b-f3ee-41fe-9875-e70c9cf4fb13','c36c3697caebc780564316f300e2815a1d3f22d41c41ac1b11bf942dc0edd1b1','Discard 7s: wait on 3s, 4s, 5s, 6s, 9s (11 copies before accounting for other visible tiles).'),
('38848058-a6df-470a-8053-dcc5933c9fe3','371ca3c441b1ce256ac03796449fd495919f391089e9f52c7f8adfaacfe8f47e','Discard 1p: wait on 5p, 6p, 7p, 8p, 9p (10 copies before accounting for other visible tiles).
Discard 7p: wait on 1p, 3p, 4p, 5p, 6p (11 copies before accounting for other visible tiles).'),
('39f38c9d-0c72-4b53-b8c6-8ce6f22ee880','4612312045c3369d11ce2251767af8724583c098a643b8f9b04050e891f44e16','Discard 5p: wait on 1p, 4p, 6p, 7p, 8p, 9p (16 copies before accounting for other visible tiles).
Discard 2p: wait on 3p, 4p, 6p, 7p, 8p, 9p (15 copies before accounting for other visible tiles).'),
('446e4495-8642-410f-a6f1-8aec3ae84220','8527678e415b61ecc46d94542cdf710f422ecf2b78a654ea7f38c62ef33da644','Discard 3p: wait on 2p, 5p, 7p, 8p (11 copies before accounting for other visible tiles).'),
('4a80ca62-969c-4873-a933-3d48d02f9277','1f939d57a164a37a72463073530d1bba7e2708591ae182a9337fbc6429be8bd7','Discard 2s: wait on 1s, 5s, 6s, 7s, 9s (14 copies before accounting for other visible tiles).'),
('4ace8ddf-dc3f-4995-a728-1b85c948ff39','b23d7e57e2a79a1a9d668dae785e52c3255d9953fed447e005e5f07d6ecbf4be','Discard 9p: wait on 3p, 4p, 5p, 7p, 8p (9 copies before accounting for other visible tiles).'),
('4e340555-b8ae-46e1-9a5e-33f982896fbe','b7e32ca98e973a41d0ffef0b851bc02af9ee2d7a4ae64ec5b8446e24a283c1e3','Discard 7s: wait on 2s, 4s, 6s, 8s, 9s (13 copies before accounting for other visible tiles).
Discard 6s: wait on 2s, 3s, 4s, 8s (11 copies before accounting for other visible tiles).
Discard 3s: wait on 4s, 6s, 7s, 8s, 9s (11 copies before accounting for other visible tiles).'),
('598f68e2-9f80-4894-a245-edade6401cdf','f7d2b75778373253d1c1c6dbc24e1345321b4002b40fa7c8b4e6b20e01d45542','Discard 7p: wait on 3p, 4p, 5p, 6p (10 copies before accounting for other visible tiles).'),
('5d9e82a0-a103-4358-bf43-ed74123aaf63','1214ec822eb5ed2ab34f1ff2d73a246c0ea39d5e81370568f07f2e9fc1d3dd7e','Discard 4s: wait on 2s, 3s, 5s, 6s, 8s (13 copies before accounting for other visible tiles).'),
('62b98e6e-03f3-4813-8c77-046b3d4963a7','a9e3078513bc646b527a1a6c0bbf1ba868d867dff8975286f5f4685286fbdc17','Discard 4p: wait on 3p, 5p, 6p, 7p, 8p (10 copies before accounting for other visible tiles).'),
('692022bd-1496-468d-9b9b-0cae6ba036d8','8d15bc9338dc5e89148d336d46096d17ea97861d5510be918bf2491f2dc2b60e','Discard 5s: wait on 2s, 3s, 6s, 9s (12 copies before accounting for other visible tiles).
Discard 6s: wait on 2s, 3s, 4s, 5s, 8s (12 copies before accounting for other visible tiles).'),
('69a60bbd-18dc-4a6d-ab18-24e21ad11a63','bcc4da3dad434ceccfc5619155761dd0082783af3e14d77d1a0874fcf6101424','Discard 7p: wait on 1p, 4p, 5p (9 copies before accounting for other visible tiles).
Discard 3p: wait on 1p, 4p, 6p, 7p (11 copies before accounting for other visible tiles).
Discard 6p: wait on 1p, 2p, 3p, 4p (9 copies before accounting for other visible tiles).'),
('6dbc9f9f-ede1-44f8-8e75-e21176cad42b','f2a12f9a84a47eca444215b917ecddf4312bc2388bb36b944286797882d972ca','Discard 1p: wait on 2p, 5p, 6p, 8p (11 copies before accounting for other visible tiles).
Discard 4p: wait on 2p, 5p, 6p, 8p (11 copies before accounting for other visible tiles).'),
('71117606-bfce-4be6-9e41-9f3f946a1034','3bc4d71b85fc35daf0995ed946d17f1facb80b1299f7843455a51ff3f8ebd5b3','Discard 2s: wait on 3s, 5s, 6s, 8s, 9s (15 copies before accounting for other visible tiles).'),
('78b057f6-2b16-40cb-9ff9-23f46b4e170c','578995d60d2b6d174724277954fa5aa0bd706a2b0e87ebee0230854a9bf82be9','Discard 9p: wait on 3p, 5p, 6p, 8p (11 copies before accounting for other visible tiles).'),
('7f02ab3c-4f66-4024-937d-87e4a623b6cf','3de449e3b29d26eb266b4bce926591c5b250598a54e210e37a8ed465c201485a','Discard 1p: wait on 3p, 4p, 6p, 9p (11 copies before accounting for other visible tiles).
Discard 2p: wait on 1p, 3p, 6p, 9p (10 copies before accounting for other visible tiles).'),
('83d9bf51-4dab-4d29-a6ee-53c4bd7203f0','f707a17fe689321d41abb47fa3dfef222d0859236028920965a2ca30a1cb6552','Discard 6s: wait on 1s, 2s, 3s, 4s (9 copies before accounting for other visible tiles).
Discard 3s: wait on 1s, 4s, 6s, 7s (11 copies before accounting for other visible tiles).'),
('8518e4b0-51ef-481d-bfd3-823ed6296fa2','aafc4d2e53d78b119d4c18e226f81ee20f124d69be8c487c29c94fb025293ff1','Discard 6s: wait on 2s, 4s, 5s, 7s, 8s, 9s (13 copies before accounting for other visible tiles).'),
('86e26199-9233-4915-a3a9-c4789497558a','f2c3bc8ef36428ba11a4f4ce1acbd28be4f5a5c77206b02d80cc23670b402fab','Discard 3p: wait on 1p, 4p, 5p (7 copies before accounting for other visible tiles).
Discard 2p: wait on 3p, 4p, 5p (5 copies before accounting for other visible tiles).
Discard 4p: wait on 2p, 5p, 8p (7 copies before accounting for other visible tiles).'),
('887fd0b9-0d12-4f43-90c5-01aedad5593f','41333a209802d6dbb494926dc074001f583b4d6d51c4bec6af0e2cde76f87b51','Discard 5s: wait on 3s, 4s, 6s, 9s (11 copies before accounting for other visible tiles).'),
('951fc144-37aa-4473-b780-3e2a2c0fbaac','d4c25078a9b8333a05e3be17356e941b5ae23ef7af8a4c20a262633703b009fd','Discard 4p: wait on 2p, 5p, 6p, 7p, 8p (12 copies before accounting for other visible tiles).'),
('95e9af63-4398-495d-be9a-4a0c295b611e','0f97c3fe0a52a63749e9af799545d777cb808fbdebb13a7497a929975d137f76','Discard 8s: wait on 2s, 4s, 5s, 6s, 7s (10 copies before accounting for other visible tiles).'),
('a09bf544-0fdf-4d60-9b36-6f87ad5691bb','eb36fc7a090067ab28a3edb5ce9c595be1f76fafae94b052ebb2ae1ee48bbc76','Discard 9s: wait on 4s, 5s, 7s, 8s (9 copies before accounting for other visible tiles).
Discard 6s: wait on 4s, 5s, 7s, 8s (9 copies before accounting for other visible tiles).'),
('a0bedfe6-2524-40b4-8159-dabb5e2c308a','477470ff33292f0f66cff10d28a8203504cc7d23a6a713479fd72e5b10e03187','Discard 1p: wait on 2p, 4p, 5p, 6p, 9p (13 copies before accounting for other visible tiles).'),
('a4f01577-d130-48ae-885f-ac1a592a0e38','b1ec178088a6f90871b200618810dbace59ebb4a564ac466f9a85545250b9e75','Discard 5p: wait on 3p, 6p, 8p, 9p (12 copies before accounting for other visible tiles).
Discard 8p: wait on 3p, 4p, 5p, 6p (8 copies before accounting for other visible tiles).'),
('adf613b8-2683-4d8c-9b17-1d9313ef3b44','0ecb70388f2ed87093a1c93be342cc8ec7ada8417890de01f2f7fa468ead7367','Discard 1m: wait on 2m, 5m, 6m, 8m, 9m (15 copies before accounting for other visible tiles).
Discard 4m: wait on 2m, 5m, 6m, 8m, 9m (15 copies before accounting for other visible tiles).'),
('b17256f5-ff87-47bc-a6ea-af4c4b38266c','4fdf3ab190a1b782e5d6a2782ff093f22f3a21a5a6a42f102499e198783ad477','Discard 7p: wait on 2p, 3p, 5p, 8p (11 copies before accounting for other visible tiles).'),
('b17a650e-58f3-48c2-82bc-eede6ed88548','4dec61adfabdf2ce24e720d084dd6f404735b41ab8a14c1850e31ed4dd85b3fc','Discard 3s: wait on 1s, 2s, 4s, 5s, 7s, 8s (17 copies before accounting for other visible tiles).'),
('beb32bcd-1079-4ac3-ac1d-fbe067271456','9dbcce28d24e592b96ecf1d42eefa90ed5172614d0bb8725056c5ed9127e6706','Discard 1s: wait on 2s, 3s, 4s, 6s, 7s, 9s (13 copies before accounting for other visible tiles).'),
('da561c3d-e78a-41fc-8d54-15c8961f9888','cdca5b789eac8fefef18b5bed2b1a3688241defb338dd7d9bd72cc0c9210cbcb','Discard 9s: wait on 1s, 2s, 4s, 5s, 7s, 8s (17 copies before accounting for other visible tiles).'),
('da567cb0-1e7e-48d6-a827-e241553f5408','09be272460e23235bf4281353dd6891136f69b1a49b7033d445bde156c720445','Discard 6s: wait on 1s, 2s, 3s, 7s (12 copies before accounting for other visible tiles).
Discard 2s: wait on 3s, 5s, 6s, 7s (10 copies before accounting for other visible tiles).'),
('e38601ab-38dc-4e79-a6b5-927eec04b8e1','71d07ff381de296b8056283e74526707c661366ba7e56b3825e245a1660d26a3','Discard 9p: wait on 1p, 2p, 3p, 4p, 7p (11 copies before accounting for other visible tiles).
Discard 6p: wait on 1p, 2p, 3p, 4p, 7p (11 copies before accounting for other visible tiles).'),
('e4e49304-fa3f-47a1-be17-dbf3eceec18c','8768ce3b7ac6e4eb77d1326ab44e2a51937dce43aa70947d4c1e8320e6fcf599','Discard 8p: wait on 1p, 3p, 4p, 7p (11 copies before accounting for other visible tiles).
Discard 5p: wait on 1p, 3p, 4p, 7p (11 copies before accounting for other visible tiles).
Discard 2p: wait on 1p, 3p, 6p, 9p (12 copies before accounting for other visible tiles).'),
('ece40e43-b4e0-4286-9c70-0c6bad9ced0b','e33dbfd0386ff06d0f9bece84348efd2ae28383079603537b68b9b2f5342f5c9','Discard 7s: wait on 1s, 2s, 3s, 4s, 6s, 9s (16 copies before accounting for other visible tiles).'),
('f92ca19d-c3fe-4fdd-a732-b901009b2c38','312b611c651e4de7fede1c3ebe0ad0bf633373136b408dc9865ee2b9e8f82406','Discard 5s: wait on 1s, 4s, 6s, 8s (10 copies before accounting for other visible tiles).
Discard 6s: wait on 1s, 4s, 5s, 8s (11 copies before accounting for other visible tiles).
Discard 8s: wait on 1s, 4s, 5s, 6s, 9s (14 copies before accounting for other visible tiles).')
  )
  update public.problems p set description_en = t.english
  from translations t
  where p.id::text = t.id
    and encode(sha256(convert_to(coalesce(p.description, '') || chr(31) || p.tiles_str || chr(31) || p.correct_discards, 'UTF8')), 'hex') = t.source_hash;
  get diagnostics affected = row_count;
  if affected <> 50 then
    raise exception 'English migration source changed in problems: expected 50, updated %', affected;
  end if;
end;
$migration$;

do $migration$
declare affected integer;
begin
  with translations(id, source_hash, english) as (values
('01f0158b-cea5-4e8f-8a77-dd7339514ea2','6f473be1bebb33a52020430c399c0db178e4f98bdcce4a387472ba31f2b7270e','Discarding 6p or 8s gives a flexible one-shanten hand. Imagine the final wait after drawing 2m or 5m. Discard 8s to secure All Simples while retaining the chance of Twin Sequences if 5p arrives first; the original analysis rates this choice highest in expected value.'),
('05689c60-de25-4440-a232-5b8e496412d5','378c985e7d8b22fedd5c3f97a1ac658eb8565fe1e14ddd041c67ed5e2343ea0f','Discard 3p for the widest improvement options. Breaking the Characters shape loses either the 3m/6m or 5m/8m acceptance. The original analysis favors this discard for reaching ready, winning, and expected value.'),
('075dbdbc-9834-4a9b-954e-970f3876537b','d2b13485a6ea9f5e79ed9a16e0b9082d65fff9f0267cefdd092d8b2e92a2f555','The 9m pair cannot become a two-sided shape. Discard 4p to retain 4p6p8p as a double closed-wait shape and maximize the chance of finishing with Pinfu.'),
('0899f1de-5f8e-41f4-9b84-ba9c96d27ed9','e938efaa01932660b3e63a5dfab4956ece2546e765e4bd0b1141757d187c767a','Discard 1p for a flexible one-shanten hand. This gives up Full Straight but allows Pinfu on many draws. Discarding 7s can produce the ideal Pinfu plus Full Straight, but that narrow best case is less likely.'),
('08e57967-f884-4dbd-b571-4fd5c9977c7d','cdea782d48d2bcee4439355bc6e40486fba1e01c86bbeef63daea7d500a9f729','Fix 8p8p as the pair and discard 9p. Look for tiles connecting to 4s or 4m: 2s–6s and 1m–6m can bring the hand to ready, although several of the resulting waits are poor.'),
('08f1ef2a-1f39-45f0-aaec-b8d8f7931d1c','b0b1f2de11d283463ff1c07c07707c7cf554a791e25496af25a86ebf85abc355','Discard 8m for the widest acceptance. Try to preserve this flexible shape until you reach ready.'),
('0ac31b7d-c30b-418b-9f1a-da8cf5a3b291','849ed2ae672ed4b0e912ad0c2817507d35dd59afbdba710d8c9aed9682ef7850','The Circles shape may look like a combined two-sided and closed-wait shape, but 8p is less useful here than 8m. Keep 8m: drawing 9m can create a wider one-shanten hand.'),
('0d9f9a16-7ae6-41e0-bf78-a2107419d145','ed34c71574051a20ebfe08fdf9a4abadd6716089ea3d128ee7dcb419c3c93bf4','Plan for two sets in Circles while Characters and Bamboo provide two sets and the pair. Discard 7p, considering the ready shape you can reach by drawing a red 5p.'),
('0e5c0816-22a8-4fe4-ac07-30e2553ce9b3','4b4223e546a4ee67ecdcfd6bed3f305816f7ac1ced1fd311bc2bd034e7b52045','Discard 8s. Discarding 8m accepts the same number of tiles, but the eventual waits differ because you already use 6m. Do not force Twin Sequences at the cost of discarding a red 5s.'),
('106a896a-fced-4a8f-80a0-87a5e8e9a799','0e3cca7dde03af4699844f6d2b809f9e5d0b8e73c5275d82eb6c88127a96aeb0','Compare the isolated 7m, 4p, and 7s. Keep 7s for its three-sided-wait potential. Between 7m and 4p, favor the tile that leads to a wait nearer the edge of a suit. The 1p pair can also make the related 4p double-pair wait less obvious to opponents. Discard 4p.'),
('109fcee7-212d-4fd1-b7ee-3a29b4b4b66e','9c6586512545f35280ccd66426caf48a0eff72f896dd3b853290d73cb3ab6a60','A standard winning hand needs four sets and one pair. Keep the strongest five blocks and discard 7s.'),
('12abf41f-c169-4f3a-a6a3-eaff39713897','d1cec287016748e058836e7fde1ffbe0d6578c828f6feb2075f9698a00bf70c5','This is a case where overlapping acceptance is worth keeping: dora, All Simples, and Mixed Sequences potential make the Characters blocks valuable. Dropping 2p3p loses four improving copies compared with dropping 3m4m, but preserves enough value to justify it. Start with the more central 3p.'),
('17fbf4ba-a48a-4fc7-bba5-c333456901b2','3ebebca9e8aa6082d0178fa16bbd51d57359294a85e679c7e851c83f5a6716be','You have enough blocks, but the 1p2p edge shape is weak. Keep isolated tiles that can form a two-sided replacement for it. The isolated 7s is better at creating that replacement than the extra 3s, so discard 3s.'),
('1e3fe387-038d-4605-99ba-04940b25ca38','49964552bd22a90b673462f973699c5759d3cef90f9d419cd8d0e2ec131a8069','Discard 8m for a flexible one-shanten shape. Fixing the dora 6s pair by discarding 5s retains the dora on a 4p/7p draw, but can leave only a four-copy double-pair wait.'),
('209b1798-44db-43ff-95a0-c630db3f5b4c','828e5f6fece5847b674e0d4d85c8c275c94b5209872623d79043eaa8d54856b9','Discard 8m. The overlapping Characters shape still accepts 7m, so this discard does not lose that useful draw.'),
('20d36f83-caee-457a-95e7-9875f728760f','e7a05d143024825bd9d80290d4865cd19535a08c7c0d23b977c4ba8f116da456','Preserve the Bamboo shape: even drawing the closed-wait 3s can lead to Pinfu ready. Discarding 8m and 2s accepts the same number of tiles, but 8m best preserves Pinfu in this hand-only comparison.'),
('24d62aec-633b-4158-8aa6-cb243039aebb','f9dd6a45fc983be495d39083f235819642ab9c245cdf2c50cab3dfccc01c01e3','Fix the near-terminal 8s pair and discard 9s, looking for connections to 6p and 4m. Keeping 8s8s9s allows a 7s draw to create a 6p/9p wait involving the dora, but does not guarantee winning on that dora.'),
('257144d9-9005-43fa-a73b-b0d7649c017d','3364c85dd8a9f0ee9e5d9c42aa1110c511e0e2f3585e0f7963a242311c73fad1','Discard 3s to maximize acceptance. Drawing 2s first can also add Twin Sequences.'),
('2735d4a9-b61d-4a6f-b06f-ec2c4b7d9b66','aff8665438b7f580a587586f2ac86acc48dd14955e8860214c5a6eec124551e9','Keep the option of calling Pon on the dora while preserving a good final wait. Discard 6s for a wide, strong shape. Discarding 2s to form 2s4s6s would prevent that dora Pon from immediately making the hand ready.'),
('27f022cf-137b-4388-a4f2-aa700dd530b8','b103d22756d6248dc01bee58bd30bceeba2bcd72a66594ba003d37d2db4ccfd3','Discard 3p, retaining 2p3p as a two-sided block and 5s7s9s as a double closed-wait block. Drawing 8s discards 5s but still gives Pinfu. A later 7s or 9s draw can change the pair.'),
('28aa24fc-9c8f-43c7-b2c2-8bffe137ce22','243e24a1a77ffb835ae0ec12aa3cea757f3f97550fe24d7827e5e3f277eb8ce3','There are six blocks, one more than a standard hand needs. Remove the weak 8m9m edge block. As a basic shape comparison, two-sided blocks are stronger than closed blocks, which are stronger than edge blocks.'),
('2b6a22ca-b76c-4137-817f-78edb224d776','84a41d896abdbe7e239b68cc789004fc12ace9139356c9c43cb7b59ec80ff143','Discard 4p to preserve routes to two-sided ready and the possibility of Mixed Sequences.'),
('2bcd54c7-39d4-45dd-9508-730b64e681d9','8f9afce2d4e4749d4b1e0318b3054ed28435ed6982f4709a27881df24bf54963','Discarding 8m or 5s gives the widest flexible one-shanten shape. Prefer 5s to fix the dora 6s pair. If 4s arrives later, it can replace 1s to pursue All Simples.'),
('2d4a183e-d7d9-40bf-ae00-22a19177569c','96384be4bb7066724cd46e369efb8ce60dae9d9922ed0219d7e6708abc68ed4a','You could discard 5p to fix 4p5p, but four pairs also leave Seven Pairs two-shanten away. Drop the 2s4s closed block, beginning with 2s, and retain the chance of a flexible one-shanten shape on 5m or 8m.'),
('2d679587-5cde-47d8-8d1f-fe9b6d0dafbf','1048a5c86a4e521a6da1e01b2882d0b944c8771193d3b7c9c29c00ce921798f9','Discard 8m for maximum acceptance in a flexible one-shanten shape. This preserves a two-sided wait when the hand becomes ready.'),
('31171d94-ba11-4fad-aaa5-40bfacb75883','23607854085ac06cc14ab19e6c7764d8236c6edd60cab791d4ccabdbd6ca1f92','Discard 2p. This choice has strong acceptance and keeps Mixed Sequences potential. Riichi with one dora is already a useful outcome.'),
('31533e05-6d57-4a13-be89-14a4ab487505','2efd0212822192c191954e460c782c77826ee3994f606a2c2b7e05339d574099','There are six blocks and four pairs. Keep the pairs to retain the Seven Pairs route. Drop the 2s4s closed block, starting with 2s so you can still use a red 5s.'),
('3abb1982-49d6-4c7c-a779-559098099b4b','5389cc7140310ecb369f36c36b56f759989effede240f4ddf0cecca5f31e08f0','Several factors matter here: shape, acceptance, and hand value. Discard 9s to fix 6s7s8s as a set. The original analysis favors this both for Mixed Sequences potential and for the eventual ready shape.'),
('3c15270d-ef15-4b77-af5e-aecce60bb119','5c33146dc425c0f3c96ae266b8971e484fcbcfbf27616f063fce527819f9aaa1','Discard 8s. Discarding 3m, 7s, or 8s accepts the same number of tiles, but discarding 8s removes ready paths that would break Pinfu, such as pairing the extra 8s. Preserve the combined two-sided/closed-wait Characters shape.'),
('3fd68f65-7856-4c30-93ab-2057afde1d45','3426735a15b7a96c52b8fcba5a59abc7bbd15d1d00940c483bb5917290474466','Think about how easily each isolated tile or extended set produces two-sided ready. The 7m and 6s7s8s9s shapes offer more such improvements than 4p5p6p8p, which needs 7p. Discard 8p.'),
('42bb1334-460b-410f-8e95-2a2468b3d197','c57e590d4ee3091ae93b989c807c32d9551d272b6f5d615b1a6de80cdfeb9b0e','Discard 8m and keep 1s: drawing 2s connects 1s2s3s4s, allowing a two-sided pair wait on 1s/4s when there is no fixed pair. Retain 3p as a seed for better shape changes.'),
('42f70700-68be-49e8-8791-7a4e3e198311','05c298175e46e171d459a046990b7e4d2aef869ff306363eb78b48795e1cedc1','Discard 5m. Keeping it offers relatively few especially strong draws, mainly another 5m or 6m. There is no need to rush into fixing 4s5s as a two-sided block; consider the changes available after drawing 2m.'),
('43b24d7d-6023-4434-befd-1c7dd5a72669','776f715797df40e5a3f7cb96260973a25753b1818e82cd0fab98b73ed6a2238a','Discard 1m and look for connections in Circles and Bamboo. Keeping 8m preserves the possibility of Full Straight.'),
('4421c275-28de-44bf-9110-74242dc3fb61','a0bd30cee1b2cf377cce647145b0357bb26fed90d99055d56d9fdfba47424fe4','This six-block hand is an exception to immediately dropping an entire block. No weak block stands out, Mixed Sequences remains possible, and there are three pair candidates. Discard 4p while keeping all six blocks for now.'),
('44fd3528-2956-4eda-9ba4-7cf9736d022d','1c69ca696e5d29caae42f61ff37e04be2bdb87821cc94d3584b22c528d2d3dfb','There are six blocks. Remove the weakest one, the 8p9p edge block, instead of damaging a two-sided or closed block.'),
('48cfcd61-7f60-4af3-a750-43d08ddeb3a3','efd6250d3f84ef350709ea73bcc4b5ca9edc947aba4aaedd6e7cb6dc56ae3837','Three sets and a pair are already secured; the missing piece is a two-sided incomplete sequence. Although 6s7s8s9s is four consecutive tiles, some improvements such as drawing 8s are awkward. Discard 9s to fix 6s7s8s as a set.'),
('4ca6b25f-7214-46f4-b4ec-7a74afc44efd','efaa2fa61f5e125d30d1a4b51ded4b6d65db2e95558a0042745dc87b2bc9c7c1','Discarding 7m or 7s gives flexible one-shanten. Compare the final waits after drawing 2p or 5p. The Bamboo shape gains Twin Sequences only if 6s arrives first, because Bamboo-ready hands otherwise favor the 6s/9s wait. Discard 7s.'),
('5126d061-d117-4261-89e5-f364ea0f9308','8999b712dc6adb3e78bc7f5c19596399626502919d12fe5a74eb85714ce4e721','Discarding 7p maximizes immediate acceptance but often produces a poor wait. Compare discarding 5m and 5s by how well the hand can recover after an otherwise missed draw; the preferred answer is 5s.'),
('5457e298-061a-4ab2-bfcc-47e6d7c1139b','60cbb3c8fcd68b393702e2d167f7f489688fdd61457d8575e425e7bf6f2c1900','Both 5p and 8p are expendable. Discard 5p first, considering what happens when the Characters shape or 5s6s develops a pair candidate.'),
('54de1e31-31f2-4a0e-a38e-cb65d5e50c07','bd5b5dc2c97475c0c9ba95bcf39ff907f700292270531233879e05f4051ca8d8','Discarding 8p or 7s gives flexible one-shanten. Both have similar All Simples prospects, but keeping the Bamboo shape adds Twin Sequences potential. Discard 8p. If 4s arrives, consider replacing 7s to widen the hand.'),
('561247b3-1040-4ed1-a1e3-46ca88159167','5cbddc9c285b5d6645578c0dfbe0b0e4956ed56a356b9ebad4a0116be460f3b3','Compare favorable-shape improvements: the Characters block has five tile types, Circles has four, and Bamboo has only two. Discard 6s from the weaker Bamboo sequence-plus-pair shape.'),
('5817ca89-4beb-4bb3-a2a6-fe95ef3debb9','85378ce3bda1b67eae8b5f87ad1239e31d3bdac4e7a6b6d2db3bf81b701d3864','This is an exception to preserving two pair candidates. Discarding 2p, 4p, or 6p has equal acceptance, but keeping two pairs is likely to produce ready without a yaku or dora. Discard 4p to favor Pinfu.'),
('5d201371-449f-46e8-a906-ea1487900681','131607807ea2ac6447359fd6ac61752e752b6d373e968a7826d337749feb3b96','Compare the near-terminal 1s1s2s3s shape with the isolated 4m. Here it is better to keep 4m for connections and discard 1s. This conclusion is specific to a sequence-plus-pair shape near the edge of a suit.'),
('5e320f7a-2513-495f-b9c0-663cd6abd50e','3460508b8638941d6b3819285e75e4220ee7371224abb51c27947ffe3be75845','The Bamboo shape accepts 3s and 5s and can supply two blocks. Characters can also supply two. Keep both isolated Circles tiles as strong seeds for the remaining block and discard 9m.'),
('5f1b91e1-25aa-49d2-b0aa-c9abeafb0a3b','1c2dd0f331a1e4be75c32dfdbcbc4146aaa22458e1cd4e1209022e9e69514c6b','Discarding 8p or 5m accepts the same number of tiles. Keep the Characters shape: drawing 6m first can add Twin Sequences. Discard 8p.'),
('6066a439-56c5-40bc-8c58-d410454a0311','3abb91f558ddb5dfc2fac49d43035c0ed2834b907f5c1f71fa0bb075b04dfead','Discarding 3p maximizes immediate acceptance but often leaves a closed wait. Prefer 6s for the quality of the final wait. Be ready to reconsider Mixed Sequences in 5–6–7 if 6p or 7p arrives.'),
('60cec172-2ac1-4f51-a8ba-580459313518','dc1e262874038debecec52e00049fe3a1bf6bb513e4d00b5a3f9eb442cb00918','Discard 8s for maximum acceptance. Discarding 8p has an attractive best case after drawing 6s, but gives up 18 improving copies compared with 8s in the original analysis.'),
('61b86879-d8c6-4621-8c5b-8e59ead7585c','a75a3bfc74dc6cb7be9d058d8ba5d97a0db24d72aa6590f5e3aa4625d65e2d68','Compare isolated 1s and Red Dragon. The hand has enough value but needs a reliable yaku, so pairing Red Dragon is valuable. The 1s adds little because the hand can still use 2s and 3s without it. Discard 1s.'),
('635bebc7-17dc-453b-9d36-cd7741cfb137','34c9e59dd0b41c504c03677b386c9e0ace6ac05114b0170d29a41c8cfe00c624','There are six blocks. Remove the weakest block, 1p2p. An edge block has few ways to improve, so it is usually the first block to drop.'),
('64b07ef3-95ed-42bf-a8ca-2027e13705ec','cbcdc8ef988df614f09f28fb4b9b8fa4de4bedf3a20d36256feb27bbac1a99cc','Imagine the ideal ready hand with the dora 9s pair: 2m3m4m / 2p2p2p / 7p8p / 6s7s8s / 9s9s. Work backward from that shape and discard 1m.'),
('6587cdb8-d144-490d-8877-a8beceb14b9b','050c66901ff1758b0ddcafaaf521d7e9695c04a097dd039bb152ff2d31460900','Set aside a completed 5p6p7p and compare the remaining 2p2p3p and 5p5p7p shapes. Discard 7p for flexible one-shanten.'),
('66c7eb83-f8c7-452c-9f05-48d356f4d54b','68f3f5d5110bb1b981c07974acbe182a8344439ec2a02a6329a8442bf370d4ca','The Circles shape supplies two sets, so compare connections to 3m, 7m, and 6p. Keep 3m for Mixed Sequences in 1–2–3, and 6p for a three-sided wait after drawing 5p. Discard 7m. Drawing 1p can still allow a closed 5p wait.'),
('690080d3-1c7c-4cb9-b114-4d8657d195b5','2e4f2d241fa0e2a4aa52383df5107c6e1f8448c0ada94cba8a83ef96fc045d9b','Keep 7p8p8p flexible so it can provide either a two-sided block or the pair. Compare Characters and Bamboo by their final waits, All Simples, and Twin Sequences potential. Discard 9m; drawing 8m into the retained Characters shape would otherwise be weak.'),
('6c7ae3dc-b33e-45a9-882c-57df0096b384','e8f2f4c92a56254c85a774bc1e5dfa21502f907f576e8850fbc038c1805673e2','Discarding 8p or 5s maximizes acceptance. Prefer 5s to fix the dora 6s pair. The current shape has weaknesses, but useful changes include open All Simples after 4s and flexible one-shanten after 2m or 5m.'),
('6db3cb0b-e30a-4173-956d-4d2f2748c5db','b0c6a10938a6e4a9a2ab0ff8b257405bdd56a5aae03a0882cf01f08e088a3aa6','Discard 9p. Calling Pon on the dora can produce ready on 4s/7s, so the Circles tiles only need to supply one block. Keep the structure that supports that plan.'),
('6de6d2cf-cd3b-43a2-9279-d79faa4dffa2','5cfd0dfac448e83d661f3cd6ead377c75a6855d5349635d9f295ab0d521975e5','Keeping the Characters shape offers flexibility, but discarding 8m preserves Mixed Sequences in 6–7–8. Besides 6p and 6s, draws such as 3p, 4s, and 5s can create one-shanten shapes with that possibility.'),
('6f9ae442-5bd3-42b6-9a00-c41120ac498d','ee635498706385a96afd100e204ee6f8978ddd71ec5f286f2a58e477a005f253','Drop 8p9p. Preserve the route to a closed hand with Riichi, All Simples, and Pinfu rather than sacrificing that value for the extra block.'),
('749fdd6a-c73c-4348-b6cc-e4441a730234','23a384b8ad8d32fb72c396146fb7c14b44caeaddfa2d5f61840f0d8ad5fda134','Discarding 2p, 8p, or 4s accepts the same number of tiles. Keep 2p4p6p8p intact to make Pinfu more likely, and discard 4s.'),
('75393c36-cde1-4495-8dec-9af2372237dc','38480240fa81c726fddae68a634a4170df002cbb96d85223fb94ff4b292b4d53','A red 5p is tempting to keep, but maximize the number of draws that reach ready. Discard 9m.'),
('82cd04c5-48ac-4ae7-96e5-af60c44f1670','6871d3c99257a9de9029855e229b5ac382c61272a6e1545d14aa56e53835a008','Discard 5s and declare Riichi on the five tile types 3s, 4s, 6s, 7s, and 9s. Discarding 8s guarantees Pinfu but leaves only 3s/6s, losing ten available winning copies in the original analysis.'),
('85531f0c-f4ee-4d34-8340-a32a0d0589ed','26ab0a9408d907fcb3953630c7d6e3e8aec9e2d6712d5a732e96d05511320d4e','Discard 4p. Keep 7m8m8m flexible as either a two-sided block or the pair; many Bamboo draws then lead to a two-sided ready hand.'),
('8626db82-7851-4991-ae89-94607fc133dd','9ddb8dc3076fd8157a8658651cff6a869064c269bf32218b818eb631dc37bee3','Compare 3m, 7m, and 3p. Keep 3m for cases where drawing 1s or 4s means 2s is no longer the pair. Keep 7m for a 3m5m7m shape after 5m and possible 6–7–8 Mixed Sequences. Discard 3p: even a 4p connection creates overlapping acceptance for 5p.'),
('86898e3a-c543-4ebe-937b-60c7829e6080','8ab09ef44c996d1a4f35dbbd96529d96c7007615d64462b4d5801eb3f66427d1','Five blocks are already available. Find the tile the hand can do without: 2s.'),
('88d6e6cd-577f-4467-8058-2c722aa510aa','24f1e655b8e98d0c632c974895097fefd756fb33017bdb05812be89c76eeb977','Choose among 7m, 2p, and 9p. The Circles tiles can accept both 3p and 8p through separated closed-wait shapes. If the plan is to call in Circles and then use Red Dragon as the yaku, discard 7m.'),
('8d08baaf-ec20-4aed-ac6a-89ce6ca3d4ba','47d316e321b347406b1e6851442237718a31942a8f7372e3e866917584d29d8e','Keep two pair candidates. Discarding 7s rather than 5p accommodates both red 5p and red 5s and keeps the more favorable near-edge two-sided wait.'),
('91004a9f-afbd-41c2-91e7-eeda05c85c1d','566c9a963b1478e00da5c788b2f94b34cacb6f435a9a44d28ceb62250d2f1c45','With exactly five blocks, compare the number of pair candidates. Reduce three candidates to two by discarding 4s; this maximizes acceptance.'),
('91635b43-0019-47c9-af00-1acf8bb32fe7','34c4f842582168a82c3e3f4eec77c6aca2a3fd73b27b1ebbfddc635c4506c547','Discard 4s to maximize improving draws.'),
('93fb4842-1b8c-4062-9a35-31c24c33c158','757d94686a8f525e94831a4f3193390891b1612d1ff525232da3ca5a52b38645','The hand needs another block, so compare 7m, 3p, and 7p. You already have enough pair candidates and want a two-sided shape. The 3p next to the concealed 2p triplet is poor at making one; even 1p and 4p draws are awkward. Discard 3p.'),
('96a2971e-20de-4052-9669-e557191075ba','baba1cbcfa43bbdf966cda8df01627557375d45a26b68f76b1ceeae6a404dab8','Discard 8m for maximum acceptance and the highest expected value in the original analysis. Keeping it by discarding 8p has an attractive best case after 6m but gives up 18 improving copies.'),
('988be077-c09d-4050-b107-1e73fc2c0207','6fbc35850c9e6c9c0ece46c2ec731a0b799272cc0b3d180d17128ee05955763d','The hand needs a pair. Keep 3m for an irregular three-sided wait. Between 7m and 2p, another 7m is more available because two 2p are already in your hand. Keeping 7m also allows a Mixed Sequences change on 8m. Discard 2p.'),
('9a4aead2-207c-4ef1-9b14-5807d0020763','6c0a8ee1c2fef1bfb99877cc14290a1e86aea9f9f2edc1dd2e86138720cd1a8d','Discard 4s. This loses seven improving copies compared with discarding 1m, but retains valuable Common Ends and Twin Sequences possibilities. Calling Chii on 1m or 9p can create ready with a Common Ends possibility.'),
('9b8b6483-26ef-43ec-923c-2826b7a2c982','cbe430b6f2cbf611ce2344f4b70e16e9b2631489d8f714596f0ecff385a66db8','Discard 1p for flexible one-shanten. The key is keeping two pair candidates.'),
('9cbbf300-bcbc-4dfe-a4ca-ac8ff3a2a127','5ca6ef16f08a64bc25a570095f694e3135f07f143ac5b43d80fd073f62c5d555','Discard 8s to favor the wider closed Riichi route. Keeping every Bamboo tile may make calls on 6s or 8s attractive, but ease of calling is not the only consideration; preserve strong closed-hand acceptance.'),
('9cc3bbe5-466d-4ca6-b830-83216a94ef41','6d6cb7a29307c9270c3417be95813772b52d3f04349f5caf21b3733424f20394','There are six blocks. Keep the dora 3p pair and the flexible 7p pair. Of the two closed blocks, 2s4s can combine with 6s7s8s for a three-sided wait after 5s. Remove the weaker 2m4m block, beginning with 2m.'),
('9fff6476-a5b3-404c-8d2f-c3e87714c935','ae69f0b26dc8e525e8c441ce253740b4407d43402390e7df5524840896830340','Discard 8m. The Bamboo extension offers two types of draws to reach two-sided ready, while drawing 7p into 4p5p6p8p creates a three-sided wait. Keep both of those possibilities.'),
('a70aedd0-449d-4baa-9715-b66b40984857','8cde2c755ee8f6b6304fc2833746ba9a79cd06eceae2f9850b30eddfe1b2c53e','Discard the ordinary 5m while retaining the red 5m. Aim for Riichi on a good wait and keep the possibility of pairing either end of 5s6s7s8s.'),
('a7cd5b42-1d3b-4716-9348-0ffff7243290','414c923bf4256ca776ceccd730e1d86a0a8d4d23290db96b6b23420729e057ad','Compare final waits, not just immediate acceptance. Discarding 7p and 8s accepts the same number of tiles, but discarding 7p can lead to a three-sided wait when draws such as another 2p bring the hand to ready.'),
('a862fc0e-f262-40f4-b881-5c46b50e02c0','c8bb3dcc74e51bd664d8f9a991443a7d504b25d1b763f25f2ddc1c54c6d64b2e','Follow the basic preference for two-sided blocks over closed blocks over edge blocks. Start dropping the weakest 8m9m edge block with 9m.'),
('aaa84677-2289-453b-831f-c6e18071cea7','9239e89a07c7aa51f8db6498782889ac17871a20c86bf58079ed5718cf556aed','Discarding 8p is widest immediately, but discard 2p here to retain Mixed Sequences in 7–8–9.'),
('ac783f4a-14ff-4d54-a38f-bfe42925d331','45b4627209c1f0d66fc6031c9bd57aa4d37d4aec6ab78d0d91928a557a9d02d8','Keep 7m8m8m flexible as either the pair or a two-sided block. A four-tile consecutive shape is more likely to produce two-sided ready than the Bamboo sequence-plus-pair shape here. Discard 3s.'),
('b06a571e-fd39-4b6a-ba30-7d285a933643','50eb2e930255a11485ca202a39207fe2e9d02c640c2b9c7012e8f7eb097c7645','Discard 1p to favor a two-sided ready hand.'),
('b17582df-2bf1-44fa-8d75-27811b3681eb','268eca93ef6fb9f162522a317cf04d46cf3adbbf0cc391d7bf174c8800c32447','Even if 3s or 5s connects to the isolated 4s, Mixed Sequences is not guaranteed. Discard 4s, retaining Full Straight potential while maximizing draws to ready.'),
('b1b3af40-aded-474e-ae03-04f878678502','2abbe397ed4ea274e9923839a1497126f96ec6f13060344bbf2e7296d7726067','Set aside 5p6p7p and inspect the remaining shape. Fixing the Bamboo pair gives wider acceptance, so discard 4s.'),
('b363741c-d6dd-4e20-8fcf-4afc59f89b06','cee7be6ef2f5e14337c0343e8934e8dcb2506477fec6541e5b3ccd056d79b645','Fix the strong part of the hand and keep support around the weaker part. Retain all of 6p6p8p and discard 6m. If a Circles draw brings the hand to ready, the Characters can supply a 5m/8m Riichi wait.'),
('b4d8e499-e02a-4cb7-bf5f-b98017ef08f5','2b0174eb1c31be038cb176518a7c12c6eee7f2daeefa2c38069de3dce757594c','There are six blocks. Remove the weakest 2p4p block, starting with 2p. Preserve two possible pairs until the hand is ready.'),
('b54429ab-45ee-4abe-aaf8-c45f1e9fedd9','50289a4238532dc9b5cffc8aaf05f094ce3044135c3461f891b98d3c88617c93','Discard 8p so a double-pair wait can use Red Dragon and the terminal 9p, rather than the less attractive 8p.'),
('b5b65a43-25a2-419e-adae-73445a9f79f7','ce3682eddc1f535cc69a58ca3ec8ae5ae4154ecf6761ac89be2a5c2f801a3dfb','Discard 1s. Keep the valuable isolated 5m together with 7p8p8p so you can use it either in a sequence or as the pair. Drawing 4m or 6m can use 8p as the pair; pairing 5m instead leaves a 6p/9p wait.'),
('b79c01a4-8f61-480d-94ed-16eb20c01660','981ac825c922318d895f62c61df2f8da2a2d75ddcad782875cba8b5535e2bc72','Discard 8s. The Characters shape combines a two-sided 4m/7m acceptance with a closed 2m acceptance, so keep it intact.'),
('b7cd4e7c-fe86-4189-81c6-72d2e1cbe442','c709edef49ccb2d2dc5f3ce2044529c7b35bd38348009ab4400a75ed29b1c0e5','The Circles block’s two-sided acceptance comes from 5p6p waiting on 4p/7p. Discard 9p to retain the ability to reach ready by drawing 8p too.'),
('b7fcc119-61a5-497b-bdb5-718dbc8b8b34','b95347ff108477e4fdb24d7df9705d76226ebdf7e7b710502e79ebb722648b01','Discarding 7s gives the widest immediate acceptance, but discard 1p here to retain All Simples and Twin Sequences possibilities.'),
('ba0ce902-86d1-4717-bfff-9bf91007c556','75f338b9d90b3e111052995b923cf73b117cbd58ded6bc0bad1624d2cfb7ab2c','Cutting into 3s4s4s4s5s6s loses either 2s/5s or 4s/7s acceptance. Discard 4p to retain an independent two-sided 3p4p block instead.'),
('ba4a8ad5-f906-4a13-8a84-47431bab6017','c045b612ec4276d4eb2174c6e0c4615f4756a1b04b2ac02172f35afc4c3d56f8','Discard 7s to maximize acceptance while preserving several routes to a good ready shape. Keep the Characters and Circles two-sided connections intact.'),
('be5fa686-116b-45bd-ab1c-a0e43c5c410e','e38b0a64a33b16acea359cb61e0ca534fdc5fa7877fc4433b4e5b487784ef188','The Characters shape has overlapping acceptance, but it is still worth keeping over the weaker Circles closed shape. Discard 7p and aim for Riichi with a stronger final wait.'),
('c1c96214-58ca-4e31-a3d1-65e89d94bd28','3ff3cb9fb4a1d84920fdcae55121e499ac57215a5b960b175cf59178688ee9a9','Discard 9s to pursue All Simples and Mixed Sequences. Do not casually discard 7p: doing so would miss ready on a 5s draw.'),
('c3aeb969-3ba4-42ad-8778-76a113e423e0','ae71229fe583f6607ead529cc18dac47e621348e9d77152b1bd447c94c9c783e','With two dora, the hand already has enough value. Discard 6m and retain 7p8p8p alongside 2s3s4s5s for a balance of acceptance and good waits. Bamboo draws from 1s through 7s improve the hand; 1s through 6s can produce two-sided ready.'),
('c567132d-990f-4450-9e4f-9f128f70fe57','e2089bab4a5fd8d10b87a3e65fa4c51aa4c88fd0a6df8c6b0f70491ab85bb70e','Discard 8s for maximum acceptance. Discarding 5m early loses four improving copies, and the hand can still reach ready after drawing a red 5m. The original analysis gives little reason to make that sacrifice, especially as dealer.'),
('cf2fd289-e54c-4e33-84e4-ffbfbcab8a38','b8129fac23150b5721e5f706cd273856d7d0e57c32ab77bab142927caf6ae93c','There are six blocks. Remove 1s2s and pursue All Simples.'),
('d0e053b4-b689-43c2-b46c-f15a8d59ba35','389e1357d5b6606aa92e424646f957252cb7097c1951a09ec3f3c1078dbde809','Discarding 4s or 4m gives maximum immediate acceptance. Compare favorable shape changes: 4m leaves two improving types in Bamboo, while 4s leaves three in Characters. Prefer 4s.'),
('d107d67e-1da3-49a0-8def-4d76f40200d0','0dd2801676fc6b5b742dcb59758a7efac3a376b2daefc6480a35c73e29476f82','Discarding 4m or 6s gives flexible one-shanten. Compare recovery after a missed draw. After discarding 4m, a later 6m can replace 9m to secure All Simples, making 4m the better choice.'),
('d1678fce-e48e-4221-bd16-f4580372ef11','ac7e7a4c277bb466b6ff57a50b4281efd62043d3ea6f027324079ce8f0f3966f','Mixed Sequences potential matters here. Drawing 4s or 5s can lead toward 4–5–6 Mixed Sequences, so retain 6s7s7s for both wait quality and value. Discard 3p.'),
('d1db6765-498f-414a-82a7-e526fbbc5f25','2eab10ad29fa00b52efaf6e16b4d1acd7f2f6c0de5512640ad9fa2479639b8dc','Discarding 4p, 8p, or 9s has equal acceptance. Keep the weaker 4p6p8p block supported and preserve the Bamboo two-sided portion. Discard 9s to favor a two-sided final wait.'),
('d6d63949-a782-4db1-b101-4b5bad4a3bc6','5e57521e0ae4ec32a52c702900b5ea933f148e90d2450d9775a2bb6f97e72d34','Both 1m and 8p look expendable, but drawing 2m still brings the hand to ready without 1m. Keep 8p as a tile that can form a two-sided block in one draw, and discard 1m.'),
('da331d58-a07e-4ba3-823d-a97251a1c1bd','d61dbcc760894bfbe2194f2fd89fa81685abbee6545796ed8ec7d4d0d1bdb840','Three sets and a pair are already secured, so look for a two-sided incomplete sequence. Keep 1s: drawing 2s turns 1s3s4s5s into a sequence plus the two-sided 4s5s block. Discard 9m.'),
('daf7f2ed-8b0b-4a4b-93dc-589fedf5e7f1','dbc866f7dca96be1d858a7834df1af463eb9f8adde58a4f6782c5b665519c987','Discard 5s. Dropping 9p does not secure All Simples anyway, because drawing 1m would also break that yaku.'),
('dcdb78eb-0b92-40b8-a0e0-df74290c6616','7f0a8142495d4fa0f5efff9485e9ffb66e3e0ae07c4ebbbf0aafd5acd8ce1ea2','There are six blocks and an All Simples possibility. Drop 8m9m. Discarding 5p instead would lose the chance of building around additional 3p or 5p copies.'),
('df8d8c56-675c-4c68-87ba-15550a6fc593','1609e4d430d175b2b33ef0cda5178462726fac55f1ee6ae298262f5c4eac049d','Discarding 7p or 7s gives flexible one-shanten. Keeping 7s could add both All Simples and Twin Sequences, but a 9s draw loses both. Prefer 7s to secure the more reliable All Simples han.'),
('e51820f9-75d0-40e7-9256-5106011bb127','cb129db1b5d97023051f9212440ea57e23cd51686a00c44d43795724f6dba720','Keep the value of the Red Dragon pair and the possibility of waiting on it. Discarding 8s rather than 8m preserves a potential irregular three-sided final wait.'),
('e9abb622-ee74-49d5-a6b2-c7f1d4651490','1d73cf188673a58d0cc8a5c40a5b68a72c388427d52af115952947d48c0973cb','There are six blocks. Discard one 6s from 6s6s7s7s, leaving a flexible three-tile shape.'),
('ecccce45-bbfa-4b4e-b841-02fbba68daab','1e5af103b2f470f967c22750e9dc71ccff78dc6407e66c1fe863d0783c33e9b5','Keep the option of calling Pon on the dora and ending with a good wait. Compare the 6m8m and 7s9s closed blocks; retaining 7s9s gives better final-shape and improvement possibilities here. Discard 8m.'),
('eeb40e90-94ca-4e49-a2d7-7c6d3af81dad','b207ef6a6b4b36cd77b244207879f3f23a091f03b489f3768aca8c579ba49509','Discard 4m. Keep the flexible 7s8s8s block together with four consecutive Circles tiles. This combination allows many draws to produce two-sided ready and is favored for win probability and expected value in the original analysis.'),
('efed644a-6c82-439d-bb2d-db0c17a6472a','d6bf25bb0a361a6c18d0438d7652a69279a947e2dceac8f8f683b9f6c3a3313d','Discarding 7p or 3s gives flexible one-shanten. The Bamboo shapes overlap on 4s, but they offer Full Straight and three-sided-wait possibilities. Keep those possibilities and discard 7p.'),
('f37ef0af-0a82-4544-a267-1c04acc999d3','2c95e86b1fafcb2d426d4a99d978d7d94d82bc8d297c70ab68ef677c1a781616','Discard 8p for maximum acceptance. If 4m or 7m arrives first, you can choose between the two-sided 4s/7s wait and an irregular wait on 2s, 5s, or 6p.'),
('f50f53dc-4965-458e-b59b-7762fbdb7d5b','2c7224f9745e52853fbd66df0cb1acfaa461d34bf0943844c99743ce5422e07b','Discard 8s. Retain the Red Dragon pair as a possible yaku and keep 6p6p8p supported while the stronger Bamboo shape remains flexible. Compare the final waits rather than breaking the value pair.'),
('f6a0462e-a9ed-49c4-b0ef-7014360f71c9','54814eccaf1ce7fbb2c1f5ccc896ca2ac05ee7a02ede6874d990a93821baae96','Discard 8m for maximum acceptance. The 3p4p4p5p6p8p shape combines two-sided and closed-wait acceptance, so preserve it.'),
('f6c1945e-1a95-4d05-adde-f09a0fb94aa6','af9b657bf65f7177fbf60855d120f1e69eaeba439635deb1e1f3a20a1e826bcc','Think about the eventual two-sided waits. Drawing 6p into 3p4p5p7p can create a three-sided wait, as can drawing 4s into 5s6s7s8s. Keep both shapes and discard 7m.'),
('f6e32d1a-ab11-4f48-90bc-840372c2a083','727c34e4b6cff9d14c32acc003679ecb5fb570b54e4af6ad335300f89b0c3a4b','Discard 2s for the widest acceptance. Discarding 5s makes Pinfu harder to achieve.'),
('fb3e7477-5950-4648-8f77-bdc44d1fcd20','297779ab6c3d42ba536fbe6acd42fa7bd0d3c48736934d1451db7c4d2f89743d','The middle-heavy 2p3p3p4p shape makes two-sided blocks easily but forms a pair only by drawing another 3p. Fix 8s as the pair and keep isolated 4m for connections. Discard 7s.'),
('fb786095-1915-4ab0-b03b-97da6876283f','03fb547beacc4e10578d5280fa619e6db816a6ad59fb68aee6934c8cecd3126d','Discard 5s. Preserve the chance to call Pon on the dora and retain a good final wait after that call.'),
('fe3de4be-b54f-469d-bf83-87abea5fda6a','ef69898586d3748956705a6abc77a9a208698e30b920ab31bfd05a8b8f9fb484','Discard one 4m, retaining the 4m5m two-sided block and the other pair candidates. This hand has more blocks than a standard hand needs, so compare which shape can lose a tile while preserving useful connections.'),
('ff71a9b5-8ba1-4cf9-9c5b-e9deae4a49f5','255afcfe396ddf2a747ce1d9dac4d43e6edb3c8b5e0fe9c7ee96e683cf3448d3','Three sets and the pair are nearly secured, so the hand needs a two-sided incomplete sequence. Keep both 2p and 5p to retain routes to 1p/4p and 3p/6p waits. Discard Red Dragon.')
  )
  update public.problems_casual p set description_en = t.english
  from translations t
  where p.id::text = t.id
    and encode(sha256(convert_to(coalesce(p.description, '') || chr(31) || p.tiles_str || chr(31) || p.correct_discards, 'UTF8')), 'hex') = t.source_hash;
  get diagnostics affected = row_count;
  if affected <> 120 then
    raise exception 'English migration source changed in problems_casual: expected 120, updated %', affected;
  end if;
end;
$migration$;
commit;

# QuestVault

A Blooket-inspired multi-subject learning web application built around a shared Token, Mystery Pack, and Collectible Vault economy. The MVP ships with the English (ELA) Subject spanning four difficulty tiers (Grade 2–3 Bridge through Grade 4+ Challenge).

## Language

### Platform & Subjects

**Subject**:
A pluggable learning domain registered in QuestVault (such as `english`, and future `math` or `chinese`) that provides Quest Sets and interactive Run stages while feeding into the shared Token and Vault economy.
_Avoid_: Course, module, track, app

**Quest Set**:
A subject-tagged playable unit that powers a Run (in the English Subject, each Quest Set is a Word Set).
_Avoid_: Deck, lesson, level, pack

**Difficulty Tier**:
One of four calibrated vocabulary levels (`Tier 1: Grade 2–3 Bridge`, `Tier 2: Grade 3 Core`, `Tier 3: Grade 4 Core`, `Tier 4: Grade 4+ Challenge`) used to match content to the Player's true reading vocabulary rather than chronological grade alone.
_Avoid_: Grade, difficulty mode, band

### Player & Progression

**Player**:
The child using QuestVault on a device, represented by a local profile holding their equipped Collectible avatar, Token balance, Vault, active Difficulty Tier, Word Mastery stats, Run history, and Writing Log.
_Avoid_: User, student, account, kid, learner

**Token**:
The cross-subject in-game currency earned from Run answers, Combo multipliers, completion Chests, Placement Quest bonus, and selling duplicate Collectibles, spent exclusively in the Pack Market.
_Avoid_: Coin, point, gold, credit

**Placement Quest**:
A short 8-question adaptive warm-up Run that calibrates the Player's starting Difficulty Tier without feeling like a formal diagnostic test, rewarding a 50-Token starter bonus.
_Avoid_: Diagnostic test, exam, assessment

**Word Mastery**:
Per-word tracking (`seen`, `correctFirstTry`, `missed`, `usedInWriting`) stored for each Player to classify words as `Tricky`, `Learning`, or `Mastered` for parent visibility and targeted review.
_Avoid_: Score, stats, gradebook

**Tricky Word Rematch**:
A dynamically generated 1.5× daily bonus-Token Run built from the Player's own `Tricky` words to turn missed vocabulary into a high-reward boss challenge (capped once per day).
_Avoid_: Remedial quiz, error review, extra homework

### English Subject (ELA)

**Word Set**:
An English Quest Set containing 5 Target Words calibrated to a Difficulty Tier.
_Avoid_: Deck, lesson, unit, list, pack

**Custom Word Set**:
A parent-created Word Set imported by pasting a weekly school vocabulary list, playable through the same Run loop as built-in Word Sets.
_Avoid_: Homework list, user deck, custom pack

**Target Word**:
A single vocabulary entry in a Word Set, containing its kid-friendly definition, plain-English bridge, context clue sentence, upgrade draft, and example tip.
_Avoid_: Term, vocab item, card

### Gameplay Loop

**Run**:
A single 5–8 minute playable session on one Word Set progressing through four stages — Word Spotlight, Word Sprint, Sentence Upgrade, and Writer's Forge — ending with a Token Chest.
_Avoid_: Game, quiz, lesson, level, session

**Word Spotlight**:
Stage 0 (Teach First) of a Run where the Player previews each Target Word's pronunciation, plain-English meaning, and vivid example before being tested.
_Avoid_: Study sheet, lecture, flashcard dump

**Mastery Queue**:
The anti-brute-force answer queue in Word Sprint and Sentence Upgrade: a missed question pauses to teach the meaning, awards zero Tokens, and moves to the back of the queue until answered cleanly.
_Avoid_: Retry button, penalty loop, game over

**Combo**:
Consecutive clean answers during a Run that boost Token payouts per question.
_Avoid_: Streak, multiplier, chain

**Sentence Upgrade**:
Stage 2 of a Run where the Player replaces plain words in a draft sentence with vivid Target Words and watches the sentence level up.
_Avoid_: Fill-in-the-blank, grammar quiz

**Writer's Forge**:
Stage 3 of a Run where the Player writes an original 1–2 sentence response using Target Words to unlock the Run's bonus Token Chest.
_Avoid_: Essay, free writing, homework

**Writing Check**:
A deterministic, encouraging checklist run on a Writer's Forge sentence (uses Target Word, starts with a capital letter, ends with punctuation, includes enough distinct descriptive words).
_Avoid_: Grader, AI feedback, error check

**Writing Log**:
The persistent archive of a Player's Writer's Forge sentences alongside the Word Mastery overview so the Player and parents can review growth together.
_Avoid_: History, journal, portfolio

### Rewards & Collection

**Pack Market**:
The shared shop where Players spend Tokens earned from any Subject to open themed Mystery Packs (`Critter`, `Sweet`, `Space`, `Ocean`, `Dino`, `Magic`).
_Avoid_: Store, gacha page, shop

**Mystery Pack**:
A themed collectible pack in the Pack Market that reveals one random Collectible with an animated pack-opening sequence.
_Avoid_: Loot box, booster, gacha, word set

**Collectible**:
An illustrated square character or charm drawn from a Mystery Pack, assigned one of six Rarity tiers (`Common`, `Uncommon`, `Rare`, `Epic`, `Legendary`, `Chroma`), usable as the Player's avatar.
_Avoid_: Blook, pet, sticker, badge

**Vault**:
The Player's 48-slot collection album showing discovered Collectibles, silhouettes of undiscovered ones, duplicate counts, avatar equipping, and duplicate-to-Token selling.
_Avoid_: Inventory, album, gallery

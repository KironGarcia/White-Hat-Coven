<p align="center">
  <a href="README.md">Português</a> · <strong>English</strong>
</p>

<p align="center">
  <img src="midia/TUMB-WHC.jpeg" alt="White Hat Coven" width="100%">
</p>

## What is cybersecurity’s real enemy?

It is not this week’s malware. It is the lack of information — and the human factor.

There is no device, anywhere in the developed world, that can defend a home system if an uninformed person leaves the factory password on the camera.

This started as an IoT protection project. It pivoted into an educational security game because the only way to hit the problem at the root is to deliver knowledge. The obstacle: almost nobody wants to learn security. It is boring. It is alarming. It sounds like specialist stuff.

White Hat Coven was born from that premise: implant the real anger of being in the middle of your life — and your game — when someone hacks your system. In that moment, knowledge stops being a lesson and becomes the only tool that actually erases a huge slice of digital security problems.

## How the game works

You are a beginner mage in the White Hat coven. The mission is to go out and fight the Black Hats: hackers who hijack the screen in the middle of a run.

The genre is an endless vertical platformer. Highest climb wins. But it is not a generic game of that type. You get into flow — then a boss invades the run like a real attack. You can fight without learning anything: it is possible, just much harder and slower. Or you stop, take in a security technique, gain an edge (an enchantment), and come back to beat the invader.

Knowledge is power. Literally.

## Who the game was designed for

Three people. Three doors in. One household.

### Rafael

Rafael is the entry audience: the adult in the tech niche, connected, nostalgic for older games. He was designed to be the first tester — and the first to spread the idea. He already knows enough tech to care. What hooks him is not a security speech. It is the control, the record, a fair fight with the boss.

### Gabriel

Every Rafael has, further down the timeline, a Gabriel.

Gabriel is 14 to 20. He is a student. He loves games. He is the seed of the future: the group that makes today’s habits last. If he grows up with digital security awareness, the effect outlives Rafael and Cláudia. The way to reach him is partnership with schools — putting access in front of young people where they already are.

### Cláudia

Every Rafael and every Gabriel has a Cláudia at home.

Cláudia is the main target. One day the goal is to reach her: an ordinary person who does not understand tech or security, but lives surrounded by smart devices — and that number only grows. It is a delicate group. They do not like being alarmed for no reason. The game exists because there is no better way to learn something you do not want to learn than by playing — and realizing, only later, that you learned it.

## What hooks people: competition

White Hat Coven’s main hook is not a class. It is a contest.

The game is designed for ranking — and, soon, altitude battles. The problem with many games today is how fast they get boring. Competition breaks that.

Rafael starts playing, gets hooked, and challenges his aunt, his mom, the Cláudia in the house to beat his record. Then he challenges Gabriel. Gabriel’s friends join. Rafael’s friends join too. Cláudia’s family and people she knows enter the same ranking. The ranking is global, but it filters by zone: you compete with people in your city for the top spot.

Later come the battles: you pick anyone on the ranking and find out, in practice, who climbs higher.

## Architecture

| Layer | Stack |
| --- | --- |
| App | Expo SDK 53, React Native 0.79, React 19 |
| Language | TypeScript |
| Controls | Motion sensors (tilt) — the mage moves with the phone |
| Current save | Local, on the device (`AsyncStorage`) |
| Audio | expo-av |
| Build | EAS (Expo Application Services), `preview` profile for testers |
| Platform | Android now (`com.whitehatcoven.demo1`) |

The game lives in this repository. It has its own house: it is not a minigame glued onto another app.

## Art

Every visual asset in the game — sprites, scenes, icons, the cover above — was designed and created by Kiron Garcia. Original pixel art, not a sprite pack.

## Why this matters

Digital security will not be solved by a smarter product alone. As long as the factory password stays on the living-room camera, the home system stays open.

White Hat Coven does not ask you to sit through a talk. It asks you to climb. When the screen gets hijacked, you will want to know why — and that is when knowledge stops being homework and becomes the weapon that lets you win.
